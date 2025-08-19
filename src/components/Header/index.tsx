/*
  Cabeçalho do sistema, utilizado para navegação entre as abas
  */

import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo.svg';


export function Header(){

  const paginas: Record<string, string> = {
    'Home': '/',
    'Sobre': '/sobre',
    'Contato': '/contato',
    'Ajuda': '/ajuda'
  };

  return(
    <header className="flex flex-col sm:flex-row items-center justify-between border-b-1 border-blue-200 shadow-2xs p-3 gap-3 sm:gap-0">
      <img src={Logo} alt="Logo" className='h-16 sm:h-20 md:h-25 ml-0 sm:ml-3' />
      <nav className='flex items-center mr-0 sm:mr-5'>
      <ul className="flex flex-col sm:flex-row justify-around gap-2 sm:gap-3 md:gap-5 text-lg sm:text-xl md:text-2xl">
        {Object.entries(paginas).map(([text, href]) => (
        <li key={href} className={`hover:text-blue-300 transition-colors duration-300 text-center ${location.pathname === href ? 'text-blue-500' : 'text-blue-950'}`}>
          <Link to={href}>{text}</Link>
        </li>
        ))}
      </ul>
      </nav>
    </header>
  )
}