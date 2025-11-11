import { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { BlueTitleCard } from "../../components/BlueTitleCard";
import { ConsultaForm } from "../../components/ConsultaForm";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { ResultsViewer } from "../../components/ResultsViewer";
import { TourGuide } from "../../components/TourGuide";
import { TourRestartButton } from "../../components/TourRestartButton";
import { useConsultaPageTour } from "../../hooks/useConsultaPageTour";
import { useConsultaResultadosTour } from "../../hooks/useConsultaResultadosTour";
import { useConsultaGraficosTour } from "../../hooks/useConsultaGraficosTour";
import { useTransparenciaData } from "../../hooks/useTransparenciaData";
import type { FormData } from "../../types/consulta";
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

  // Tours independentes
  const { tourIntro } = useConsultaPageTour();
  const tourResultados = useConsultaResultadosTour();
  const tourGraficos = useConsultaGraficosTour();

  // Estado para armazenar parâmetros da última consulta
  const [parametrosConsulta, setParametrosConsulta] = useState<{
    anoInicial: number;
    anoFinal: number;
  }>({ anoInicial: 0, anoFinal: 0 });

  // Estado para controlar animações
  const [animationKey, setAnimationKey] = useState(0);

  // Refs para rastrear tours já solicitados
  const toursJaSolicitados = useRef({
    resultados: false,
    graficos: false,
  });

  // Atualizar chave de animação quando os dados mudam
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [dadosConsulta.length]);

  // Auto-iniciar tour de introdução na primeira visita
  useEffect(() => {
    if (!tourIntro.isTourCompleted && !tourIntro.isActive) {
      const timer = setTimeout(() => {
        tourIntro.startTour();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [tourIntro]);

  const handleSubmit = (formData: FormData) => {
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

    // Resetar flag de tour de resultados para nova consulta
    toursJaSolicitados.current.resultados = false;

    consultarDados(params);
  };

  // Handler para mudança de visualização para gráficos
  const handleVisualizacaoChange = useCallback(
    (tipo: "tabela" | "grafico") => {
      if (
        tipo === "grafico" &&
        !tourGraficos.isTourCompleted &&
        !toursJaSolicitados.current.graficos
      ) {
        console.log("📈 Mudou para gráficos, iniciando tour");
        toursJaSolicitados.current.graficos = true;

        setTimeout(() => {
          tourGraficos.startTour(true);
        }, 600);
      }
    },
    [tourGraficos]
  );

  // Handler para abrir modal de correção

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


  // Determinar qual tour está ativo
  const activeTour = tourIntro.isActive
    ? tourIntro
    : tourResultados.isActive
    ? tourResultados
    : tourGraficos.isActive
    ? tourGraficos
    : null;

  // Coletar todos os tours completados
  const allCompletedTours = [
    ...tourIntro.completedTours,
    ...tourResultados.completedTours,
    ...tourGraficos.completedTours,
  ];

  const uniqueCompletedTours = Array.from(new Set(allCompletedTours));

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
                <motion.div className="mb-6">
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

                {/* Loading */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
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
                          onVisualizacaoChange={handleVisualizacaoChange}
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

      {/* Tour Guide */}
      {activeTour && (
        <TourGuide
          isActive={activeTour.isActive}
          currentStep={activeTour.currentStep}
          totalSteps={activeTour.totalSteps}
          currentStepData={activeTour.currentStepData}
          onNext={activeTour.nextStep}
          onPrev={activeTour.prevStep}
          onSkip={activeTour.skipTour}
          onClose={activeTour.closeTour}
          onCancel={activeTour.cancelTour}
          onSkipAll={activeTour.skipAllTours}
        />
      )}

      {/* Botão para reiniciar tour */}
      <TourRestartButton
        onRestartTour={() => {
          // Reiniciar o tour mais relevante baseado no contexto
          if (dadosConsulta.length > 0) {
            tourResultados.restartTour();
          } else {
            tourIntro.restartTour();
          }
        }}
        onRestartAllTours={() => {
          tourIntro.restartAllTours();
          tourResultados.restartAllTours();
          tourGraficos.restartAllTours();
        }}
        onToggleTour={(tourId, completed) => {
          // Delegar para o tour apropriado
          if (tourId === "consulta_intro") {
            tourIntro.toggleTourStatus(tourId, completed);
          } else if (tourId === "consulta_resultados") {
            tourResultados.toggleTourStatus(tourId, completed);
          } else if (tourId === "consulta_graficos") {
            tourGraficos.toggleTourStatus(tourId, completed);
          } 
        }}
        tourKey={
          activeTour
            ? activeTour === tourIntro
              ? "consulta_intro"
              : activeTour === tourResultados
              ? "consulta_resultados"
              : activeTour === tourGraficos
              ? "consulta_graficos"
              : "consulta_correcao"
            : undefined
        }
        completedTours={uniqueCompletedTours}
        completedToursCount={uniqueCompletedTours.length}
        isFirstTimeUser={tourIntro.isFirstTimeUser}
      />
    </div>
  );
}