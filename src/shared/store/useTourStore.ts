import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TourState {
  // Estado local (Sessão)
  activeTourKey: string | null;
  currentStep: number;
  startedThisSession: string[]; // Usando array em vez de Set para facilitar no Zustand

  // Estado persistido
  completedTours: string[];
  skippedTours: string[];

  // Ações
  startTour: (tourKey: string, force?: boolean) => void;
  nextStep: (totalSteps: number, tourKey: string) => void;
  prevStep: () => void;
  skipTour: (tourKey: string) => void;
  closeTour: () => void;
  cancelTour: () => void;
  skipAllTours: (tourKeys: string[]) => void;
  restartTour: (tourKey: string) => void;
  restartAllTours: (isConsultaRoute: boolean, currentTourKey: string) => void;
  toggleTourStatus: (targetTourKey: string, shouldBeCompleted: boolean) => void;
}

export const useTourStore = create<TourState>()(
  persist(
    (set, get) => ({
      activeTourKey: null,
      currentStep: 0,
      startedThisSession: [],
      completedTours: [],
      skippedTours: [],

      startTour: (tourKey, force = false) => {
        const state = get();
        
        if (force) {
          set({
            activeTourKey: tourKey,
            currentStep: 0,
            startedThisSession: Array.from(new Set([...state.startedThisSession, tourKey]))
          });
          return;
        }

        if (
          state.startedThisSession.includes(tourKey) ||
          state.completedTours.includes(tourKey) ||
          state.skippedTours.includes(tourKey)
        ) {
          return;
        }

        set({
          activeTourKey: tourKey,
          currentStep: 0,
          startedThisSession: Array.from(new Set([...state.startedThisSession, tourKey]))
        });
      },

      nextStep: (totalSteps, tourKey) => {
        const state = get();
        if (state.currentStep < totalSteps - 1) {
          set({ currentStep: state.currentStep + 1 });
        } else {
          // Tour completo
          set({
            completedTours: Array.from(new Set([...state.completedTours, tourKey])),
            activeTourKey: null,
            currentStep: 0
          });
        }
      },

      prevStep: () => {
        const state = get();
        if (state.currentStep > 0) {
          set({ currentStep: state.currentStep - 1 });
        }
      },

      skipTour: (tourKey) => {
        const state = get();
        // Mantendo a lógica original onde skip adiciona aos completados
        set({
          completedTours: Array.from(new Set([...state.completedTours, tourKey])),
          activeTourKey: null,
          currentStep: 0
        });
      },

      closeTour: () => set({ activeTourKey: null, currentStep: 0 }),
      cancelTour: () => set({ activeTourKey: null, currentStep: 0 }),

      skipAllTours: (tourKeys) => set({
        skippedTours: tourKeys,
        activeTourKey: null,
        currentStep: 0
      }),

      restartTour: (tourKey) => {
        const state = get();
        set({
          completedTours: state.completedTours.filter(key => key !== tourKey),
          skippedTours: state.skippedTours.filter(key => key !== tourKey),
          startedThisSession: state.startedThisSession.filter(key => key !== tourKey)
        });
        
        setTimeout(() => get().startTour(tourKey, true), 100);
      },

      restartAllTours: (isConsultaRoute, currentTourKey) => {
        set({
          completedTours: [],
          skippedTours: [],
          startedThisSession: [],
          activeTourKey: null,
          currentStep: 0
        });

        setTimeout(() => {
          if (isConsultaRoute) get().startTour(currentTourKey, true);
        }, 100);
      },

      toggleTourStatus: (targetTourKey, shouldBeCompleted) => {
        const state = get();
        if (shouldBeCompleted) {
          set({
            completedTours: Array.from(new Set([...state.completedTours, targetTourKey])),
            skippedTours: state.skippedTours.filter(key => key !== targetTourKey)
          });
        } else {
          set({
            completedTours: state.completedTours.filter(key => key !== targetTourKey),
            skippedTours: state.skippedTours.filter(key => key !== targetTourKey),
            startedThisSession: state.startedThisSession.filter(key => key !== targetTourKey)
          });
        }
      }
    }),
    {
      name: 'tour-storage', // Nome da chave no localStorage
      // partialize garante que apenas completados e pulados sejam salvos (isActive e currentStep resetam)
      partialize: (state) => ({
        completedTours: state.completedTours,
        skippedTours: state.skippedTours,
      }),
    }
  )
);