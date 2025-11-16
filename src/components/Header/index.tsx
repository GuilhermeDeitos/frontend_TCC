import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../assets/Logo.svg';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const paginas: Record<string, string> = {
    'Início': '/',
    'Consulta Universidades': '/consulta',
    'Calculadora IPCA': '/calculadora-ipca',
    'Séries IPCA': '/series-ipca',
    'Sobre': '/sobre',
    'Contato': '/contato',
    'Ajuda': '/ajuda'
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="relative bg-white shadow-sm">
      <div className="flex items-center justify-between p-3 md:p-4">
        {/* Logo */}
        <Link to="/" onClick={closeMenu}>
          <img 
            src={Logo} 
            alt="Logo" 
            className='h-12 sm:h-16 md:h-20 hover:opacity-80 transition-opacity' 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden lg:flex items-center'>
          <ul className="flex items-center gap-2 xl:gap-4">
            {Object.entries(paginas).map(([text, href]) => (
              <li key={href}>
                <Link
                  to={href}
                  className={`px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-blue-500 hover:text-white ${
                    location.pathname === href 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'text-blue-950 hover:shadow-md'
                  }`}
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <motion.div
            animate={isMenuOpen ? "open" : "closed"}
            className="w-6 h-5 flex flex-col justify-between"
          >
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 8 }
              }}
              className="w-full h-0.5 bg-blue-950 rounded-full block"
            />
            <motion.span
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 }
              }}
              className="w-full h-0.5 bg-blue-950 rounded-full block"
            />
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -8 }
              }}
              className="w-full h-0.5 bg-blue-950 rounded-full block"
            />
          </motion.div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Menu Panel */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-64 bg-white shadow-2xl z-50 overflow-y-auto"
            >
              {/* Close button */}
              <div className="flex justify-end p-4 border-b border-gray-200">
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu items */}
              <ul className="p-4 space-y-2">
                {Object.entries(paginas).map(([text, href]) => (
                  <li key={href}>
                    <Link
                      to={href}
                      onClick={closeMenu}
                      className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                        location.pathname === href
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-blue-950 hover:bg-blue-50'
                      }`}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}