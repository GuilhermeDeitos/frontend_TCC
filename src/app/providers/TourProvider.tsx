import { useState, useEffect, type ReactNode } from "react";
import type { Tour } from "@shared/types/tour";
import { TourContext } from "@shared/contexts/TourContext";

const TOUR_STORAGE_KEY = "@sad-uepr:tour-steps";

interface TourSteps {
  [key: string]: boolean;
}

interface TourProviderProps {
  children: ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [tours, setTours] = useState<Tour[]>([]);

  // Carregar tours salvos do localStorage
  useEffect(() => {
    try {
      const savedTours: TourSteps = JSON.parse(
        localStorage.getItem(TOUR_STORAGE_KEY) || "{}"
      );
      
      // Converter para formato de Tour[]
      const toursList: Tour[] = Object.entries(savedTours).map(([key, completed]) => ({
        id: key,
        name: getTourName(key),
        completed: completed,
        steps: []
      }));
      
      setTours(toursList);
    } catch (error) {
      console.error("Erro ao carregar tours:", error);
    }
  }, []);

  // Helper para obter nome do tour
  const getTourName = (tourId: string): string => {
    const tourNames: Record<string, string> = {
      mainPage: "Tour da Página Principal",
      calculadoraIPCA: "Tour da Calculadora IPCA",
      seriesIPCA: "Tour das Séries IPCA",
      consulta: "Tour da Consulta",
    };
    return tourNames[tourId] || tourId;
  };

  const startTour = (tourId: string) => {
    console.log(`🎯 Iniciando tour: ${tourId}`);
    
    // Atualizar estado local
    setTours(prevTours => {
      const existingTour = prevTours.find(t => t.id === tourId);
      if (existingTour) {
        return prevTours;
      }
      
      return [
        ...prevTours,
        {
          id: tourId,
          name: getTourName(tourId),
          completed: false,
          steps: []
        }
      ];
    });
  };

  const restartTour = (tourId: string) => {
    console.log(`🔄 Reiniciando tour: ${tourId}`);
    
    try {
      // Remover do localStorage
      const tourSteps: TourSteps = JSON.parse(
        localStorage.getItem(TOUR_STORAGE_KEY) || "{}"
      );
      delete tourSteps[tourId];
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(tourSteps));
      
      // Atualizar estado local
      setTours(prevTours =>
        prevTours.map(tour =>
          tour.id === tourId ? { ...tour, completed: false } : tour
        )
      );
    } catch (error) {
      console.error("Erro ao reiniciar tour:", error);
    }
  };

  const completeTour = (tourId: string) => {
    console.log(`✅ Completando tour: ${tourId}`);
    
    try {
      // Salvar no localStorage
      const tourSteps: TourSteps = JSON.parse(
        localStorage.getItem(TOUR_STORAGE_KEY) || "{}"
      );
      tourSteps[tourId] = true;
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(tourSteps));
      
      // Atualizar estado local
      setTours(prevTours =>
        prevTours.map(tour =>
          tour.id === tourId ? { ...tour, completed: true } : tour
        )
      );
    } catch (error) {
      console.error("Erro ao completar tour:", error);
    }
  };

  return (
    <TourContext.Provider value={{ tours, startTour, restartTour, completeTour }}>
      {children}
    </TourContext.Provider>
  );
};