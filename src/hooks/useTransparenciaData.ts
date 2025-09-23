import { useState, useEffect, useCallback, useRef } from "react";
import type { DadosConsulta, ConsultaParams } from "../types/consulta";
import api from "../utils/api";
import Swal from "sweetalert2";

export function useTransparenciaData() {
  const [dadosConsulta, setDadosConsulta] = useState<DadosConsulta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [listaIPCA, setListaIPCA] = useState<
    { value: string; label: string }[]
  >([]);
  const [listaIPCAAnual, setListaIPCAAnual] = useState<
    { value: string; label: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [consultaAtualId, setConsultaAtualId] = useState<string | null>(null);
  const [progressoConsulta, setProgressoConsulta] = useState<{
    anosProcessados: Set<number>;
    anoInicial?: number;
    anoFinal?: number;
    percentual: number;
    totalRegistros: number;
    registrosProcessados: number;
  }>({
    anosProcessados: new Set(),
    percentual: 0,
    totalRegistros: 0,
    registrosProcessados: 0,
  });

  const consultaIdRef = useRef<string | null>(null);
  const mediasAnuaisCarregadas = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cancelRequestRef = useRef<boolean>(false);

  // Função para cancelar a consulta
  const cancelarConsulta = useCallback(() => {
    // Sinalizar que a consulta deve ser cancelada
    cancelRequestRef.current = true;

    // Abortar a solicitação atual se houver
    if (abortControllerRef.current) {
      console.log("Abortando requisição HTTP...");
      abortControllerRef.current.abort();
    }

    let idConsulta: null | string = null;

    if (consultaIdRef.current) {
      idConsulta = consultaIdRef.current;
      console.log(`Tentando cancelar consulta ID: ${idConsulta}`);
    } else if (consultaAtualId) {
      idConsulta = consultaAtualId;
      console.log(`ID da consulta encontrado no state: ${idConsulta}`);
    } else {
      try {
        idConsulta = sessionStorage.getItem("currentConsultaId");
        if (idConsulta) {
          console.log(
            `ID da consulta encontrado no sessionStorage: ${idConsulta}`
          );
        }
      } catch {
        console.log("Erro ao acessar sessionStorage");
      }
    }

    try{
      if (idConsulta) {
        console.log(`Tentando cancelar consulta ID: ${idConsulta}`);
        
        // Fazer uma chamada separada para garantir o cancelamento
        api
          .post(`/transparencia/cancelar/${idConsulta}`)
          .then((response) => {
            console.log(`Consulta ${idConsulta} cancelada explicitamente:`, response.data);
            // Limpar o ID após o cancelamento
            consultaIdRef.current = null;
            setConsultaAtualId(null);
            try {
              sessionStorage.removeItem('currentConsultaId');
            } catch {}
          })
          .catch((err) => {
            console.error(`Erro ao cancelar explicitamente: ${err}`);
          });
      } else {
        console.warn("Tentativa de cancelamento, mas nenhum ID de consulta disponível");
      }
    } catch{
      console.log("Erro ao tentar cancelar a consulta");
    }

    // Finalizar o estado de carregamento
    setIsLoading(false);
    setLoadingMessage("");
  }, [consultaAtualId]);

  // Buscar lista de IPCA disponíveis
  useEffect(() => {
    api
      .get("/ipca")
      .then((response) => {
        const opcoes = Object.entries(response.data.data).map(
          ([key, value]) => ({
            value: key,
            label: `${key} - ${Number(value).toFixed(4)}`,
          })
        );
        setListaIPCA(opcoes.reverse());
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          setError("Servidor fora do ar");
        }
        setError("Erro ao buscar IPCAs");
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
    const anosRelevantes = Array.from({ length: 26 }, (_, i) =>
      (2000 + i).toString()
    );
    const queryString = anosRelevantes.map((ano) => `anos=${ano}`).join("&");

    console.log("Carregando médias anuais - chamada única");

    // Fazer a requisição diretamente sem depender da primeira consulta
    api
      .get(`/ipca/medias-anuais?${queryString}`)
      .then((response) => {
        const opcoesAnuais = Object.entries(response.data)
          .filter(([_, data]: any) => !data.erro)
          .map(([ano, data]: any) => ({
            value: ano,
            label: `${ano} - Média: ${data.media_ipca.toFixed(4)}`,
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
    // Resetar o estado de cancelamento
    cancelRequestRef.current = false;

    // Criar um novo AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // Extrair anos inicial e final da consulta
    const [mesInicial, anoInicial] = params.data_inicio.split("/");
    const [mesFinal, anoFinal] = params.data_fim.split("/");

    // Resetar o progresso da consulta
    setProgressoConsulta({
      anosProcessados: new Set(),
      anoInicial: parseInt(anoInicial),
      anoFinal: parseInt(anoFinal),
      percentual: 0,
      totalRegistros: 0,
      registrosProcessados: 0,
    });

    setLoadingMessage("Iniciando consulta...");

    try {
      // Usar fetch com streaming SSE
      const response = await fetch(
        `${api.defaults.baseURL}/transparencia/consultar-streaming`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
          signal,
        }
      );

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let dadosAcumulados: DadosConsulta[] = [];
      let buffer = "";
      let eventBuffer = "";

      if (reader) {
        // Processar stream
        while (true) {
          if (cancelRequestRef.current) {
            console.log("Consulta cancelada pelo usuário");
            break;
          }
          const { done, value } = await reader.read();
          if (done) break;

          // Decodificar chunk
          buffer += decoder.decode(value, { stream: true });

          // Processar linhas completas
          const lines = buffer.split("\n");

          // Manter última linha (possivelmente incompleta) no buffer principal
          buffer = lines[lines.length - 1];

          // Processar cada linha
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();

            if (line === "" && eventBuffer) {
              // Linha vazia indica fim de um evento SSE
              // Processar o evento acumulado

              if (eventBuffer.startsWith("data: ")) {
                try {
                  const jsonStr = eventBuffer.substring(6);
                  const chunk = JSON.parse(jsonStr);
                  if (chunk.id_consulta) {
                    consultaIdRef.current = chunk.id_consulta;
                    setConsultaAtualId(chunk.id_consulta);
                    console.log(
                      `ID da consulta armazenado: ${chunk.id_consulta}`
                    );
                  }

                  try {
                    sessionStorage.setItem(
                      "currentConsultaId",
                      chunk.id_consulta
                    );
                  } catch {
                    console.log("Erro ao salvar consultaId no sessionStorage");
                  }

                  if (chunk.status === "iniciando") {
                    setLoadingMessage(
                      `Consulta iniciada. ID: ${chunk.id_consulta}`
                    );
                  } else if (chunk.status === "parcial") {
                    // Obter ano processado
                    const anoProcessado = Number(chunk.ano_processado);

                    // Atualizar conjunto de anos processados
                    setProgressoConsulta((prev) => {
                      const anosProcessados = new Set(prev.anosProcessados);
                      anosProcessados.add(anoProcessado);

                      // Calcular percentual baseado nos anos processados
                      let percentual = 0;
                      if (
                        prev.anoInicial !== undefined &&
                        prev.anoFinal !== undefined
                      ) {
                        const totalAnos = prev.anoFinal - prev.anoInicial + 1;
                        percentual = Math.min(
                          100,
                          Math.round((anosProcessados.size / totalAnos) * 100)
                        );
                      }

                      // Atualizar contagem de registros
                      const registrosProcessados =
                        prev.registrosProcessados + chunk.dados.length;
                      const totalRegistros =
                        chunk.total_estimado || registrosProcessados;

                      return {
                        ...prev,
                        anosProcessados,
                        percentual,
                        registrosProcessados,
                        totalRegistros,
                      };
                    });

                    // Atualizar mensagem de progresso com ano atual e percentual
                    setLoadingMessage(`Processando ano ${anoProcessado}...`);

                    // Processar dados parciais
                    const novosDados = processarDadosChunk(
                      chunk,
                      dadosAcumulados
                    );

                    dadosAcumulados = [...dadosAcumulados, ...novosDados];
                    setDadosConsulta([...dadosAcumulados]);

                    // Mostrar progresso no console
                    console.log(
                      `Processado ano ${anoProcessado}: ${chunk.total_registros_ano} registros`
                    );
                  } else if (chunk.status === "completo") {
                    setIsLoading(false);
                    setLoadingMessage("");

                    // Atualizar progresso para 100% ao concluir
                    setProgressoConsulta((prev) => ({
                      ...prev,
                      percentual: 100,
                    }));

                    // Processar dados finais
                    const novosDados = processarDadosChunk(
                      chunk,
                      dadosAcumulados
                    );
                    dadosAcumulados = [...dadosAcumulados, ...novosDados];
                    setDadosConsulta([...dadosAcumulados]);
                  } else if (chunk.status === "erro") {
                    throw new Error(chunk.mensagem || "Erro desconhecido");
                  }
                } catch (e) {
                  console.error("Erro ao processar evento SSE:", e);
                }
              }
              // Limpar buffer do evento
              eventBuffer = "";
            } else if (line) {
              // Acumular linha no buffer do evento
              if (eventBuffer) {
                eventBuffer += "\n" + line;
              } else {
                eventBuffer = line;
              }
            }
          }
        }

        // Processar qualquer evento remanescente no buffer
        if (eventBuffer && eventBuffer.startsWith("data: ")) {
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
      if (error.name === "AbortError") {
        console.log("Requisição cancelada pelo usuário");
        return; // Sair silenciosamente sem mostrar erro
      }
      Swal.fire({
        icon: "error",
        title: "Erro",
        text:
          error.message ||
          "Erro ao consultar dados. Por favor, tente novamente.",
      });
      console.error("Erro na consulta:", error);
      setIsLoading(false);
      setLoadingMessage("");
    } finally {
      // Limpar recursos quando terminar
      abortControllerRef.current = null;
    }
  };

  // Função auxiliar para processar dados do chunk
  const processarDadosChunk = (
    chunk: any,
    dadosAcumulados: DadosConsulta[]
  ): DadosConsulta[] => {
    if (chunk.id_consulta) {
      consultaIdRef.current = chunk.id_consulta;
      setConsultaAtualId(chunk.id_consulta);
    }
    return chunk.dados.map((item: any, index: number) => {
      // Função para converter string monetária para número
      const converterValorMonetario = (
        valor: string | null | undefined
      ): number => {
        if (!valor) return 0;
        return (
          parseFloat(String(valor).replace(/\./g, "").replace(",", ".")) || 0
        );
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
        universidade:
          item.UNIDADE_ORCAMENTARIA || item.universidade || "Não informado",
        valor_empenhado: valorEmpenhado,
        valor_liquidado: valorLiquidado,
        valor_pago: valorPago,
        funcao: item.FUNCAO,
        grupo_natureza: item.GRUPO_NATUREZA_DESPESA,
        origem_recursos: item.ORIGEM_RECURSOS,

        // Novos campos do Portal da Transparência
        orcamento_inicial_loa: converterValorMonetario(
          item.ORCAMENTO_INICIAL_LOA
        ),
        total_orcamentario_ate_mes: converterValorMonetario(
          item.TOTAL_ORCAMENTARIO_ATE_MES
        ),
        total_orcamentario_no_mes: converterValorMonetario(
          item.TOTAL_ORCAMENTARIO_NO_MES
        ),
        disponibilidade_orcamentaria_ate_mes: converterValorMonetario(
          item.DISPONIBILIDADE_ORCAMENTARIA_ATE_MES
        ),
        disponibilidade_orcamentaria_no_mes: converterValorMonetario(
          item.DISPONIBILIDADE_ORCAMENTARIA_NO_MES
        ),
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
        periodo_base: correcaoAplicada?.periodo_referencia,
      };
    });
  };

  //Verificar se a API está ok
  const checkApiStatus = async () => {
    try {
      await api.get("/transparencia/status").then((response) => {
        if (response.data?.status !== "ok") {
          setError("API de Scrapping está offline");
        } else {
          setError(null);
        }
      });
    } catch (error) {
      console.log("Erro ao verificar status da API:", error);
      setError("Erro ao verificar status da API");
    }
  };

  const retryFetch = () => {
    setError(null);
    checkApiStatus();
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  return {
    dadosConsulta,
    setDadosConsulta,
    isLoading,
    loadingMessage,
    listaIPCA,
    listaIPCAAnual,
    carregarMediasAnuais,
    consultarDados,
    progressoConsulta,
    cancelarConsulta,
    checkApiStatus,
    retryFetch,
    error,
  };
}
