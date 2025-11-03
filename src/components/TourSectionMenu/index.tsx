import { motion, AnimatePresence } from 'framer-motion';
import type { ConsultaTourSection } from '../../hooks/useConsultaPageTour';

interface TourSectionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Array<{
    id: ConsultaTourSection;
    title: string;
    icon: string;
  }>;
  currentSection: ConsultaTourSection;
  onSelectSection: (sectionId: ConsultaTourSection) => void;
  completedTours: string[];
}

export function TourSectionMenu({
  isOpen,
  onClose,
  sections,
  currentSection,
  onSelectSection,
  completedTours,
}: TourSectionMenuProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              🗺️ Navegação do Tour
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4">
              Selecione uma seção para iniciar ou continuar o tour:
            </p>

            <div className="space-y-2">
              {sections.map((section) => {
                const isCompleted = completedTours.includes(`consulta_${section.id}`);
                const isCurrent = section.id === currentSection;

                return (
                  <button
                    key={section.id}
                    onClick={() => onSelectSection(section.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50'
                        : isCompleted
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{section.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {section.title}
                          </div>
                          {isCurrent && (
                            <span className="text-xs text-blue-600">Seção atual</span>
                          )}
                          {isCompleted && !isCurrent && (
                            <span className="text-xs text-green-600">✓ Concluído</span>
                          )}
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fechar Menu
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}