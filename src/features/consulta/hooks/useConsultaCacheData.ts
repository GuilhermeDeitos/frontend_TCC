import { useState, useEffect, useCallback } from "react";
import type { ConsultaParams } from "../types/consulta";
import type { FilterConfig } from "../components/CompactFilterPanel";
import type { DadosConsulta } from "../types/consulta";

export interface IParamsOriginais {
  mesInicial: string;
  anoInicial: string;
  mesFinal: string;
  anoFinal: string;
  tipoCorrecao: string;
  ipcaReferencia: string;
}

// Cache completo com DADOS
interface ConsultaCacheCompleto {
  id: string;
  timestamp: number;
  expiresAt: number;
  params: ConsultaParams;
  paramsOriginais?: IParamsOriginais;
  filters?: FilterConfig[];
  visualizacao?: "tabela" | "grafico";
  descricao: string;
  totalRegistros: number;
  dados: DadosConsulta[]; // DADOS COMPLETOS SALVOS
}

// Histórico - APENAS metadados (sem dados)
interface ConsultaMetadata {
  id: string;
  timestamp: number;
  params: ConsultaParams;
  paramsOriginais?: IParamsOriginais;
  filters?: FilterConfig[];
  visualizacao?: "tabela" | "grafico";
  descricao: string;
  totalRegistros: number;
}

const CACHE_KEY = "consulta_cache_completo";
const HISTORICO_KEY = "consulta_historico";
const MAX_HISTORICO = 5;
const CACHE_DURACAO_MS = 24 * 60 * 60 * 1000; // 24 horas

