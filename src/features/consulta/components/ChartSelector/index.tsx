import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TipoGrafico } from "../../types/consulta";

interface ChartSelectorProps {
  tipoGrafico: TipoGrafico;
  onTipoGraficoChange: (tipo: TipoGrafico) => void;
  isEvolutionMode?: boolean; // Nova prop
}

const chartTypes = [
  {
    id: "barras" as TipoGrafico,
    name: "Barras",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    id: "linhas" as TipoGrafico,
    name: "Linhas",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
      </svg>
    ),
  },
  {
    id: "pizza" as TipoGrafico,
    name: "Pizza",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        />
      </svg>
    ),
  },
  {
    id: "area" as TipoGrafico,
    name: "Área",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: "radar" as TipoGrafico,
    name: "Radar",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 2v10m0 0l7-7m-7 7l-7-7"
        />
      </svg>
    ),
  },
];

export const ChartSelector = memo(function ChartSelector({
  tipoGrafico,
  onTipoGraficoChange,
  isEvolutionMode = false,
}: ChartSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedChart = chartTypes.find((c) => c.id === tipoGrafico);

  // Se estiver no modo evolução, não renderizar o componente
  if (isEvolutionMode) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden max-w-full mb-3">
      {/* Header Colapsável */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div className="text-left min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
              Tipo de Gráfico
            </h3>
            <p className="text-xs text-gray-600 flex items-center gap-1.5">
              {selectedChart && (
                <>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {selectedChart.name}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <motion.svg
          className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      {/* Content Expandível */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
              {/* Grid de tipos de gráfico */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                {chartTypes.map((chart) => {
                  const isSelected = tipoGrafico === chart.id;

                  return (
                    <button
                      key={chart.id}
                      onClick={() => {
                        onTipoGraficoChange(chart.id);
                        setIsExpanded(false); // Fechar após seleção
                      }}
                      className={`
                        group relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                        ${
                          isSelected
                            ? "bg-blue-50 border-blue-600 shadow-md"
                            : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                        }
                      `}
                    >
                      {/* Ícone */}
                      <div
                        className={`
                          p-2 rounded-lg transition-colors
                          ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                          }
                        `}
                      >
                        {chart.icon}
                      </div>

                      {/* Nome */}
                      <span
                        className={`
                          text-xs sm:text-sm font-medium transition-colors text-center
                          ${
                            isSelected
                              ? "text-blue-700"
                              : "text-gray-700 group-hover:text-blue-600"
                          }
                        `}
                      >
                        {chart.name}
                      </span>

                      {/* Indicador de selecionado */}
                      {isSelected && (
                        <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ChartSelector.displayName = "ChartSelector";