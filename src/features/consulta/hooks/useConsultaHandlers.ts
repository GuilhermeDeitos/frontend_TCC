import { useCallback } from "react";
import Swal from "sweetalert2";
import type { FormData } from "../types/consulta";
import type { IParamsOriginais } from "./useConsultaCacheData";

interface UseConsultaHandlersProps {
  checkApiStatus: () => Promise<boolean>;
  setApiOffline: (offline: boolean) => void;
  setDadosConsulta: (dados: any[]) => void;
  setParametrosConsulta: (params: { anoInicial: number; anoFinal: number }) => void;
  setParametrosOriginais: (params: IParamsOriginais) => void;
  consultarDados: (params: any) => Promise<void>;
  historicoCount: number;
  setHistoricoAberto: (open: boolean) => void;
  toursJaSolicitados: React.MutableRefObject<{ resultados: boolean; graficos: boolean }>;
}

export function useConsultaHandlers({
  checkApiStatus,
  setApiOffline,
  setDadosConsulta,
  setParametrosConsulta,
  setParametrosOriginais,
  consultarDados,
  historicoCount,
  setHistoricoAberto,
  toursJaSolicitados,
}: UseConsultaHandlersProps) {
  
  const handleSubmit = useCallback(async (formData: FormData) => {
    const apiOk = await checkApiStatus();
    setApiOffline(!apiOk);

    if (!apiOk) {
      Swal.fire({
        icon: "error",
        title: "API Offline",
        html: `
          <p>Não foi possível conectar à API de Scrapping.</p>
          ${
            historicoCount > 0
              ? '<p class="mt-2 text-sm text-gray-600">Você pode reexecutar consultas anteriores através do histórico.</p>'
              : ""
          }
        `,
        confirmButtonText: historicoCount > 0 ? "Ver Histórico" : "Ok",
      }).then((result) => {
        if (result.isConfirmed && historicoCount > 0) {
          setHistoricoAberto(true);
        }
      });
      return;
    }

    console.log("Limpando dados para nova consulta...");
    setDadosConsulta([]);
    setParametrosConsulta({ anoInicial: 0, anoFinal: 0 });
    setParametrosOriginais(formData);

    const params = {
      data_inicio: `${formData.mesInicial}/${formData.anoInicial}`,
      data_fim: `${formData.mesFinal}/${formData.anoFinal}`,
      tipo_correcao: formData.tipoCorrecao,
      ipca_referencia: formData.ipcaReferencia,
    };

    setParametrosConsulta({
      anoInicial: parseInt(formData.anoInicial),
      anoFinal: parseInt(formData.anoFinal),
    });

    toursJaSolicitados.current.resultados = false;
    consultarDados(params);
  }, [
    checkApiStatus,
    setApiOffline,
    setDadosConsulta,
    setParametrosConsulta,
    setParametrosOriginais,
    consultarDados,
    historicoCount,
    setHistoricoAberto,
    toursJaSolicitados,
  ]);

  const handleRetryApi = useCallback(async () => {
    const status = await checkApiStatus();
    setApiOffline(!status);

    if (status) {
      Swal.fire({
        icon: "success",
        title: "API Online!",
        text: "Conexão estabelecida. Você já pode fazer novas consultas.",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "API Ainda Offline",
        html: `
          <p>Não foi possível conectar à API.</p>
          ${
            historicoCount > 0
              ? '<p class="mt-2 text-sm text-gray-600">Você pode reexecutar consultas anteriores através do histórico.</p>'
              : ""
          }
        `,
        confirmButtonText: historicoCount > 0 ? "Ver Histórico" : "Ok",
      }).then((result) => {
        if (result.isConfirmed && historicoCount > 0) {
          setHistoricoAberto(true);
        }
      });
    }
  }, [checkApiStatus, setApiOffline, historicoCount, setHistoricoAberto]);

  const handleCancelarConsulta = useCallback((cancelarConsulta: () => void) => {
    Swal.fire({
      title: "Cancelar consulta?",
      text: "Os dados processados até o momento serão mantidos, mas a consulta será interrompida.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, cancelar",
      cancelButtonText: "Não, continuar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelarConsulta();
        Swal.fire(
          "Consulta cancelada",
          "A consulta foi interrompida. Os dados já processados estão disponíveis para análise.",
          "info"
        );
      }
    });
  }, []);

  return {
    handleSubmit,
    handleRetryApi,
    handleCancelarConsulta,
  };
}