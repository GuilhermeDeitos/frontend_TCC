import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainPage } from '../pages/Main';
import { ContactPage } from '../pages/Contact';
import { HelpPage } from '../pages/Help';
import { AboutPage } from '../pages/About';
export function Router(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/ajuda" element={<HelpPage />} />
        <Route path="/sobre" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  )
}
