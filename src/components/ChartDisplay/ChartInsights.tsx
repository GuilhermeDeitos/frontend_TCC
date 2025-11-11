import { memo } from "react";
import { formatCurrency } from "../../utils/chartUtils";
import type { ChartStatistics, ChartContextType } from "../../types/chart";

interface ChartInsightsProps {
  statistics: ChartStatistics;
  chartContext: ChartContextType;
}

export const ChartInsights = memo(({ statistics, chartContext }: ChartInsightsProps) => {
  if (statistics.quantidade <= 1) return null;

  const showGrowthInsight = (chartContext === 'temporal' || chartContext === 'evolution') && 
                            statistics.crescimento !== undefined;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        Insights Automáticos
      </h4>
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          • A diferença entre o valor máximo e mínimo é de{" "}
          <strong className="text-blue-700">
            {formatCurrency(statistics.max - statistics.min)}
          </strong>
        </p>
        
        {showGrowthInsight && statistics.crescimento !== undefined && (
          <p>
            • {statistics.crescimento > 0 ? "Crescimento" : "Redução"} de{" "}
            <strong
              className={statistics.crescimento > 0 ? "text-green-700" : "text-red-700"}
            >
              {Math.abs(statistics.crescimento).toFixed(1)}%
            </strong>{" "}
            entre o primeiro e último registro
          </p>
        )}
        
        <p>
          • Valores variam em média{" "}
          <strong className="text-purple-700">
            {formatCurrency(statistics.desvioPadrao)}
          </strong>{" "}
          em relação à média
        </p>

        {chartContext === 'comparison' && (
          <p>
            • O valor médio representa{" "}
            <strong className="text-indigo-700">
              {((statistics.media / statistics.total) * 100).toFixed(1)}%
            </strong>{" "}
            do total
          </p>
        )}
      </div>
    </div>
  );
});

ChartInsights.displayName = 'ChartInsights';