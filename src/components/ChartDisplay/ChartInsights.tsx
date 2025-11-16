import { memo } from "react";
import { formatCurrency } from "../../utils/chartUtils";
import type { ChartStatistics } from "../../types/chart";

interface ChartInsightsProps {
  statistics: ChartStatistics;
  dados?: any[]; // Opcional, para contexto adicional
}

export const ChartInsights = memo(function ChartInsights({ 
  statistics,
  dados 
}: ChartInsightsProps) {
  if (statistics.quantidade <= 1) return null;

  const showGrowthInsight = statistics.crescimento !== undefined;
  const diferenca = statistics.max - statistics.min;
  const variacaoPercentual = (diferenca / statistics.media) * 100;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
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
        <p className="flex items-start gap-2">
          <span className="text-blue-600 mt-0.5">•</span>
          <span>
            A diferença entre o valor máximo e mínimo é de{" "}
            <strong className="text-blue-700">
              {formatCurrency(diferenca)}
            </strong>
            {" "}({variacaoPercentual.toFixed(1)}% da média)
          </span>
        </p>
        
        {showGrowthInsight && statistics.crescimento !== undefined && (
          <p className="flex items-start gap-2">
            <span className={statistics.crescimento > 0 ? "text-green-600" : "text-red-600"}>
              •
            </span>
            <span>
              {statistics.crescimento > 0 ? "Crescimento" : "Redução"} de{" "}
              <strong
                className={statistics.crescimento > 0 ? "text-green-700" : "text-red-700"}
              >
                {Math.abs(statistics.crescimento).toFixed(1)}%
              </strong>{" "}
              entre o primeiro e último registro
            </span>
          </p>
        )}
        
        <p className="flex items-start gap-2">
          <span className="text-purple-600 mt-0.5">•</span>
          <span>
            Valores variam em média{" "}
            <strong className="text-purple-700">
              {formatCurrency(statistics.desvioPadrao)}
            </strong>{" "}
            em relação à média (
            {((statistics.desvioPadrao / statistics.media) * 100).toFixed(1)}%)
          </span>
        </p>

        <p className="flex items-start gap-2">
          <span className="text-indigo-600 mt-0.5">•</span>
          <span>
            50% dos valores estão {statistics.mediana > statistics.media ? "acima" : "abaixo"} de{" "}
            <strong className="text-indigo-700">
              {formatCurrency(statistics.mediana)}
            </strong>{" "}
            (mediana)
          </span>
        </p>
      </div>
    </div>
  );
});

ChartInsights.displayName = 'ChartInsights';