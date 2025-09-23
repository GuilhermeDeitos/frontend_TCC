import { useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { BlueTitleCard } from "../../components/BlueTitleCard";
import { ConsultaForm } from "../../components/ConsultaForm";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { ResultsViewer } from "../../components/ResultsViewer";
import { useTransparenciaData } from "../../hooks/useTransparenciaData";
import type { FormData } from "../../types/consulta";
import Swal from 'sweetalert2'; // Adicione esta importação se ainda não existir
import { ErrorPanel } from "../../components/ErrorPanel";

export function ConsultaPage() {
  const {
    dadosConsulta,
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
    error
  } = useTransparenciaData(); // Certifique-se de que esta função está sendo importada do hook,

  // Estado para armazenar parâmetros da última consulta
  const [parametrosConsulta, setParametrosConsulta] = useState<{
    anoInicial: number;
    anoFinal: number;
  }>({ anoInicial: 0, anoFinal: 0 });
  


  const handleSubmit = (formData: FormData) => {
    const params = {
      data_inicio: `${formData.mesInicial}/${formData.anoInicial}`,
      data_fim: `${formData.mesFinal}/${formData.anoFinal}`,
      tipo_correcao: formData.tipoCorrecao,
      ipca_referencia: formData.ipcaReferencia,
    };

    // Armazenar anos da consulta para verificação posterior
    setParametrosConsulta({
      anoInicial: parseInt(formData.anoInicial),
      anoFinal: parseInt(formData.anoFinal),
    });

    consultarDados(params);
  };

  // Função para lidar com o cancelamento da consulta
  const handleCancelarConsulta = () => {
    Swal.fire({
      title: 'Cancelar consulta?',
      text: 'Os dados processados até o momento serão mantidos, mas a consulta será interrompida.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, cancelar',
      cancelButtonText: 'Não, continuar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        cancelarConsulta();
        
        Swal.fire(
          'Consulta cancelada',
          'A consulta foi interrompida. Os dados já processados estão disponíveis para análise.',
          'info'
        );
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {
        error ? <ErrorPanel message={error} retry={retryFetch} /> : (
          <>
            <BlueTitleCard
        title="Consulta de Financiamento"
        subtitle="Consulte os dados de financiamento das universidades estaduais do Paraná"
      />

      <div className="flex-grow bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Formulário de Consulta */}
          <ConsultaForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            listaIPCA={listaIPCA}
            listaIPCAAnual={listaIPCAAnual}
            carregarMediasAnuais={carregarMediasAnuais}
          />

          {/* Loading com indicador de progresso */}
          {isLoading && (
            <LoadingIndicator
              message={loadingMessage}
              progresso={progressoConsulta.percentual}
              registrosProcessados={progressoConsulta.registrosProcessados}
              totalRegistros={progressoConsulta.totalRegistros}
              anosProcessados={progressoConsulta.anosProcessados}
              anoInicial={progressoConsulta.anoInicial}
              anoFinal={progressoConsulta.anoFinal}
              onCancel={handleCancelarConsulta}
            />
          )}

          {/* Resultados */}
          {!isLoading && dadosConsulta.length > 0 && (
            <ResultsViewer
              dados={dadosConsulta}
              parametrosConsulta={parametrosConsulta}
            />
          )}
        </div>
      </div>
          </>
        )
      }
      

      <Footer />
    </div>
  );
}