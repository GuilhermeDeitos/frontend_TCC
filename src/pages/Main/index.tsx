import { Header } from "../../components/Header"
import { MainPanel } from "../../components/MainPanel"
import { Footer } from "../../components/Footer"
import { TourGuide } from "../../components/TourGuide"
import { TourRestartButton } from "../../components/TourRestartButton"
import { useMainPageTour } from "../../hooks/useMainPageTour"

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