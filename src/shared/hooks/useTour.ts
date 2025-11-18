import { useState, useEffect, useCallback, useMemo } from "react";

interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement?: "top" | "right" | "bottom" | "left"; 
  condition?: () => boolean;
}

export function useTour(tourKey: string, steps: TourStep[]) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  const [startedThisSession, setStartedThisSession] = useState<Set<string>>(
    new Set()
  );
  const [skippedTours, setSkippedTours] = useState<string[]>([]);

  // Carregar tours completados do localStorage
  useEffect(() => {
    const completed = localStorage.getItem("completedTours");
    const skipped = localStorage.getItem("skippedTours");

    if (completed) {
      setCompletedTours(JSON.parse(completed));
    }
    if (skipped) {
      setSkippedTours(JSON.parse(skipped));
    }
  }, []);

  // Verificar se é primeira visita do usuário (nenhum tour completado)
  const isFirstTimeUser = useMemo(() => {
    return completedTours.length === 0 && skippedTours.length === 0;
  }, [completedTours, skippedTours]);

  // Verificar se este tour específico foi completado
  const isTourCompleted = useMemo(() => {
    return completedTours.includes(tourKey) || skippedTours.includes(tourKey);
  }, [completedTours, skippedTours, tourKey]);

  // Filtrar steps com base em suas condições
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

  // Iniciar tour - agora aceita parâmetro para forçar início
  const startTour = useCallback(
    (force: boolean = false) => {
      console.log(`Tentando iniciar tour ${tourKey}`, { force });

      // Se force=true, sempre inicia
      if (force) {
        console.log(`Forçando início do tour ${tourKey}`);
        setIsActive(true);
        setCurrentStep(0);
        setStartedThisSession((prev) => new Set(prev).add(tourKey));
        return;
      }

      // Verificar se já foi iniciado nesta sessão (comportamento normal)
      if (startedThisSession.has(tourKey)) {
        console.log(`Tour ${tourKey} já foi iniciado nesta sessão`);
        return;
      }

      // Verificar se já foi completado ou pulado
      if (completedTours.includes(tourKey) || skippedTours.includes(tourKey)) {
        console.log(
          `Tour ${tourKey} já foi completado ou pulado anteriormente`
        );
        return;
      }

      console.log(`Iniciando tour ${tourKey}`);
      setIsActive(true);
      setCurrentStep(0);
      setStartedThisSession((prev) => new Set(prev).add(tourKey));
    },
    [tourKey, startedThisSession, completedTours, skippedTours]
  );

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Tour completo
      const newCompleted = [...completedTours, tourKey];
      setCompletedTours(newCompleted);
      localStorage.setItem("completedTours", JSON.stringify(newCompleted));
      setIsActive(false);
      setCurrentStep(0);
    }
  }, [currentStep, totalSteps, tourKey, completedTours]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const skipTour = useCallback(() => {
    const newCompleted = [...completedTours, tourKey];
    setCompletedTours(newCompleted);
    localStorage.setItem("completedTours", JSON.stringify(newCompleted));
    setIsActive(false);
    setCurrentStep(0);
  }, [tourKey, completedTours]);

  const closeTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
  }, []);

  const cancelTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
  }, []);

  const skipAllTours = useCallback(() => {
    const allTourKeys = [
      "mainPage",
      "calculadoraIPCA",
      "seriesIPCA",
      "consulta_intro",
      "consulta_formulario",
      "consulta_carregamento",
      "consulta_resultados",
      "consulta_tabela",
      "consulta_graficos",
      "consulta_exportacao",
      "consulta_correcao",
      "helpPage",
      "aboutPage",
      "contactPage",
    ];

    setSkippedTours(allTourKeys);
    localStorage.setItem("skippedTours", JSON.stringify(allTourKeys));
    setIsActive(false);
    setCurrentStep(0);
  }, []);

  const restartTour = useCallback(() => {
    const newCompleted = completedTours.filter((key) => key !== tourKey);
    const newSkipped = skippedTours.filter((key) => key !== tourKey);

    setCompletedTours(newCompleted);
    setSkippedTours(newSkipped);
    localStorage.setItem("completedTours", JSON.stringify(newCompleted));
    localStorage.setItem("skippedTours", JSON.stringify(newSkipped));

    // Remover da lista de iniciados nesta sessão
    setStartedThisSession((prev) => {
      const newSet = new Set(prev);
      newSet.delete(tourKey);
      return newSet;
    });

    // Iniciar o tour imediatamente
    setTimeout(() => {
      startTour(true);
    }, 100);
  }, [tourKey, completedTours, skippedTours, startTour]);

  const restartAllTours = useCallback(() => {
    setCompletedTours([]);
    setSkippedTours([]);
    setStartedThisSession(new Set());
    localStorage.removeItem("completedTours");
    localStorage.removeItem("skippedTours");

    // Iniciar tour de introdução se for consulta
    setTimeout(() => {
      if (tourKey.startsWith("consulta_")) {
        startTour(true);
      }
    }, 100);
  }, [tourKey, startTour]);

  // Nova função para alternar status do tour
  const toggleTourStatus = useCallback(
    (targetTourKey: string, shouldBeCompleted: boolean) => {
      console.log(
        ` Alternando status do tour ${targetTourKey} para ${
          shouldBeCompleted ? "completo" : "pendente"
        }`
      );

      if (shouldBeCompleted) {
        // Adicionar aos completados
        const newCompleted = Array.from(
          new Set([...completedTours, targetTourKey])
        );
        setCompletedTours(newCompleted);
        localStorage.setItem("completedTours", JSON.stringify(newCompleted));

        // Remover dos pulados se existir
        const newSkipped = skippedTours.filter((key) => key !== targetTourKey);
        setSkippedTours(newSkipped);
        localStorage.setItem("skippedTours", JSON.stringify(newSkipped));
      } else {
        // Remover dos completados
        const newCompleted = completedTours.filter(
          (key) => key !== targetTourKey
        );
        setCompletedTours(newCompleted);
        localStorage.setItem("completedTours", JSON.stringify(newCompleted));

        // Remover dos pulados
        const newSkipped = skippedTours.filter((key) => key !== targetTourKey);
        setSkippedTours(newSkipped);
        localStorage.setItem("skippedTours", JSON.stringify(newSkipped));

        // Remover da lista de iniciados nesta sessão
        setStartedThisSession((prev) => {
          const newSet = new Set(prev);
          newSet.delete(targetTourKey);
          return newSet;
        });
      }
    },
    [completedTours, skippedTours]
  );

  const completedToursCount = completedTours.length;

  return {
    isActive,
    currentStep,
    totalSteps,
    currentStepData,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    closeTour,
    cancelTour,
    skipAllTours,
    restartTour,
    restartAllTours,
    toggleTourStatus,
    completedTours,
    completedToursCount,
    isFirstTimeUser,
    isTourCompleted,
  };
}