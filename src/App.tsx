import { Router } from "./Routes/Router";
import { TourProvider } from "./provider/TourProvider";

function App() {
  return (
    <TourProvider>
      <Router />
    </TourProvider>
  );
}

export default App;