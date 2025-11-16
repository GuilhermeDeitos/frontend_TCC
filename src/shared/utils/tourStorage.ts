import type { Tour } from '../types/tour';

const TOUR_STORAGE_KEY = 'tours';

export const saveToursToLocalStorage = (tours: Tour[]) => {
  localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(tours));
};

export const getToursFromLocalStorage = (): Tour[] => {
  const tours = localStorage.getItem(TOUR_STORAGE_KEY);
  return tours ? JSON.parse(tours) : [];
};

export const clearToursFromLocalStorage = () => {
  localStorage.removeItem(TOUR_STORAGE_KEY);
};