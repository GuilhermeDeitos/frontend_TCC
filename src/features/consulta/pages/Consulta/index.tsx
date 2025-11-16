import { useState, useEffect, useCallback, useRef, lazy, Suspense, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Imports estáticos (essenciais)
import { Header } from "@shared/components/Layout/Header";
import { Footer } from "@shared/components/Layout/Footer";
import { BlueTitleCard } from "@shared/components/UI/BlueTitleCard";
import { ConsultaForm } from "../../components/ConsultaForm";
import { LoadingIndicator } from "@shared/components/Feedback/LoadingIndicator";
import { TourGuide } from "@shared/components/tour/TourGuide";
import { TourRestartButton } from "@shared/components/tour/TourRestartButton";

// Lazy imports (componentes pesados)
const ResultsViewer = lazy(() => 
  import("../../components/ResultsViewer").then(module => ({ default: module.ResultsViewer }))
);
const HistoricoConsultas = lazy(() => 
  import("../../components/Historico/HistoricConsultas").then(module => ({ default: module.HistoricoConsultas }))
);
const ErrorPanel = lazy(() => 
  import("@shared/components/Feedback/ErrorPanel").then(module => ({ default: module.ErrorPanel }))
);

// Novos componentes otimizados
import { CacheControls } from "@shared/components/UI/CacheControls";
import { OfflineWarning } from "@shared/components/Feedback/OfflineWarning";
import { OfflineBanner } from "@shared/components/Feedback/OfflineBanner";

// Hooks
import { useConsultaPageTour } from "../../hooks/useConsultaPageTour";
import { useConsultaResultadosTour } from "../../hooks/useConsultaResultadosTour";
import { useConsultaGraficosTour } from "../../hooks/useConsultaGraficosTour";
import { useTransparenciaData } from "@shared/hooks/useTransparenciaData";
import { useConsultaCache, type IParamsOriginais } from "../../hooks/useConsultaCacheData";
import { useConsultaHandlers } from "../../hooks/useConsultaHandlers";
import { useHistoricoHandlers } from "../../hooks/useHistoricoHandlers";
import { useCacheRestoration } from "../../hooks/useCacheRestoration";
import { useAutoSaveCache } from "../../hooks/useAutoSaveCache";

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

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

export function ConsultaPage() {
  // Estados principais
  const [parametrosOriginais, setParametrosOriginais] = useState<IParamsOriginais | null>(null);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [apiOffline, setApiOffline] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [parametrosConsulta, setParametrosConsulta] = useState<{
    anoInicial: number;
    anoFinal: number;
  }>({ anoInicial: 0, anoFinal: 0 });

  // Hook de dados
  const {
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
  } = useTransparenciaData();

  // Hook de cache
  const {
    consultaAtual,
    historico,
    salvarConsulta,
    obterMetadadosHistorico,
    cacheEstaValido,
    getTempoRestanteCache,
    limparCache,
    limparHistorico,
    removerDoHistorico,
    atualizarVisualizacao,
  } = useConsultaCache();

  // Tours
  const { tourIntro } = useConsultaPageTour();
  const tourResultados = useConsultaResultadosTour();
  const tourGraficos = useConsultaGraficosTour();

  const toursJaSolicitados = useRef({
    resultados: false,
    graficos: false,
  });

  // Callback para mudança de visualização
  const handleVisualizacaoChange = useCallback(
    (tipo: "tabela" | "grafico") => {
      startTransition(() => {
        atualizarVisualizacao(tipo);

        if (
          tipo === "grafico" &&
          !tourGraficos.isTourCompleted &&
          !toursJaSolicitados.current.graficos
        ) {
          toursJaSolicitados.current.graficos = true;
          setTimeout(() => {
            tourGraficos.startTour(true);
          }, 600);
        }
      });
    },
    [tourGraficos, atualizarVisualizacao]
  );

  // Hook customizado para handlers de consulta
  const { handleSubmit, handleRetryApi, handleCancelarConsulta } = useConsultaHandlers({
    checkApiStatus,
    setApiOffline,
    setDadosConsulta,
    setParametrosConsulta,
    setParametrosOriginais,
    consultarDados,
    historicoCount: historico.length,
    setHistoricoAberto,
    toursJaSolicitados,
  });

  // Hook customizado para handlers de histórico
  const { historicoLoading, handleReexecutarConsulta } = useHistoricoHandlers({
    obterMetadadosHistorico,
    consultarDados,
    setDadosConsulta,
    setParametrosConsulta,
    setParametrosOriginais,
    handleVisualizacaoChange,
  });

  // Hook de restauração de cache
  const { cacheJaRestaurado, setCacheJaRestaurado } = useCacheRestoration({
    consultaAtual,
    cacheEstaValido,
    isLoading,
    setDadosConsulta,
    setParametrosConsulta,
    setParametrosOriginais,
    handleVisualizacaoChange,
    limparCache,
  });

  // Hook de salvamento automático
  useAutoSaveCache({
    dadosConsulta,
    parametrosConsulta,
    parametrosOriginais,
    salvarConsulta,
  });

  // Callback para limpar cache
  const handleClearCache = useCallback(() => {
    limparCache();
    setDadosConsulta([]);
    setCacheJaRestaurado(false);
  }, [limparCache, setDadosConsulta, setCacheJaRestaurado]);

  // Verificar status da API ao iniciar
  useEffect(() => {
    const verificarStatusInicial = async () => {
      const status = await checkApiStatus();
      setApiOffline(!status);
    };

    verificarStatusInicial();
  }, [checkApiStatus]);

  // Atualizar animation key quando dados mudam
  useEffect(() => {
    if (dadosConsulta.length > 0) {
      startTransition(() => {
        setAnimationKey((prev) => prev + 1);
      });
    }
  }, [dadosConsulta.length]);

  // Tour inicial
  useEffect(() => {
    if (!tourIntro.isTourCompleted && !tourIntro.isActive && !apiOffline) {
      const timer = setTimeout(() => {
        tourIntro.startTour();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [tourIntro, apiOffline]);

  // Determinar tour ativo
  const activeTour = tourIntro.isActive
    ? tourIntro
    : tourResultados.isActive
    ? tourResultados
    : tourGraficos.isActive
    ? tourGraficos
    : null;

  const allCompletedTours = [
    ...tourIntro.completedTours,
    ...tourResultados.completedTours,
    ...tourGraficos.completedTours,
  ];

  const uniqueCompletedTours = Array.from(new Set(allCompletedTours));

  const mostrarErro = error && !apiOffline && dadosConsulta.length === 0;
  const mostrarOfflineComHistorico = apiOffline && historico.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <AnimatePresence mode="wait">
        {mostrarErro ? (
          <Suspense fallback={<LoadingFallback />}>
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ErrorPanel message={error} retry={retryFetch} />
            </motion.div>
          </Suspense>
        ) : mostrarOfflineComHistorico ? (
          <OfflineBanner
            historicoCount={historico.length}
            onRetry={handleRetryApi}
            onOpenHistorico={() => setHistoricoAberto(true)}
          />
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
                <CacheControls
                  hasCache={!!consultaAtual && cacheEstaValido()}
                  cacheTime={getTempoRestanteCache()}
                  historicoCount={historico.length}
                  onOpenHistorico={() => setHistoricoAberto(true)}
                  onClearCache={handleClearCache}
                />

                {apiOffline && dadosConsulta.length > 0 && (
                  <OfflineWarning onRetry={handleRetryApi} />
                )}

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
                        registrosProcessados={progressoConsulta.registrosProcessados}
                        totalRegistros={progressoConsulta.totalRegistros}
                        anosProcessados={progressoConsulta.anosProcessados}
                        anoInicial={progressoConsulta.anoInicial}
                        anoFinal={progressoConsulta.anoFinal}
                        onCancel={() => handleCancelarConsulta(cancelarConsulta)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {!isLoading && dadosConsulta.length > 0 && (
                    <Suspense fallback={<LoadingFallback />}>
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
                    </Suspense>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      {activeTour && !apiOffline && (
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

      {!apiOffline && (
        <TourRestartButton
          onRestartTour={() => {
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
      )}

      <AnimatePresence>
        {historicoAberto && (
          <Suspense fallback={<LoadingFallback />}>
            <HistoricoConsultas
              historico={historico}
              onReexecutar={handleReexecutarConsulta}
              onRemover={removerDoHistorico}
              onLimparTudo={() => {
                limparHistorico();
                setHistoricoAberto(false);
              }}
              isOpen={historicoAberto}
              onClose={() => setHistoricoAberto(false)}
              isLoading={historicoLoading}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}