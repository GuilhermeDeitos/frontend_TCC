import { memo } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "../../utils/chartUtils";
import type { ChartStatistics } from "../../types/chart";

interface ChartStatisticsDisplayProps {
  statistics: ChartStatistics;
}

export const ChartStatisticsDisplay = memo(function ChartStatisticsDisplay({ 
  statistics,
}: ChartStatisticsDisplayProps) {
  const showGrowth = statistics.crescimento !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border-2 border-gray-200 rounded-lg p-4"
      data-tour="chart-statistics"
    >
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Estatísticas
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total"
          value={formatCurrency(statistics.total)}
          color="blue"
        />
        <StatCard
          label="Média"
          value={formatCurrency(statistics.media)}
          color="indigo"
        />
        <StatCard
          label="Máximo"
          value={formatCurrency(statistics.max)}
          color="green"
        />
        <StatCard
          label="Mínimo"
          value={formatCurrency(statistics.min)}
          color="red"
        />
        <StatCard
          label="Mediana"
          value={formatCurrency(statistics.mediana)}
          color="purple"
        />
        <StatCard
          label="Desvio Padrão"
          value={formatCurrency(statistics.desvioPadrao)}
          color="yellow"
        />
        {showGrowth && (
          <StatCard
            label="Crescimento"
            value={`${statistics.crescimento! > 0 ? '+' : ''}${statistics.crescimento!.toFixed(1)}%`}
            color={statistics.crescimento! > 0 ? "green" : "red"}
            valueColor={statistics.crescimento! > 0 ? "text-green-900" : "text-red-900"}
          />
        )}
        <StatCard
          label="Registros"
          value={statistics.quantidade.toString()}
          color="gray"
        />
      </div>
    </motion.div>
  );
});

ChartStatisticsDisplay.displayName = 'ChartStatisticsDisplay';

interface StatCardProps {
  label: string;
  value: string;
  color: string;
  valueColor?: string;
}

const colorMap: Record<string, { border: string; text: string; bg: string }> = {
  blue: { border: "border-blue-200", text: "text-blue-700", bg: "bg-blue-50" },
  indigo: { border: "border-indigo-200", text: "text-indigo-700", bg: "bg-indigo-50" },
  green: { border: "border-green-200", text: "text-green-700", bg: "bg-green-50" },
  red: { border: "border-red-200", text: "text-red-700", bg: "bg-red-50" },
  purple: { border: "border-purple-200", text: "text-purple-700", bg: "bg-purple-50" },
  yellow: { border: "border-yellow-200", text: "text-yellow-700", bg: "bg-yellow-50" },
  gray: { border: "border-gray-200", text: "text-gray-700", bg: "bg-gray-50" },
};

const StatCard = memo(function StatCard({ label, value, color, valueColor }: StatCardProps) {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-3`}>
      <p className={`text-xs ${colors.text} font-medium mb-1`}>{label}</p>
      <p className={`text-sm font-bold ${valueColor || colors.text.replace('700', '900')}`}>
        {value}
      </p>
    </div>
  );
});

StatCard.displayName = 'StatCard';