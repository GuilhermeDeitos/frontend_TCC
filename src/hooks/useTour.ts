import { useState, useCallback, useRef } from "react";
import { useTourContext } from "../context/TourContext";

interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
  action?: () => void;
  condition?: () => boolean;
  waitForElement?: boolean;
}

interface TourState {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
}

interface TourSteps {
  [key: string]: boolean;
}

const TOUR_STORAGE_KEY = "@sad-uepr:tour-steps";

export function useTour(tourId: string, steps: TourStep[]) {
  const [tourState, setTourState] = useState<TourState>({
    isActive: false,
    currentStep: 0,
    steps: [],
  });

  const hasStartedRef = useRef(false);
  const isCancelledRef = useRef(false);
  
  // Integrar com o contexto
  const tourContext = useTourContext();

  const isTourCompleted = useCallback(() => {
    try {
      const tourSteps: TourSteps = JSON.parse(
        localStorage.getItem(TOUR_STORAGE_KEY) || "{}"
      );
      return tourSteps[tourId] === true;
    } catch {
      return false;
    }
  }, [tourId]);

  const markTourCompleted = useCallback(() => {
    try {
      const tourSteps: TourSteps = JSON.parse(
        localStorage.getItem(TOUR_STORAGE_KEY) || "{}"
      );
      tourSteps[tourId] = true;
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(tourSteps));
      
      // Atualizar contexto
      tourContext.completeTour(tourId);
      
      console.log(`✅ Tour ${tourId} marcado como completado`);
    } catch (error) {
      console.error("Erro ao salvar progresso do tour:", error);
    }
  }, [tourId, tourContext]);

  const isFirstTimeUser = useCallback(() => {
    try {
      const tourSteps: TourSteps = JSON.parse(
        localStorage.getItem(TOUR_STORAGE_KEY) || "{}"
      );
      return Object.keys(tourSteps).length === 0;
    } catch {
      return true;
    }
  }, []);

  const getCompletedToursCount = useCallback(() => {
    try {
      const tourSteps: TourSteps = JSON.parse(
        localStorage.getItem(TOUR_STORAGE_KEY) || "{}"
      );
      return Object.values(tourSteps).filter(Boolean).length;
    } catch {
      return 0;
    }
  }, []);

  const getCompletedTours = useCallback(() => {
    try {
      const tourSteps: TourSteps = JSON.parse(
        localStorage.getItem(TOUR_STORAGE_KEY) || "{}"
      );
      return Object.keys(tourSteps).filter((key) => tourSteps[key]);
    } catch {
      return [];
    }
  }, []);

  const getValidSteps = useCallback(() => {
    return steps.filter((step) => {
      if (step.condition && !step.condition()) {
        console.log(`Passo ${step.id} filtrado por condição`);
        return false;
      }

      if (step.target === "body") {
        return true;
      }

      const element = document.querySelector(step.target);
      if (!element) {
        console.log(
          `Passo ${step.id} filtrado - elemento ${step.target} não encontrado`
        );
        return false;
      }

      return true;
    });
  }, [steps]);

  const nextStep = useCallback(() => {
    setTourState((prev) => {
      if (prev.currentStep < prev.steps.length - 1) {
        const nextStepIndex = prev.currentStep + 1;
        const nextStepData = prev.steps[nextStepIndex];
        
        console.log(
          `➡️ Tour ${tourId}: Avançando para passo ${nextStepIndex + 1}/${
            prev.steps.length
          }`
        );
        
        if (nextStepData?.action) {
          setTimeout(() => {
            nextStepData.action!();
          }, 300);
        }
        
        return { ...prev, currentStep: nextStepIndex };
      } else {
        console.log(`🎉 Tour ${tourId} finalizado`);
        markTourCompleted();
        return { ...prev, isActive: false };
      }
    });
  }, [tourId, markTourCompleted]);

  const startTour = useCallback(() => {
    console.log(`🎯 Tentando iniciar tour ${tourId}`);

    if (hasStartedRef.current || isCancelledRef.current) {
      console.log(
        `⏭️ Tour ${tourId} já foi iniciado ou cancelado nesta sessão`
      );
      return;
    }

    if (isTourCompleted()) {
      console.log(`✅ Tour ${tourId} já foi completado`);
      return;
    }

    const validSteps = getValidSteps();

    if (validSteps.length === 0) {
      console.log(`❌ Nenhum passo válido encontrado para tour ${tourId}`);
      return;
    }

    console.log(`🚀 Iniciando tour ${tourId} com ${validSteps.length} passos`);

    // Notificar contexto
    tourContext.startTour(tourId);
    
    hasStartedRef.current = true;
    setTourState({
      isActive: true,
      currentStep: 0,
      steps: validSteps,
    });
  }, [tourId, isTourCompleted, getValidSteps, tourContext]);

  const prevStep = useCallback(() => {
    setTourState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  }, []);

  const skipAllTours = useCallback(() => {
    console.log('⏭️ Pulando TODOS os tours');
    try {
      const allKnownTours = ['mainPage', 'calculadoraIPCA', 'seriesIPCA', 'consulta'];
      const tourSteps: TourSteps = JSON.parse(
        localStorage.getItem(TOUR_STORAGE_KEY) || "{}"
      );
      
      allKnownTours.forEach(tour => {
        tourSteps[tour] = true;
        tourContext.completeTour(tour);
      });
      
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(tourSteps));
      
      isCancelledRef.current = true;
      setTourState((prev) => ({ ...prev, isActive: false }));
      
      console.log('✅ Todos os tours foram marcados como completados');
    } catch (error) {
      console.error('Erro ao pular todos os tours:', error);
    }
  }, [tourContext]);

  const skipTour = useCallback(() => {
    console.log(`⏭️ Tour ${tourId} pulado pelo usuário`);
    markTourCompleted();
    isCancelledRef.current = true;
    setTourState((prev) => ({ ...prev, isActive: false }));
  }, [tourId, markTourCompleted]);

  const cancelTour = useCallback(() => {
    console.log(`❌ Tour ${tourId} cancelado pelo usuário`);
    isCancelledRef.current = true;
    setTourState((prev) => ({ ...prev, isActive: false }));
  }, [tourId]);

  const closeTour = useCallback(() => {
    console.log(`🔒 Tour ${tourId} fechado`);
    setTourState((prev) => ({ ...prev, isActive: false }));
  }, [tourId]);

  const restartTour = useCallback(() => {
    try {
      const tourSteps: TourSteps = JSON.parse(
        localStorage.getItem(TOUR_STORAGE_KEY) || "{}"
      );
      delete tourSteps[tourId];
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(tourSteps));
      
      // Notificar contexto
      tourContext.restartTour(tourId);
      
      console.log(`🔄 Tour ${tourId} resetado - iniciando novamente`);

      hasStartedRef.current = false;
      isCancelledRef.current = false;

      setTimeout(() => {
        startTour();
      }, 100);
    } catch (error) {
      console.error("Erro ao resetar tour:", error);
    }
  }, [tourId, tourContext, startTour]);

  const restartAllTours = useCallback(() => {
    try {
      localStorage.removeItem(TOUR_STORAGE_KEY);
      
      // Reiniciar todos os tours no contexto
      const allKnownTours = ['mainPage', 'calculadoraIPCA', 'seriesIPCA', 'consulta'];
      allKnownTours.forEach(tour => {
        tourContext.restartTour(tour);
      });
      
      console.log(`🔄 Todos os tours resetados`);

      hasStartedRef.current = false;
      isCancelledRef.current = false;

      setTimeout(() => {
        startTour();
      }, 100);
    } catch (error) {
      console.error("Erro ao resetar todos os tours:", error);
    }
  }, [tourContext, startTour]);

  return {
    tourState,
    isActive: tourState.isActive,
    currentStep: tourState.currentStep,
    currentStepData: tourState.steps[tourState.currentStep],
    totalSteps: tourState.steps.length,
    isTourCompleted: isTourCompleted(),
    isFirstTimeUser: isFirstTimeUser(),
    completedToursCount: getCompletedToursCount(),
    completedTours: getCompletedTours(),
    startTour,
    nextStep,
    prevStep,
    skipAllTours,
    skipTour,
    cancelTour,
    closeTour,
    restartTour,
    restartAllTours,
  };
}