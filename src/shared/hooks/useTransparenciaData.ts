import { useState, useEffect, useCallback, useRef } from "react";
import type { DadosConsulta, ConsultaParams } from "@features/consulta/types/consulta";
import api from "../utils/api";
import Swal from "sweetalert2";
import { useIPCAData } from "./useIPCAData";
import { processarDadosChunk } from "../utils/processadorDados";
import { extrairMensagemErro } from "../utils/errorHandlers";


interface ProgressoConsulta {
  anosProcessados: Set<number>;
  anoInicial?: number;
  anoFinal?: number;
  percentual: number;
  totalRegistros: number;
  registrosProcessados: number;
}

function removerDadosDuplicados(
  dadosNovos: DadosConsulta[],
  dadosExistentes: DadosConsulta[]
): DadosConsulta[] {
  if (!dadosNovos || dadosNovos.length === 0) return [];
  if (!dadosExistentes || dadosExistentes.length === 0) return dadosNovos;

  console.log(
    `Verificando duplicatas: ${dadosNovos.length} novos registros contra ${dadosExistentes.length} existentes`
  );

  // Criar um Set com identificadores únicos dos dados existentes
  const idsExistentes = new Set(
    dadosExistentes.map((dado) => {
      // Chave de identificação mais completa usando múltiplos campos
      return `${dado.UNIDADE_ORCAMENTARIA || ""}-${dado.FUNCAO || ""}-${
        dado.ANO || dado._ano_validado || ""
      }-${dado.MES || ""}-${dado.GRUPO_NATUREZA || ""}-${
        dado.ORIGEM_RECURSOS || ""
      }-${dado.VALOR_PAGO || ""}`;
    })
  );

  // Filtrar apenas dados que não existem ainda
  const dadosFiltrados = dadosNovos.filter((dado) => {
    const id = `${dado.UNIDADE_ORCAMENTARIA || ""}-${dado.FUNCAO || ""}-${
      dado.ANO || dado._ano_validado || ""
    }-${dado.MES || ""}-${dado.GRUPO_NATUREZA || ""}-${
      dado.ORIGEM_RECURSOS || ""
    }-${dado.VALOR_PAGO || ""}`;
    return !idsExistentes.has(id);
  });

  console.log(
    `Removidas ${dadosNovos.length - dadosFiltrados.length} duplicatas, ${
      dadosFiltrados.length
    } registros únicos`
  );

  // Verificar duplicatas internas no resultado filtrado
  const uniqueValues = new Set();
  const resultadoFinal = dadosFiltrados.filter((dado) => {
    const id = `${dado.UNIDADE_ORCAMENTARIA || ""}-${dado.FUNCAO || ""}-${
      dado.ANO || dado._ano_validado || ""
    }-${dado.MES || ""}-${dado.GRUPO_NATUREZA || ""}-${
      dado.ORIGEM_RECURSOS || ""
    }-${dado.VALOR_PAGO || ""}`;

    if (uniqueValues.has(id)) {
      return false; // É duplicata interna, remover
    }

    uniqueValues.add(id);
    return true;
  });

  if (resultadoFinal.length < dadosFiltrados.length) {
    console.log(
      `Removidas ${
        dadosFiltrados.length - resultadoFinal.length
      } duplicatas internas no conjunto filtrado`
    );
  }

  return resultadoFinal;
}
/**
 * Hook principal para gerenciar dados do Portal da Transparência
 * Fornece funcionalidades para consulta, carregamento e manipulação de dados
 */
