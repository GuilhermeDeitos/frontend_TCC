import { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { BlueTitleCard } from "../../components/BlueTitleCard";
import { ConsultaForm } from "../../components/ConsultaForm";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { ResultsViewer } from "../../components/ResultsViewer";
import { TourGuide } from "../../components/TourGuide";
import { TourSectionMenu } from "../../components/TourSectionMenu";
import { TourRestartButton } from "../../components/TourRestartButton";
import { useConsultaPageTour } from "../../hooks/useConsultaPageTour";
import { useTransparenciaData } from "../../hooks/useTransparenciaData";
import type { DadosConsulta, FormData } from "../../types/consulta";
import Swal from "sweetalert2";
import { ErrorPanel } from "../../components/ErrorPanel";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.3,
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

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
    error,
  } = useTransparenciaData();

  const tour = useConsultaPageTour();

  // Estado para armazenar parâmetros da última consulta
  const [parametrosConsulta, setParametrosConsulta] = useState<{
    anoInicial: number;
    anoFinal: number;
  }>({ anoInicial: 0, anoFinal: 0 });

  // Estado para controlar animações
  const [animationKey, setAnimationKey] = useState(0);

  // Atualizar chave de animação quando os dados mudam
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [dadosConsulta.length]);

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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ErrorPanel message={error} retry={retryFetch} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex-grow"
          >
            <div data-tour="title-section">
              <BlueTitleCard
                title="Consulta de Financiamento"
                subtitle="Consulte os dados de financiamento das universidades estaduais do Paraná com correção monetária automática pelo IPCA"
              />
            </div>

            <div className="flex-grow bg-gray-50 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Formulário de Consulta */}
                <motion.div variants={itemVariants} className="mb-6">
                  <div data-tour="consulta-form">
                    <ConsultaForm
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                      listaIPCA={listaIPCA}
                      listaIPCAAnual={listaIPCAAnual}
                      carregarMediasAnuais={carregarMediasAnuais}
                    />
                  </div>
                </motion.div>

                {/* Loading com indicador de progresso */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div data-tour="loading-indicator">
                        <LoadingIndicator
                          message={loadingMessage}
                          progresso={progressoConsulta.percentual}
                          registrosProcessados={
                            progressoConsulta.registrosProcessados
                          }
                          totalRegistros={progressoConsulta.totalRegistros}
                          anosProcessados={progressoConsulta.anosProcessados}
                          anoInicial={progressoConsulta.anoInicial}
                          anoFinal={progressoConsulta.anoFinal}
                          onCancel={handleCancelarConsulta}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Resultados */}
                <AnimatePresence>
                  {!isLoading && dadosConsulta.length > 0 && (
                    <motion.div
                      key={`results-${animationKey}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        duration: 0.6,
                      }}
                    >
                      <div data-tour="results-viewer">
                        <ResultsViewer
                          dados={dadosConsulta}
                          parametrosConsulta={parametrosConsulta}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      {/* Tour Guide com navegação entre seções */}
      <TourGuide
        isActive={tour.isActive}
        currentStep={tour.currentStep}
        totalSteps={tour.totalSteps}
        currentStepData={tour.currentStepData}
        onNext={tour.nextStep}
        onPrev={tour.prevStep}
        onSkip={tour.skipTour}
        onClose={tour.closeTour}
        onCancel={tour.cancelTour}
        onSkipAll={tour.skipAllTours}
        extraButtons={
          <button
            onClick={() => tour.setShowSectionMenu(true)}
            className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm flex items-center gap-1"
            title="Navegar entre seções"
          >
            🗺️ Seções
          </button>
        }
        sectionInfo={{
          current: tour.tourSections.find(s => s.id === tour.currentSection)?.title || '',
          total: tour.tourSections.length,
          index: tour.tourSections.findIndex(s => s.id === tour.currentSection) + 1,
        }}
      />

      {/* Menu de navegação entre seções */}
      <TourSectionMenu
        isOpen={tour.showSectionMenu}
        onClose={() => tour.setShowSectionMenu(false)}
        sections={tour.tourSections}
        currentSection={tour.currentSection}
        onSelectSection={tour.goToSection}
        completedTours={tour.completedTours}
      />

      {/* Botão para reiniciar tour */}
      <TourRestartButton
        onRestartTour={tour.restartTour}
        onRestartAllTours={tour.restartAllTours}
        tourKey={`consulta_${tour.currentSection}`}
        completedTours={tour.completedTours}
        completedToursCount={tour.completedToursCount}
        isFirstTimeUser={tour.isFirstTimeUser}
      />
    </div>
  );
}