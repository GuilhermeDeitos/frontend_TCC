import { createContext, useContext } from 'react';
import type { Tour } from '../types/tour';

interface TourContextType {
  tours: Tour[];
  startTour: (tourId: string) => void;
  restartTour: (tourId: string) => void;
  completeTour: (tourId: string) => void;
}

export const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTourContext = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTourContext must be used within a TourProvider');
  }
  return context;
};