import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import type { ConsultaParams } from "../types/consulta";
import type { IParamsOriginais } from "./useConsultaCacheData";

interface UseHistoricoHandlersProps {
  obterMetadadosHistorico: (id: string) => any;
  consultarDados: (params: ConsultaParams) => Promise<void>;
  setDadosConsulta: (dados: any[]) => void;
  setParametrosConsulta: (params: { anoInicial: number; anoFinal: number }) => void;
  setParametrosOriginais: (params: IParamsOriginais | null) => void;
  handleVisualizacaoChange: (tipo: "tabela" | "grafico") => void;
}

export function useHistoricoHandlers({
  obterMetadadosHistorico,
  consultarDados,
  setDadosConsulta,
  setParametrosConsulta,
  setParametrosOriginais,
  handleVisualizacaoChange,
}: UseHistoricoHandlersProps) {
  const [historicoLoading, setHistoricoLoading] = useState(false);

  const handleReexecutarConsulta = useCallback(
    async (consultaId: string) => {
      const metadata = obterMetadadosHistorico(consultaId);

      if (!metadata) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Não foi possível encontrar as configurações desta consulta.",
        });
        return;
      }

      setHistoricoLoading(true);

      try {
        setDadosConsulta([]);

        Swal.fire({
          icon: "info",
          title: "Reexecutando Consulta",
          html: `
            <p>Carregando dados para: <strong>${metadata.descricao}</strong></p>
            <p class="text-sm text-gray-600 mt-2">
              ${
                metadata.filters && metadata.filters.length > 0
                  ? `${metadata.filters.length} ${
                      metadata.filters.length === 1
                        ? "filtro será aplicado"
                        : "filtros serão aplicados"
                    }`
                  : "Sem filtros salvos"
              }
            </p>
          `,
          timer: 2000,
          showConfirmButton: false,
        });

        const anoIni = metadata.params.data_inicio.split("/")[1];
        const anoFim = metadata.params.data_fim.split("/")[1];

        setParametrosConsulta({
          anoInicial: parseInt(anoIni),
          anoFinal: parseInt(anoFim),
        });

        if (metadata.paramsOriginais) {
          setParametrosOriginais(metadata.paramsOriginais);
        }

        const paramsParaConsulta = metadata.paramsOriginais
          ? {
              data_inicio: `${metadata.paramsOriginais.mesInicial}/${metadata.paramsOriginais.anoInicial}`,
              data_fim: `${metadata.paramsOriginais.mesFinal}/${metadata.paramsOriginais.anoFinal}`,
              tipo_correcao: metadata.paramsOriginais.tipoCorrecao,
              ipca_referencia: metadata.paramsOriginais.ipcaReferencia,
            }
          : metadata.params;

        await consultarDados(paramsParaConsulta);

        if (metadata.visualizacao) {
          setTimeout(() => {
            handleVisualizacaoChange(metadata.visualizacao!);
          }, 500);
        }
      } catch (error) {
        console.error("Erro ao reexecutar consulta:", error);
        Swal.fire({
          icon: "error",
          title: "Erro ao Reexecutar",
          text: "Não foi possível reexecutar a consulta. Tente novamente.",
        });
      } finally {
        setHistoricoLoading(false);
      }
    },
    [
      obterMetadadosHistorico,
      consultarDados,
      setDadosConsulta,
      setParametrosConsulta,
      setParametrosOriginais,
      handleVisualizacaoChange,
    ]
  );

  return {
    historicoLoading,
    handleReexecutarConsulta,
  };
}