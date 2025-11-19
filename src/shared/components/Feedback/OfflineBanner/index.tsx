import { memo } from "react";
import { motion } from "framer-motion";

interface OfflineBannerProps {
  historicoCount: number;
  onRetry: () => void;
  onOpenHistorico: () => void;
}

export const OfflineBanner = memo(({
  historicoCount,
  onRetry,
  onOpenHistorico,
}: OfflineBannerProps) => {
  return (
    <motion.div
      key="offline-cache"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  Modo Offline - API Indisponível
                </h3>
                <p className="text-amber-800 mb-4">
                  Não foi possível conectar à API de Scrapping. Novas consultas não podem ser realizadas no momento.
                </p>

                {historicoCount > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Você tem {historicoCount}{" "}
                      {historicoCount === 1 ? "configuração salva" : "configurações salvas"}{" "}
                      no histórico
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={onRetry}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Tentar Reconectar
                  </button>

                  {historicoCount > 0 && (
                    <button
                      onClick={onOpenHistorico}
                      className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ver Histórico
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

OfflineBanner.displayName = "OfflineBanner";