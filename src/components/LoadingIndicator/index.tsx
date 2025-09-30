import { motion } from "framer-motion";

interface LoadingIndicatorProps {
  message?: string;
  progresso?: number;
  registrosProcessados?: number;
  totalRegistros?: number;
  anosProcessados?: Set<number>;
  anoInicial?: number;
  anoFinal?: number;
  onCancel?: () => void;
}

export function LoadingIndicator({ 
  message = "Consultando dados...", 
  progresso = 0,
  registrosProcessados = 0,
  totalRegistros = 0,
  anosProcessados = new Set<number>(),
  anoInicial,
  anoFinal,
  onCancel
}: LoadingIndicatorProps) {
  
  // Calcular total de anos processados
  const totalAnosProcessados = anosProcessados.size;
  const totalAnosEsperados = anoInicial && anoFinal ? (anoFinal - anoInicial + 1) : 0;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl p-8 sm:p-10 text-center max-w-xl w-full mx-4 relative"
      >
        <div className="flex flex-col items-center w-full">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ ease: "linear", duration: 1.5, repeat: Infinity }}
            className="rounded-full h-14 w-14 border-b-4 border-blue-600 mb-6"
          />
          
          <motion.h3 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-gray-900 mb-3"
          >
            {message}
          </motion.h3>
          
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mb-6"
          >
            Isso pode levar alguns minutos para períodos extensos
          </motion.p>
          
          {/* Barra de progresso principal */}
          <div className="w-full mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{progresso}% Concluído</span>
              <span>
                {registrosProcessados > 0 ? `${registrosProcessados.toLocaleString('pt-BR')} registros processados` : ''}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: `${progresso}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-blue-600 h-3 rounded-full"
              />
            </div>
          </div>
          
          {/* Estatísticas detalhadas */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 rounded-lg p-4 w-full"
          >
            <div className="grid grid-cols-2 gap-6 text-base">
              <div>
                <div className="text-sm text-blue-600 font-medium mb-1">Anos processados:</div>
                <div className="text-lg font-semibold">
                  {totalAnosProcessados}
                  {totalAnosEsperados > 0 && (
                    <span className="text-gray-500"> de {totalAnosEsperados}</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-blue-600 font-medium mb-1">Registros:</div>
                <div className="text-lg font-semibold">
                  {registrosProcessados.toLocaleString('pt-BR')}
                  {totalRegistros > 0 && totalRegistros > registrosProcessados && (
                    <span className="text-gray-500"> de ~{totalRegistros.toLocaleString('pt-BR')}</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Detalhes de anos */}
            {anoInicial && anoFinal && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="text-sm text-blue-600 font-medium mb-2">Anos:</div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: anoFinal - anoInicial + 1 }).map((_, i) => {
                    const anoAtual = anoInicial + i;
                    const processado = anosProcessados.has(anoAtual);
                    
                    return (
                      <motion.div
                        key={anoAtual}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                          scale: processado ? 1 : 0.9, 
                          opacity: 1 
                        }}
                        transition={{ 
                          delay: 0.5 + (i * 0.1),
                          duration: 0.3
                        }}
                        className={`text-center py-1 px-2 rounded ${
                          processado 
                            ? 'bg-green-100 text-green-800 font-medium' 
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {anoAtual}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Dica informativa */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-blue-600 mt-6 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Você pode visualizar o progresso enquanto os dados são processados
          </motion.p>
          
          {/* Botão Cancelar */}
          {onCancel && (
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onCancel}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="mt-6 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cancelar Consulta
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}