import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingIndicator } from "@shared/components/Feedback/LoadingIndicator";

// Lazy load das features
const ConsultaPage = lazy(() => 
  import("@features/consulta/pages/Consulta").then(m => ({ default: m.ConsultaPage }))
);
const CalculadoraIPCAPage = lazy(() => 
  import("@features/ipca/pages/CalculadoraIPCA").then(m => ({ default: m.CalculadoraIPCAPage }))
);
const SeriesIPCAPage = lazy(() => 
  import("@features/ipca/pages/SeriesIPCA").then(m => ({ default: m.SeriesIPCAPage }))
);

//Páginas informacionais podem ficar sem lazy (são leves)
import { 
  MainPage, 
  AboutPage, 
  ContactPage, 
  HelpPage 
} from "@features/informational/pages";

export function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingIndicator />}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/ajuda" element={<HelpPage />} />
          
          <Route path="/consulta" element={<ConsultaPage />} />
          
          <Route path="/calculadora-ipca" element={<CalculadoraIPCAPage />} />
          <Route path="/series-ipca" element={<SeriesIPCAPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}