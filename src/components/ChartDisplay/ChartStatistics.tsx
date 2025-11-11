import { memo } from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "../../utils/chartUtils";
import type { ChartStatistics, ChartContextType } from "../../types/chart";

interface ChartStatisticsDisplayProps {
  statistics: ChartStatistics;
  chartContext: ChartContextType;
}

export const ChartStatisticsDisplay = memo(({ statistics, chartContext }: ChartStatisticsDisplayProps) => {
  const showGrowth = chartContext === 'temporal' || chartContext === 'evolution';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3"
      data-tour="chart-statistics"
    >
      <StatCard
        label="Total"
        value={formatCurrency(statistics.total)}
        color="blue"
      />
      <StatCard
        label="Média"
        value={formatCurrency(statistics.media)}
        color="brown"
      />
      <StatCard
        label="Máximo"
        value={formatCurrency(statistics.max)}
        color="purple"
      />
      <StatCard
        label="Mínimo"
        value={formatCurrency(statistics.min)}
        color="red"
      />
      <StatCard
        label="Mediana"
        value={formatCurrency(statistics.mediana)}
        color="green"
      />
      {showGrowth && statistics.crescimento !== undefined && (
        <StatCard
          label="Crescimento"
          value={`${statistics.crescimento > 0 ? '+' : ''}${statistics.crescimento.toFixed(1)}%`}
          color="indigo"
          valueColor={statistics.crescimento > 0 ? "text-green-900" : "text-red-900"}
        />
      )}
      <StatCard
        label="Desvio Padrão"
        value={formatCurrency(statistics.desvioPadrao)}
        color="yellow"
      />
      <StatCard
        label="Registros"
        value={statistics.quantidade.toString()}
        color="gray"
      />
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

const StatCard = memo(({ label, value, color, valueColor }: StatCardProps) => (
  <div className={` border-2 border-${color}-200 rounded-lg p-3`}>
    <p className={`text-xs text-${color}-700 font-medium mb-1`}>{label}</p>
    <p className={`text-sm font-bold ${valueColor || `text-${color}-900`}`}>
      {value}
    </p>
  </div>
));

StatCard.displayName = 'StatCard';