export function useTransparenciaData() {
  const [dadosConsulta, setDadosConsulta] = useState<DadosConsulta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [consultaAtualId, setConsultaAtualId] = useState<string | null>(null);
  const [progressoConsulta, setProgressoConsulta] = useState<ProgressoConsulta>(
    {
      anosProcessados: new Set(),
      percentual: 0,
      totalRegistros: 0,
      registrosProcessados: 0,
    }
  );

  const { listaIPCA, listaIPCAAnual, carregarMediasAnuais } = useIPCAData();

  const consultaIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cancelRequestRef = useRef<boolean>(false);

  // Verificar se a API está ok
  const checkApiStatus = useCallback(async (): Promise<boolean> => {
    try {
      const response = await api.get("/transparencia/status");
      const apiOk = response.data?.status === "ok";

      if (!apiOk) {
        setError("API de Scrapping está offline");
      } else {
        setError(null);
      }

      return apiOk;
    } catch (error) {
      console.log("Erro ao verificar status da API:", error);
      setError("Erro ao verificar status da API");
      return false;
    }
  }, []);

  const retryFetch = useCallback((): void => {
    setError(null);
    checkApiStatus();
  }, [checkApiStatus]);

  // Função para cancelar a consulta
  const cancelarConsulta = useCallback((): void => {
    // Sinalizar que a consulta deve ser cancelada
    cancelRequestRef.current = true;

    // Abortar a solicitação atual se houver
    if (abortControllerRef.current) {
      console.log("Abortando requisição HTTP...");
      abortControllerRef.current.abort();
    }

    let idConsulta: string | null = null;

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

    if (idConsulta) {
      console.log(`Tentando cancelar consulta ID: ${idConsulta}`);

      // Fazer uma chamada separada para garantir o cancelamento
      api
        .post(`/transparencia/cancelar/${idConsulta}`)
        .then((response) => {
          console.log(
            `Consulta ${idConsulta} cancelada explicitamente:`,
            response.data
          );
          // Limpar o ID após o cancelamento
          consultaIdRef.current = null;
          setConsultaAtualId(null);
          try {
            sessionStorage.removeItem("currentConsultaId");
          } catch { /* empty */ }
        })
        .catch((err) => {
          console.error(`Erro ao cancelar explicitamente: ${err}`);
        });
    } else {
      console.warn(
        "Tentativa de cancelamento, mas nenhum ID de consulta disponível"
      );
    }

    // Finalizar o estado de carregamento
    setIsLoading(false);
    setLoadingMessage("");
  }, [consultaAtualId]);

  const consultarDados = useCallback(
    async (params: ConsultaParams): Promise<void> => {
      setIsLoading(true);
      setDadosConsulta([]);
      setError(null);
      cancelRequestRef.current = false;

      // Criar um novo AbortController
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      // Extrair anos inicial e final da consulta
      const [_mesInicial, anoInicial] = params.data_inicio.split("/");
      const [_mesFinal, anoFinal] = params.data_fim.split("/");

      const anoInicialNum = parseInt(anoInicial);
      const anoFinalNum = parseInt(anoFinal);
      const totalAnosEsperados = anoFinalNum - anoInicialNum + 1;
      setDadosConsulta([]);

      // Resetar o progresso da consulta
      setProgressoConsulta({
        anosProcessados: new Set(),
        anoInicial: anoInicialNum,
        anoFinal: anoFinalNum,
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
          const errorText = await response.text();
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Stream não disponível");
        }

        const decoder = new TextDecoder();
        let dadosAcumulados: DadosConsulta[] = [];
        let buffer = "";
        let eventBuffer = "";
        let consultaConcluida = false;

        // Processar stream
        while (true) {
          if (cancelRequestRef.current) {
            console.log("Consulta cancelada pelo usuário");
            break;
          }

          const { done, value } = await reader.read();
          if (done) {
            console.log("Stream finalizado");
            break;
          }

          // Decodificar chunk
          buffer += decoder.decode(value, { stream: true });

          // Processar linhas completas
          const lines = buffer.split("\n");
          buffer = lines[lines.length - 1];

          // Processar cada linha
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();

            if (line === "" && eventBuffer) {
              // Processar evento SSE completo
              if (eventBuffer.startsWith("data: ")) {
                try {
                  const jsonStr = eventBuffer.substring(6);
                  const chunk = JSON.parse(jsonStr);

                  console.log("Evento recebido:", chunk.status, chunk);

                  if (chunk.id_consulta) {
                    consultaIdRef.current = chunk.id_consulta;
                    setConsultaAtualId(chunk.id_consulta);
                    try {
                      sessionStorage.setItem(
                        "currentConsultaId",
                        chunk.id_consulta
                      );
                    } catch { /* empty */ }
                  }

                  if (chunk.status === "iniciando") {
                    setLoadingMessage(
                      `Consulta iniciada. ID: ${chunk.id_consulta}`
                    );
                  } // Substitua o processamento de eventos parciais (por volta da linha 220)
                  else if (chunk.status === "parcial") {
                    const anoProcessado = Number(chunk.ano_processado);

                    // 1. PRIMEIRO processar os dados
                    if (chunk.dados && chunk.dados.length > 0) {
                      const dadosFiltrados = removerDadosDuplicados(
                        chunk.dados,
                        dadosAcumulados
                      );
                      if (dadosFiltrados.length > 0) {
                        const novosDados = processarDadosChunk(
                          { ...chunk, dados: dadosFiltrados },
                          dadosAcumulados
                        );
                        dadosAcumulados = [...dadosAcumulados, ...novosDados];
                        setDadosConsulta([...dadosAcumulados]);
                        console.log(
                          `Ano ${anoProcessado}: ${novosDados.length} registros adicionados`
                        );
                      } else {
                        console.log(
                          `Ano ${anoProcessado}: Todos os dados são duplicatas`
                        );
                      }
                    }

                    // 2. DEPOIS atualizar o progresso (SEM finalizar automaticamente)
                    setProgressoConsulta((prev) => {
                      const anosProcessados = new Set(prev.anosProcessados);
                      anosProcessados.add(anoProcessado);

                      const percentual = Math.min(
                        100,
                        Math.round(
                          (anosProcessados.size / totalAnosEsperados) * 100
                        )
                      );

                      const registrosProcessados = dadosAcumulados.length;

                      console.log(
                        `Progresso: ${anosProcessados.size}/${totalAnosEsperados} anos (${percentual}%) - ${registrosProcessados} registros`
                      );

                      return {
                        ...prev,
                        anosProcessados,
                        percentual,
                        registrosProcessados,
                        totalRegistros:
                          chunk.total_estimado || registrosProcessados,
                      };
                    });

                    setLoadingMessage(
                      `Processando ano ${anoProcessado}... (${
                        progressoConsulta.anosProcessados.size + 1
                      }/${totalAnosEsperados})`
                    );
                  }

                  // Substitua também o código que trata os eventos completos (por volta da linha 260)
                  else if (chunk.status === "completo") {
                    console.log("Consulta marcada como completa pelo servidor");
                    consultaConcluida = true;

                    // Finalizar consulta
                    setProgressoConsulta((prev) => ({
                      ...prev,
                      percentual: 100,
                    }));
                    setIsLoading(false);
                    setLoadingMessage("");
                  } else if (chunk.status === "erro") {
                    throw new Error(
                      chunk.mensagem ||
                        chunk.error ||
                        "Erro desconhecido na consulta"
                    );
                  }
                } catch (e) {
                  console.error("Erro ao processar evento SSE:", e);
                  // Não quebrar o loop por erro de parsing
                }
              }
              eventBuffer = "";
            } else if (line) {
              eventBuffer = eventBuffer ? eventBuffer + "\n" + line : line;
            }
          }

          // VERIFICAÇÃO ADICIONAL: Se todos os anos foram processados, sair do loop
          if (consultaConcluida) {
            console.log("Saindo do loop de processamento - consulta concluída");
            break;
          }
        }

        // Processar buffer final se existir
        if (eventBuffer && eventBuffer.startsWith("data: ")) {
          try {
            const jsonStr = eventBuffer.substring(6);
            const chunk = JSON.parse(jsonStr);
            console.log("Processando evento final:", chunk);

            if (chunk.status === "completo") {
              consultaConcluida = true;
            }
          } catch (e) {
            console.error("Erro ao processar buffer final:", e);
          }
        }

        // VERIFICAÇÃO FINAL GARANTIDA
        setProgressoConsulta((prev) => {
          const anosProcessadosAtual = prev.anosProcessados.size;
          const todosAnosProcessados =
            anosProcessadosAtual >= totalAnosEsperados;

          console.log(
            `Verificação final: ${anosProcessadosAtual}/${totalAnosEsperados} anos processados`
          );
          console.log(
            `Consulta marcada como completa: ${consultaConcluida}`
          );
          console.log(`Todos os anos processados: ${todosAnosProcessados}`);

          // SEMPRE finalizar se todos os anos foram processados
          if (todosAnosProcessados) {
            console.log("Finalizando consulta - todos os anos processados");
            setIsLoading(false);
            setLoadingMessage("");
            return { ...prev, percentual: 100 };
          }

          return prev;
        });
      } catch (error: any) {
        console.error("Erro na consulta:", error);

        if (error.name === "AbortError") {
          console.log("Requisição cancelada pelo usuário");
          return;
        }

        // Tratar erro e exibir mensagem adequada
        const errorMessage = extrairMensagemErro(error);
        setError(errorMessage);

        Swal.fire({
          icon: "error",
          title: "Erro na Consulta",
          text: errorMessage,
        });
      } finally {
        // GARANTIA FINAL: Sempre limpar loading após timeout
        setTimeout(() => {
          setIsLoading(false);
          setLoadingMessage("");
        }, 2000);

        abortControllerRef.current = null;
      }
    },
    []
  );

  // Verificar status da API ao carregar o componente
  useEffect(() => {
    checkApiStatus();
  }, [checkApiStatus]);

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
