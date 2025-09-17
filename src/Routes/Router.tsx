import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainPage } from '../pages/Main';
import { ContactPage } from '../pages/Contact';
import { HelpPage } from '../pages/Help';
import { AboutPage } from '../pages/About';
import { CalculadoraIPCAPage } from '../pages/CalculadoraIPCA';
import { SeriesIPCAPage } from '../pages/SeriesIPCA';
import { ConsultaPage } from '../pages/Consulta';

export function Router(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/ajuda" element={<HelpPage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/calculadora-ipca" element={<CalculadoraIPCAPage />} />
        <Route path="/series-ipca" element={<SeriesIPCAPage />} />
        <Route path="/consulta" element={<ConsultaPage />} />
      </Routes>
    </BrowserRouter>
  )
}