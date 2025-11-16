import { TourGuide } from '../TourGuide';
import { TourSectionMenu } from '../TourSectionMenu';
import type { ConsultaTourSection } from '../../hooks/useConsultaPageTour';

interface TourGuideExtendedProps {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepData: any;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onClose: () => void;
  onCancel: () => void;
  onSkipAll: () => void;
  // Propriedades específicas do tour de consulta
  currentSection: ConsultaTourSection;
  tourSections: Array<{
    id: ConsultaTourSection;
    title: string;
    icon: string;
    steps: any[];
  }>;
  showSectionMenu: boolean;
  setShowSectionMenu: (show: boolean) => void;
  goToSection: (sectionId: ConsultaTourSection) => void;
  nextSection: () => void;
  previousSection: () => void;
  completedTours: string[];
}

export function TourGuideExtended({
  isActive,
  currentStep,
  totalSteps,
  currentStepData,
  onNext,
  onPrev,
  onSkip,
  onClose,
  onCancel,
  onSkipAll,
  currentSection,
  tourSections,
  showSectionMenu,
  setShowSectionMenu,
  goToSection,
  nextSection,
  previousSection,
  completedTours,
}: TourGuideExtendedProps) {
  const currentSectionIndex = tourSections.findIndex(s => s.id === currentSection);
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === tourSections.length - 1;

  // Handler personalizado para próximo passo
  const handleNext = () => {
    if (currentStep === totalSteps - 1 && !isLastSection) {
      // Se é o último passo da seção atual e não é a última seção, ir para próxima seção
      nextSection();
    } else {
      onNext();
    }
  };

  // Handler personalizado para passo anterior
  const handlePrev = () => {
    if (currentStep === 0 && !isFirstSection) {
      // Se é o primeiro passo da seção atual e não é a primeira seção, voltar para seção anterior
      previousSection();
    } else {
      onPrev();
    }
  };

  return (
    <>
      <TourGuide
        isActive={isActive}
        currentStep={currentStep}
        totalSteps={totalSteps}
        currentStepData={currentStepData}
        onNext={handleNext}
        onPrev={handlePrev}
        onSkip={onSkip}
        onClose={onClose}
        onCancel={onCancel}
        onSkipAll={onSkipAll}
        extraButtons={
          <button
            onClick={() => setShowSectionMenu(true)}
            className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
            title="Navegar entre seções"
          >
            🗺️ Seções
          </button>
        }
        sectionInfo={{
          current: tourSections.find(s => s.id === currentSection)?.title || '',
          total: tourSections.length,
          index: currentSectionIndex + 1,
        }}
      />

      <TourSectionMenu
        isOpen={showSectionMenu}
        onClose={() => setShowSectionMenu(false)}
        sections={tourSections}
        currentSection={currentSection}
        onSelectSection={goToSection}
        completedTours={completedTours}
      />
    </>
  );
}