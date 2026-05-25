import { useMemo, useCallback } from "react";
import { useTourStore } from "../store/useTourStore"; // Ajuste o caminho

interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement?: "top" | "right" | "bottom" | "left"; 
  condition?: () => boolean;
}

export function useTour(tourKey: string, steps: TourStep[]) {
  // Acessando o estado do Zustand
  const store = useTourStore();
  
  const isActive = store.activeTourKey === tourKey;
  const currentStep = store.currentStep;
  const completedTours = store.completedTours;
  const skippedTours = store.skippedTours;

  const isFirstTimeUser = useMemo(() => {
    return completedTours.length === 0 && skippedTours.length === 0;
  }, [completedTours, skippedTours]);

  const isTourCompleted = useMemo(() => {
    return completedTours.includes(tourKey) || skippedTours.includes(tourKey);
  }, [completedTours, skippedTours, tourKey]);

  const availableSteps = useMemo(() => {
    return steps.filter((step) => {
      if (!step.condition) return true;
      return step.condition();
    });
  }, [steps]);

  const currentStepData = useMemo(() => {
    return availableSteps[currentStep];
  }, [availableSteps, currentStep]);

  const totalSteps = availableSteps.length;

  // Envelopando ações para não precisar passar o tourKey em todos os componentes
  const startTour = useCallback((force: boolean = false) => store.startTour(tourKey, force), [store, tourKey]);
  const nextStep = useCallback(() => store.nextStep(totalSteps, tourKey), [store, totalSteps, tourKey]);
  const skipTour = useCallback(() => store.skipTour(tourKey), [store, tourKey]);
  const restartTour = useCallback(() => store.restartTour(tourKey), [store, tourKey]);
  
  const skipAllTours = useCallback(() => {
    const allTourKeys = [
      "mainPage", "calculadoraIPCA", "seriesIPCA", "consulta_intro",
      "consulta_formulario", "consulta_carregamento", "consulta_resultados",
      "consulta_tabela", "consulta_graficos", "consulta_exportacao",
      "consulta_correcao", "helpPage", "aboutPage", "contactPage",
    ];
    store.skipAllTours(allTourKeys);
  }, [store]);

  const restartAllTours = useCallback(() => {
    store.restartAllTours(tourKey.startsWith("consulta_"), tourKey);
  }, [store, tourKey]);

  return {
    isActive,
    currentStep,
    totalSteps,
    currentStepData,
    startTour,
    nextStep,
    prevStep: store.prevStep,
    skipTour,
    closeTour: store.closeTour,
    cancelTour: store.cancelTour,
    skipAllTours,
    restartTour,
    restartAllTours,
    toggleTourStatus: store.toggleTourStatus,
    completedTours,
    completedToursCount: completedTours.length,
    isFirstTimeUser,
    isTourCompleted,
  };
}