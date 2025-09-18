import { useState, useEffect,useCallback, useRef } from 'react';
import type { DadosConsulta, ConsultaParams } from '../types/consulta';
import api from '../utils/api';
import Swal from 'sweetalert2';

export function useTransparenciaData() {
  const [dadosConsulta, setDadosConsulta] = useState<DadosConsulta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [listaIPCA, setListaIPCA] = useState<{ value: string; label: string }[]>([]);
  const [listaIPCAAnual, setListaIPCAAnual] = useState<{ value: string; label: string }[]>([]);
  const mediasAnuaisCarregadas = useRef(false);

  // Buscar lista de IPCA disponíveis
  useEffect(() => {
    api.get("/ipca")
      .then((response) => {
        const opcoes = Object.entries(response.data.data).map(([key, value]) => ({
          value: key,
          label: `${key} - ${Number(value).toFixed(4)}`
        }));
        setListaIPCA(opcoes.reverse());
      })
      .catch((error) => {
        console.error("Erro ao buscar IPCAs:", error);
      });
  }, []);

  // Buscar médias anuais
  // Usar useCallback para manter a referência estável
  const carregarMediasAnuais = useCallback(() => {
    // Evitar carregar múltiplas vezes
    if (mediasAnuaisCarregadas.current || listaIPCAAnual.length > 0) {
      return;
    }
    
    // Definir anos relevantes apenas (2000-2025) ao invés de todos desde 1979
    const anosRelevantes = Array.from({ length: 26 }, (_, i) => (2000 + i).toString());
    const queryString = anosRelevantes.map(ano => `anos=${ano}`).join('&');
    
    console.log("Carregando médias anuais - chamada única");
    
    // Fazer a requisição diretamente sem depender da primeira consulta
    api.get(`/ipca/medias-anuais?${queryString}`)
      .then((response) => {
        const opcoesAnuais = Object.entries(response.data)
          .filter(([_, data]: any) => !data.erro)
          .map(([ano, data]: any) => ({
            value: ano,
            label: `${ano} - Média: ${data.media_ipca.toFixed(4)}`
          }))
          .sort((a, b) => b.value.localeCompare(a.value)); // Ordenar decrescente
        
        setListaIPCAAnual(opcoesAnuais);
        mediasAnuaisCarregadas.current = true;
      })
      .catch((error) => {
        console.error("Erro ao buscar médias anuais:", error);
      });
  }, []); // Sem dependências!

  const consultarDados = async (params: ConsultaParams) => {
    setIsLoading(true);
    setDadosConsulta([]);
    setLoadingMessage("Iniciando consulta...");

    try {
      // Usar fetch com streaming SSE
      const response = await fetch(`${api.defaults.baseURL}/transparencia/consultar-streaming`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let dadosAcumulados: DadosConsulta[] = [];
      let buffer = '';
      let eventBuffer = '';

      if (reader) {
        // Processar stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decodificar chunk
          buffer += decoder.decode(value, { stream: true });
          
          // Processar linhas completas
          const lines = buffer.split('\n');
          
          // Manter última linha (possivelmente incompleta) no buffer principal
          buffer = lines[lines.length - 1];
          
          // Processar cada linha
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            
            if (line === '' && eventBuffer) {
              // Linha vazia indica fim de um evento SSE
              // Processar o evento acumulado
              if (eventBuffer.startsWith('data: ')) {
                try {
                  const jsonStr = eventBuffer.substring(6);
                  const chunk = JSON.parse(jsonStr);
                  
                  if (chunk.status === "parcial") {
                    // Atualizar mensagem de progresso
                    setLoadingMessage(`Processando ano ${chunk.ano_processado}...`);
                    
                    // Processar dados parciais
                    const novosDados = processarDadosChunk(chunk, dadosAcumulados);
                    
                    dadosAcumulados = [...dadosAcumulados, ...novosDados];
                    setDadosConsulta([...dadosAcumulados]);
                    
                    // Mostrar progresso
                    console.log(`Processado ano ${chunk.ano_processado}: ${chunk.total_registros_ano} registros`);
                    
                  } else if (chunk.status === "completo") {
                    setIsLoading(false);
                    setLoadingMessage("");
                    
                    // Se houver dados não processados, mostrar aviso
                    if (chunk.total_nao_processados > 0) {
                      console.warn(`${chunk.total_nao_processados} registros não foram processados`);
                      console.log("Dados não processados:", chunk.dados_nao_processados);
                    }
                    
                    Swal.fire({
                      icon: "success",
                      title: "Sucesso",
                      html: `
                        <p>Dados consultados com sucesso!</p>
                        <p><strong>Total de registros:</strong> ${chunk.total_registros}</p>
                        ${chunk.total_nao_processados > 0 ? 
                          `<p><strong>Registros não processados:</strong> ${chunk.total_nao_processados}</p>` : 
                          ''}
                        <p><strong>IPCA de referência:</strong> ${chunk.periodo_base_ipca}</p>
                        <p><strong>Tipo de correção:</strong> ${chunk.tipo_correcao}</p>
                      `
                    });
                    
                  } else if (chunk.status === "erro") {
                    setIsLoading(false);
                    setLoadingMessage("");
                    
                    Swal.fire({
                      icon: "error",
                      title: "Erro",
                      text: chunk.erro || "Erro ao consultar dados"
                    });
                  }
                } catch (e) {
                  console.error("Erro ao processar evento SSE:", e);
                  console.error("JSON problemático:", jsonStr);
                }
              }
              // Limpar buffer do evento
              eventBuffer = '';
            } else if (line) {
              // Acumular linha no buffer do evento
              if (eventBuffer) {
                eventBuffer += '\n' + line;
              } else {
                eventBuffer = line;
              }
            }
          }
        }
        
        // Processar qualquer evento remanescente no buffer
        if (eventBuffer && eventBuffer.startsWith('data: ')) {
          try {
            const jsonStr = eventBuffer.substring(6);
            const chunk = JSON.parse(jsonStr);
            console.log("Processando buffer final:", chunk);
          } catch (e) {
            console.error("Erro ao processar buffer final:", e);
          }
        }
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: error.message || "Erro ao consultar dados. Por favor, tente novamente."
      });
      console.error("Erro na consulta:", error);
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  // Função auxiliar para processar dados do chunk
  const processarDadosChunk = (chunk: any, dadosAcumulados: DadosConsulta[]): DadosConsulta[] => {
    return chunk.dados.map((item: any, index: number) => {
      // Função para converter string monetária para número
      const converterValorMonetario = (valor: string | null | undefined): number => {
        if (!valor) return 0;
        return parseFloat(String(valor).replace(/\./g, '').replace(',', '.')) || 0;
      };
      
      // Extrair valores monetários dos dados
      const valorPago = converterValorMonetario(item.PAGO_NO_MES);
      const valorEmpenhado = converterValorMonetario(item.EMPENHADO_NO_MES);
      const valorLiquidado = converterValorMonetario(item.LIQUIDADO_NO_MES);
      
      // Extrair metadados de correção se existirem
      const correcaoAplicada = item._correcao_aplicada || null;
      
      return {
        id: dadosAcumulados.length + index + 1,
        ano: item._ano_validado || chunk.ano_processado,
        mes: parseInt(String(item.MES)) || 12,
        universidade: item.UNIDADE_ORCAMENTARIA || item.universidade || 'Não informado',
        valor_empenhado: valorEmpenhado,
        valor_liquidado: valorLiquidado,
        valor_pago: valorPago,
        funcao: item.FUNCAO,
        grupo_natureza: item.GRUPO_NATUREZA_DESPESA,
        origem_recursos: item.ORIGEM_RECURSOS,
        
        // Novos campos do Portal da Transparência
        orcamento_inicial_loa: converterValorMonetario(item.ORCAMENTO_INICIAL_LOA),
        total_orcamentario_ate_mes: converterValorMonetario(item.TOTAL_ORCAMENTARIO_ATE_MES),
        total_orcamentario_no_mes: converterValorMonetario(item.TOTAL_ORCAMENTARIO_NO_MES),
        disponibilidade_orcamentaria_ate_mes: converterValorMonetario(item.DISPONIBILIDADE_ORCAMENTARIA_ATE_MES),
        disponibilidade_orcamentaria_no_mes: converterValorMonetario(item.DISPONIBILIDADE_ORCAMENTARIA_NO_MES),
        empenhado_ate_mes: converterValorMonetario(item.EMPENHADO_ATE_MES),
        empenhado_no_mes: converterValorMonetario(item.EMPENHADO_NO_MES),
        liquidado_ate_mes: converterValorMonetario(item.LIQUIDADO_ATE_MES),
        liquidado_no_mes: converterValorMonetario(item.LIQUIDADO_NO_MES),
        pago_ate_mes: converterValorMonetario(item.PAGO_ATE_MES),
        pago_no_mes: converterValorMonetario(item.PAGO_NO_MES),
        
        // Dados de correção monetária
        _correcao_aplicada: correcaoAplicada,
        correcao_aplicada: correcaoAplicada,
        fator_correcao: correcaoAplicada?.fator_correcao,
        ipca_base: correcaoAplicada?.ipca_referencia,
        periodo_base: correcaoAplicada?.periodo_referencia
      };
    });
  };

  return {
    dadosConsulta,
    setDadosConsulta,
    isLoading,
    loadingMessage,
    listaIPCA,
    listaIPCAAnual,
    carregarMediasAnuais,
    consultarDados
  };
}