export function useConsultaCache() {
  const [consultaAtual, setConsultaAtual] = useState<ConsultaCacheCompleto | null>(null);
  const [historico, setHistorico] = useState<ConsultaMetadata[]>([]);

  // Carregar cache e histórico ao iniciar
  useEffect(() => {
    try {
      const agora = Date.now();

      // Verificar cache completo
      const cacheStr = localStorage.getItem(CACHE_KEY);
      if (cacheStr) {
        const cache: ConsultaCacheCompleto = JSON.parse(cacheStr);

        if (cache.expiresAt && cache.expiresAt < agora) {
          console.log("Cache expirado apos 24h, removendo...");
          localStorage.removeItem(CACHE_KEY);
        } else {
          console.log(`Cache valido restaurado com ${cache.dados?.length || 0} registros`);
          setConsultaAtual(cache);
        }
      }

      // Carregar histórico
      const historicoStr = localStorage.getItem(HISTORICO_KEY);
      if (historicoStr) {
        const hist: ConsultaMetadata[] = JSON.parse(historicoStr);
        console.log(`Historico carregado: ${hist.length} consultas`);
        setHistorico(hist);
      }
    } catch (error) {
      console.error("Erro ao carregar cache:", error);
      // Se houver erro (dados corrompidos), limpar tudo
      limparTudo();
    }
  }, []);

  const criarIdentificadorConsulta = useCallback((params: ConsultaParams): string => {
    return `${params.data_inicio}-${params.data_fim}-${params.tipo_correcao}-${params.ipca_referencia}`;
  }, []);

  // Salvar cache COMPLETO (com dados)
  const salvarCacheCompleto = useCallback(
    (
      params: ConsultaParams,
      dados: DadosConsulta[],
      filters?: FilterConfig[],
      visualizacao?: "tabela" | "grafico",
      paramsOriginais?: IParamsOriginais
    ) => {
      if (dados.length === 0) {
        console.log("Tentativa de salvar consulta vazia - ignorado");
        return;
      }

      const agora = Date.now();
      const descricao = gerarDescricaoConsulta(params);

      const cacheCompleto: ConsultaCacheCompleto = {
        id: `cache-${agora}`,
        timestamp: agora,
        expiresAt: agora + CACHE_DURACAO_MS,
        params,
        paramsOriginais,
        filters: filters || [],
        visualizacao: visualizacao || "tabela",
        descricao,
        totalRegistros: dados.length,
        dados, // SALVAR DADOS COMPLETOS
      };

      try {
        const cacheStr = JSON.stringify(cacheCompleto);
        const tamanhoMB = (cacheStr.length / (1024 * 1024)).toFixed(2);
        
        console.log(`Salvando cache completo: ${dados.length} registros (${tamanhoMB} MB)`);
        
        localStorage.setItem(CACHE_KEY, cacheStr);
        setConsultaAtual(cacheCompleto);
        
        console.log(`Cache completo salvo com sucesso (expira em 24h)`);
      } catch (error) {
        console.error("Erro ao salvar cache:", error);

        if (error instanceof Error && error.name === "QuotaExceededError") {
          console.warn("LocalStorage cheio! Tentando comprimir dados...");
          
          // Tentar salvar apenas os 1000 primeiros registros
          const dadosReduzidos = dados.slice(0, 1000);
          const cacheReduzido: ConsultaCacheCompleto = {
            ...cacheCompleto,
            dados: dadosReduzidos,
            totalRegistros: dadosReduzidos.length,
          };

          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheReduzido));
            setConsultaAtual(cacheReduzido);
            console.warn(`Cache salvo com dados reduzidos: ${dadosReduzidos.length} registros`);
          } catch {
            console.error("Impossivel salvar cache mesmo com dados reduzidos");
            limparCache();
          }
        }
      }
    },
    []
  );

  // Adicionar ao histórico (apenas metadados)
  const adicionarAoHistorico = useCallback(
    (
      params: ConsultaParams,
      totalRegistros: number,
      filters?: FilterConfig[],
      visualizacao?: "tabela" | "grafico",
      paramsOriginais?: IParamsOriginais
    ) => {
      const identificador = criarIdentificadorConsulta(params);
      const descricao = gerarDescricaoConsulta(params);

      const metadata: ConsultaMetadata = {
        id: `hist-${Date.now()}`,
        timestamp: Date.now(),
        params,
        paramsOriginais,
        filters: filters || [],
        visualizacao: visualizacao || "tabela",
        descricao,
        totalRegistros,
      };

      setHistorico((prev) => {
        const historicoFiltrado = prev.filter(
          (c) => criarIdentificadorConsulta(c.params) !== identificador
        );

        const novoHistorico = [metadata, ...historicoFiltrado].slice(0, MAX_HISTORICO);

        try {
          localStorage.setItem(HISTORICO_KEY, JSON.stringify(novoHistorico));
          console.log(`Historico atualizado: ${novoHistorico.length} consultas`);
        } catch (error) {
          console.error("Erro ao salvar historico:", error);
        }

        return novoHistorico;
      });
    },
    [criarIdentificadorConsulta]
  );

  // Salvar consulta (cache completo + histórico)
  const salvarConsulta = useCallback(
    (
      params: ConsultaParams,
      dados: DadosConsulta[],
      filters?: FilterConfig[],
      visualizacao?: "tabela" | "grafico",
      paramsOriginais?: IParamsOriginais
    ) => {
      salvarCacheCompleto(params, dados, filters, visualizacao, paramsOriginais);
      adicionarAoHistorico(params, dados.length, filters, visualizacao, paramsOriginais);
    },
    [salvarCacheCompleto, adicionarAoHistorico]
  );

  const obterMetadadosHistorico = useCallback(
    (consultaId: string): ConsultaMetadata | null => {
      const consulta = historico.find((c) => c.id === consultaId);
      if (consulta) {
        console.log("Metadados obtidos do historico:", consulta.descricao);
        return consulta;
      }
      return null;
    },
    [historico]
  );

  // Obter dados do cache (se válido)
  const obterDadosCache = useCallback((): DadosConsulta[] | null => {
    if (!consultaAtual) return null;

    const agora = Date.now();
    const valido = consultaAtual.expiresAt > agora;

    if (!valido) {
      console.log("Cache expirado");
      limparCache();
      return null;
    }

    console.log(`Retornando ${consultaAtual.dados?.length || 0} registros do cache`);
    return consultaAtual.dados || null;
  }, [consultaAtual]);

  const cacheEstaValido = useCallback((): boolean => {
    if (!consultaAtual) return false;

    const agora = Date.now();
    const valido = consultaAtual.expiresAt > agora;

    if (!valido) {
      console.log("Cache expirou");
      limparCache();
    }

    return valido;
  }, [consultaAtual]);

  const getTempoRestanteCache = useCallback((): string | null => {
    if (!consultaAtual || !cacheEstaValido()) return null;

    const agora = Date.now();
    const diferencaMs = consultaAtual.expiresAt - agora;

    const horas = Math.floor(diferencaMs / (1000 * 60 * 60));
    const minutos = Math.floor((diferencaMs % (1000 * 60 * 60)) / (1000 * 60));

    if (horas > 0) {
      return `${horas}h ${minutos}min`;
    }
    return `${minutos}min`;
  }, [consultaAtual, cacheEstaValido]);

  const limparCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
      setConsultaAtual(null);
      console.log("Cache limpo (historico mantido)");
    } catch (error) {
      console.error("Erro ao limpar cache:", error);
    }
  }, []);

  const limparHistorico = useCallback(() => {
    try {
      localStorage.removeItem(HISTORICO_KEY);
      setHistorico([]);
      console.log("Historico limpo (cache mantido)");
    } catch (error) {
      console.error("Erro ao limpar historico:", error);
    }
  }, []);

  const limparTudo = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(HISTORICO_KEY);
      setConsultaAtual(null);
      setHistorico([]);
      console.log("Cache e historico completamente limpos");
    } catch (error) {
      console.error("Erro ao limpar tudo:", error);
    }
  }, []);

  const removerDoHistorico = useCallback((consultaId: string) => {
    setHistorico((prev) => {
      const novoHistorico = prev.filter((c) => c.id !== consultaId);

      try {
        localStorage.setItem(HISTORICO_KEY, JSON.stringify(novoHistorico));
        console.log("Consulta removida do historico");
      } catch (error) {
        console.error("Erro ao remover do historico:", error);
      }

      return novoHistorico;
    });
  }, []);

  const atualizarFiltros = useCallback(
    (filters: FilterConfig[]) => {
      if (consultaAtual && cacheEstaValido()) {
        const cacheAtualizado = {
          ...consultaAtual,
          filters,
          timestamp: Date.now(),
        };

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheAtualizado));
          setConsultaAtual(cacheAtualizado);
        } catch (error) {
          console.error("Erro ao atualizar filtros:", error);
        }
      }
    },
    [consultaAtual, cacheEstaValido]
  );

  const atualizarVisualizacao = useCallback(
    (visualizacao: "tabela" | "grafico") => {
      if (consultaAtual && cacheEstaValido()) {
        const cacheAtualizado = {
          ...consultaAtual,
          visualizacao,
          timestamp: Date.now(),
        };

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheAtualizado));
          setConsultaAtual(cacheAtualizado);
        } catch (error) {
          console.error("Erro ao atualizar visualizacao:", error);
        }
      }
    },
    [consultaAtual, cacheEstaValido]
  );

  return {
    consultaAtual,
    historico,
    salvarConsulta,
    obterMetadadosHistorico,
    obterDadosCache, // NOVO: retorna dados do cache
    cacheEstaValido,
    getTempoRestanteCache,
    limparCache,
    limparHistorico,
    limparTudo,
    removerDoHistorico,
    atualizarFiltros,
    atualizarVisualizacao,
  };
}

function gerarDescricaoConsulta(params: ConsultaParams): string {
  const [mesIni, anoIni] = params.data_inicio.split("/");
  const [mesFim, anoFim] = params.data_fim.split("/");

  const meses = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];

  const mesIniNome = meses[parseInt(mesIni) - 1];
  const mesFimNome = meses[parseInt(mesFim) - 1];

  return `${mesIniNome}/${anoIni} ate ${mesFimNome}/${anoFim}`;
}