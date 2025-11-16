import { memo } from "react";
import type { TipoGrafico } from "../../types/consulta";

interface ChartSelectorProps {
  tipoGrafico: TipoGrafico;
  onTipoGraficoChange: (tipo: TipoGrafico) => void;
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
    description: "Comparação direta entre valores",
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
    description: "Tendências e evolução temporal",
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
    description: "Proporções e percentuais",
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
    description: "Volumes e áreas acumuladas",
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
    description: "Comparação multidimensional",
  },
];

export const ChartSelector = memo(function ChartSelector({
  tipoGrafico,
  onTipoGraficoChange,
}: ChartSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Tipo de Gráfico
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {chartTypes.map((chart) => {
          const isSelected = tipoGrafico === chart.id;

          return (
            <button
              key={chart.id}
              onClick={() => onTipoGraficoChange(chart.id)}
              className={`
                group relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200
                ${
                  isSelected
                    ? "bg-blue-50 border-blue-600 shadow-md"
                    : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                }
              `}
              title={chart.description}
            >
              {/* Ícone */}
              <div
                className={`
                  p-2 rounded-lg transition-colors
                  ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"}
                `}
              >
                {chart.icon}
              </div>

              {/* Nome */}
              <span
                className={`
                  text-sm font-medium transition-colors
                  ${isSelected ? "text-blue-700" : "text-gray-700 group-hover:text-blue-600"}
                `}
              >
                {chart.name}
              </span>

              {/* Indicador de selecionado */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <svg
                    className="w-4 h-4 text-blue-600"
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

              {/* Descrição (tooltip ao hover) */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {chart.description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Informação adicional sobre o tipo selecionado */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>💡 Dica:</strong>{" "}
          {chartTypes.find((c) => c.id === tipoGrafico)?.description}
        </p>
      </div>
    </div>
  );
});

ChartSelector.displayName = "ChartSelector";