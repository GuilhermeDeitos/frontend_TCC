import { memo } from "react";
import { motion } from "framer-motion";

interface OfflineWarningProps {
  onRetry: () => void;
}

export const OfflineWarning = memo(({ onRetry }: OfflineWarningProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 bg-amber-100 border-l-4 border-amber-500 p-4 rounded-lg"
    >
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm text-amber-800">
          <strong>Modo Offline:</strong> Visualizando dados em cache. Novas consultas não disponíveis.
        </p>
        <button
          onClick={onRetry}
          className="ml-auto px-3 py-1 bg-amber-600 text-white text-sm rounded hover:bg-amber-700 transition-colors"
        >
          Reconectar
        </button>
      </div>
    </motion.div>
  );
});

OfflineWarning.displayName = "OfflineWarning";