import { memo } from "react";
import { motion } from "framer-motion";

interface HistoricoButtonProps {
  count: number;
  onClick: () => void;
  hasCache: boolean;
}

export const HistoricoButton = memo(({
  count,
  onClick,
  hasCache,
}: HistoricoButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl font-medium hover:cursor-pointer"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Histórico</span>

      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white"
        >
          {count}
        </motion.span>
      )}

      {hasCache && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
          title="Consulta em cache"
        />
      )}
    </motion.button>
  );
});

HistoricoButton.displayName = 'HistoricoButton';