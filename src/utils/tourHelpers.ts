import type { Tour } from '../types/tour';

export const formatTourData = (tour: Tour): string => {
  return `Tour: ${tour.name} - Status: ${tour.completed ? 'Completo' : 'Pendente'}`;
};

export const getActiveTours = (tours: Tour[]): Tour[] => {
  return tours.filter(tour => !tour.completed);
};

export const getCompletedToursCount = (tours: Tour[]): number => {
  return tours.filter(tour => tour.completed).length;
};