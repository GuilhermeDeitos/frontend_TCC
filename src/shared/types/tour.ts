interface Tour {
  id: string;
  name: string;
  completed: boolean;
  steps: string[];
}

interface TourStatus {
  currentTourId: string | null;
  completedTours: string[];
}

export type { Tour, TourStatus };