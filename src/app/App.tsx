import { Router } from "./Router";
import { TourProvider } from "./providers/TourProvider";

export function App() {
  return (
    <TourProvider>
      <Router />
    </TourProvider>
  );
}
