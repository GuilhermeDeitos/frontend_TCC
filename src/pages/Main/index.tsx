/*
  Página principal do sistema, nela terá um cabeçalho com as abas de navegação, no centro terá uma explicação de como o sistema funciona e um rodapé com informações de contato.

*/
import { Header } from "../../components/Header"
import {MainPanel} from "../../components/MainPanel"
import { Footer } from "../../components/Footer"

export function MainPage(){
  return(
    <div>
      <Header />
      <MainPanel />
      <Footer />
    </div>
  )
}