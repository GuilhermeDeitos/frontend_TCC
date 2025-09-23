import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiAlertTriangle, FiServer, FiWifi } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface ErrorPanelProps {
  message?: string;
  retry?: () => void;
}

export function ErrorPanel({ message, retry }: ErrorPanelProps) {
  const [status, setStatus] = useState<'loading' | 'error' | 'server-down'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await axios.get('/transparencia/status');
      
      if (response.data?.status === 'ok') {
        // Se chegamos aqui mas o componente está sendo mostrado, 
        // provavelmente é outro tipo de erro
        setStatus('error');
        setErrorMessage(message || 'Ocorreu um erro inesperado.');
      } else {
        setStatus('server-down');
        setErrorMessage(message || 'API de Scrapping está offline.');
      }
    } catch (error) {
      setStatus('server-down');
      setErrorMessage(message || 'Servidor fora do ar.');
    }
  };

  const handleRetry = () => {
    setStatus('loading');
    if (retry) {
      retry();
    } else {
      checkApiStatus();
    }
  };

  const iconVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.9, 1, 0.9],
      transition: { repeat: Infinity, duration: 2 }
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[400px] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="bg-red-600 h-2 w-full"></div>
        
        <div className="p-6 sm:p-8 text-center">
          <motion.div 
            variants={iconVariants}
            animate="pulse"
            className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-red-50 mb-6"
          >
            {status === 'server-down' ? (
              <FiServer className="text-red-500 w-12 h-12" />
            ) : (
              <FiAlertTriangle className="text-red-500 w-12 h-12" />
            )}
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {status === 'server-down' ? 'Servidor Indisponível' : 'Erro Inesperado'}
          </h2>
          
          <p className="text-gray-600 mb-6 text-base sm:text-lg">
            {errorMessage}
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={handleRetry}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <FiWifi className="mr-2 h-5 w-5" />
              Tentar novamente
            </button>
            
            <p className="text-sm text-gray-500">
              Se o problema persistir, entre em contato com o suporte técnico.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-center border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span>Verificando status do servidor...</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}