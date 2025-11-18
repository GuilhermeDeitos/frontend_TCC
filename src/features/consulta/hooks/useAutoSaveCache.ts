import { useEffect } from "react";
import type { DadosConsulta, ConsultaParams } from "../types/consulta";
import type { IParamsOriginais } from "./useConsultaCacheData";

interface UseAutoSaveCacheProps {
  dadosConsulta: DadosConsulta[];
  parametrosConsulta: { anoInicial: number; anoFinal: number };
  parametrosOriginais: IParamsOriginais | null;
  salvarConsulta: (
    params: ConsultaParams,
    dados: DadosConsulta[],
    filters?: any[],
    visualizacao?: "tabela" | "grafico",
    paramsOriginais?: IParamsOriginais
  ) => void;
}

export function useAutoSaveCache({
  dadosConsulta,
  parametrosConsulta,
  parametrosOriginais,
  salvarConsulta,
}: UseAutoSaveCacheProps) {
  useEffect(() => {
    if (dadosConsulta.length === 0 || !parametrosConsulta.anoInicial) {
      return;
    }

    const timeoutId = setTimeout(() => {
      const params: ConsultaParams = {
        data_inicio: `01/${parametrosConsulta.anoInicial}`,
        data_fim: `12/${parametrosConsulta.anoFinal}`,
        tipo_correcao: parametrosOriginais?.tipoCorrecao || "mensal",
        ipca_referencia: parametrosOriginais?.ipcaReferencia || "atual",
      };

      console.log("Salvando consulta COMPLETA no cache...", {
        registros: dadosConsulta.length,
        params,
      });

      salvarConsulta(
        params,
        dadosConsulta,
        undefined,
        undefined,
        parametrosOriginais ?? undefined
      );
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [dadosConsulta, parametrosConsulta, parametrosOriginais, salvarConsulta]);
}