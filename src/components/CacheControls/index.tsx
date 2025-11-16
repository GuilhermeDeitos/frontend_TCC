import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

interface CacheControlsProps {
  hasCache: boolean;
  cacheTime?: string | null;
  historicoCount: number;
  onOpenHistorico: () => void;
  onClearCache: () => void;
}

export const CacheControls = memo(({
  hasCache,
  cacheTime,
  historicoCount,
  onOpenHistorico,
  onClearCache,
}: CacheControlsProps) => {
  const handleClearCache = useCallback(async () => {
    const result = await Swal.fire({
      title: "Limpar Cache?",
      html: `
        <p>Os dados da consulta atual serão removidos do cache.</p>
        <p class="text-sm text-gray-600 mt-2">
          Tempo restante: <strong>${cacheTime || "0min"}</strong>
        </p>
        <p class="text-xs text-gray-500 mt-2">
          O histórico de configurações será mantido
        </p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, limpar!",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      onClearCache();
      
      Swal.fire({
        icon: "success",
        title: "Cache Limpo!",
        text: "Dados removidos. Histórico mantido.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }, [cacheTime, onClearCache]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end gap-3 mb-4"
    >
      <button
        onClick={onOpenHistorico}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Histórico
        {historicoCount > 0 && (
          <span className="bg-purple-800 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {historicoCount}
          </span>
        )}
      </button>

      {hasCache && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClearCache}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Limpar Cache
          {cacheTime && (
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
              expira em {cacheTime}
            </span>
          )}
        </motion.button>
      )}
    </motion.div>
  );
});

CacheControls.displayName = "CacheControls";