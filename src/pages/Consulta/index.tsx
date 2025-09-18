import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { BlueTitleCard } from "../../components/BlueTitleCard";
import { ConsultaForm } from "../../components/ConsultaForm";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { ResultsViewer } from "../../components/ResultsViewer";
import { useTransparenciaData } from "../../hooks/useTransparenciaData";
import type { FormData } from "../../types/consulta";

export function ConsultaPage() {
  const { 
    dadosConsulta, 
    isLoading, 
    loadingMessage, 
    listaIPCA, 
    listaIPCAAnual, 
    carregarMediasAnuais, 
    consultarDados 
  } = useTransparenciaData();

  const handleSubmit = (formData: FormData) => {
    const params = {
      data_inicio: `${formData.mesInicial}/${formData.anoInicial}`,
      data_fim: `${formData.mesFinal}/${formData.anoFinal}`,
      tipo_correcao: formData.tipoCorrecao,
      ipca_referencia: formData.ipcaReferencia
    };

    consultarDados(params);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
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

          {/* Loading */}
          {isLoading && <LoadingIndicator message={loadingMessage} />}

          {/* Resultados */}
          {!isLoading && dadosConsulta.length > 0 && (
            <ResultsViewer dados={dadosConsulta} />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}