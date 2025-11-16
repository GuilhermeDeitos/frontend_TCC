import { Header } from "@shared/components/Layout/Header";
import { Footer } from "@shared/components/Layout/Footer";
import { TourGuide } from "@shared/components/tour/TourGuide";
import { TourRestartButton } from "@shared/components/tour/TourRestartButton";
import { useMainPageTour } from "../../hooks/useMainPageTour"
import { MainPanel } from "@/shared/components/Layout/MainPanel";

export function MainPage(){
  const tour = useMainPageTour();

  return(
    <div>
      <Header />
      <MainPanel />
      <Footer />
      
      {/* Tour Guide */}
      <TourGuide
        isActive={tour.isActive}
        currentStep={tour.currentStep}
        totalSteps={tour.totalSteps}
        currentStepData={tour.currentStepData}
        onNext={tour.nextStep}
        onPrev={tour.prevStep}
        onSkip={tour.skipTour}
        onClose={tour.closeTour}
        onCancel={tour.cancelTour}
        onSkipAll={tour.skipAllTours}
      />

      {/* Botão para reiniciar tour */}
      <TourRestartButton
        onRestartTour={tour.restartTour}
        onRestartAllTours={tour.restartAllTours}
        tourKey="mainPage"
        completedTours={tour.completedTours}
        completedToursCount={tour.completedToursCount}
        isFirstTimeUser={tour.isFirstTimeUser}
      />
    </div>
  )
}