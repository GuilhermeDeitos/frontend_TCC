import { memo } from "react";
import { formatCurrency } from "../../utils/chartUtils";
import type { ChartStatistics } from "../../types/chart";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  statistics: ChartStatistics | null;
}

export const CustomTooltip = memo(({ active, payload, label, statistics }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0].value as number;
  const percentage = statistics ? ((value / statistics.total) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 max-w-xs">
      <p className="font-semibold text-gray-900 mb-2 truncate">{label}</p>
      <div className="space-y-1">
        <p className="text-sm">
          <span className="text-gray-600">Valor:</span>{" "}
          <span className="font-bold text-blue-600">{formatCurrency(value)}</span>
        </p>
        <p className="text-sm">
          <span className="text-gray-600">Percentual:</span>{" "}
          <span className="font-medium text-purple-600">{percentage}%</span>
        </p>
        {statistics && (
          <p className="text-xs text-gray-500 mt-2 pt-2 border-t">
            Diferença da média:{" "}
            <span
              className={`font-medium ${
                value > statistics.media ? "text-green-600" : "text-red-600"
              }`}
            >
              {value > statistics.media ? "+" : ""}
              {formatCurrency(value - statistics.media)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
});

CustomTooltip.displayName = 'CustomTooltip';