import { memo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Brush,
} from "recharts";
import type { DadoGrafico } from "../../types/consulta";
import type { ChartStatistics } from "../../types/chart";
import { CustomTooltip } from "./CustomTooltip";
import { formatAxisValue } from "../../utils/chartUtils";

interface ChartRendererProps {
  dados: DadoGrafico[];
  colors: string[];
  statistics: ChartStatistics | null;
  showAverage: boolean;
  enableZoom: boolean;
  highlightedIndex: number | null;
  onHighlight: (index: number | null) => void;
}

// Componente customizado para o Brush com nomes truncados
const CustomBrushTick = ({ x, y, payload }: any) => {
  const text = payload.value;
  const maxLength = 8;
  const displayText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#666"
        fontSize={10}
        title={text}
      >
        {displayText}
      </text>
    </g>
  );
};

export const BarChartRenderer = memo(({
  dados,
  colors,
  statistics,
  showAverage,
  enableZoom,
  highlightedIndex,
  onHighlight,
}: ChartRendererProps) => (
  <ResponsiveContainer width="100%" height={500}>
    <BarChart
      data={dados}
      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis
        dataKey="universidade"
        angle={-45}
        textAnchor="end"
        height={100}
        tick={{ fontSize: 11 }}
      />
      <YAxis tickFormatter={formatAxisValue} tick={{ fontSize: 12 }} />
      <Tooltip content={<CustomTooltip statistics={statistics} />} />
      <Legend wrapperStyle={{ paddingTop: "20px" }} />
      {showAverage && statistics && (
        <ReferenceLine
          y={statistics.media}
          stroke="#8B5CF6"
          strokeDasharray="5 5"
          strokeWidth={2}
          label={{
            value: `Média: ${formatAxisValue(statistics.media)}`,
            position: "right",
            fill: "#8B5CF6",
            fontSize: 12,
          }}
        />
      )}
      <Bar
        dataKey="valor"
        name="Valor (R$)"
        radius={[8, 8, 0, 0]}
        onMouseEnter={(_, index) => onHighlight(index)}
        onMouseLeave={() => onHighlight(null)}
      >
        {dados.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={colors[index % colors.length]}
            opacity={highlightedIndex === null || highlightedIndex === index ? 1 : 0.5}
          />
        ))}
      </Bar>
      {enableZoom && (
        <Brush
          dataKey="universidade"
          height={40}
          stroke="#3B82F6"
          fill="#EFF6FF"
          travellerWidth={10}
          tick={<CustomBrushTick />}
        />
      )}
    </BarChart>
  </ResponsiveContainer>
));

BarChartRenderer.displayName = 'BarChartRenderer';

export const LineChartRenderer = memo(({
  dados,
  colors,
  statistics,
  showAverage,
  enableZoom,
}: ChartRendererProps) => (
  <ResponsiveContainer width="100%" height={500}>
    <LineChart
      data={dados}
      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis
        dataKey="universidade"
        angle={-45}
        textAnchor="end"
        height={100}
        tick={{ fontSize: 11 }}
      />
      <YAxis tickFormatter={formatAxisValue} tick={{ fontSize: 12 }} />
      <Tooltip content={<CustomTooltip statistics={statistics} />} />
      <Legend wrapperStyle={{ paddingTop: "20px" }} />
      {showAverage && statistics && (
        <ReferenceLine
          y={statistics.media}
          stroke="#8B5CF6"
          strokeDasharray="5 5"
          strokeWidth={2}
          label={{
            value: `Média: ${formatAxisValue(statistics.media)}`,
            position: "right",
            fill: "#8B5CF6",
            fontSize: 12,
          }}
        />
      )}
      <Line
        type="monotone"
        dataKey="valor"
        name="Valor (R$)"
        stroke={colors[0]}
        strokeWidth={3}
        dot={{ fill: colors[1], r: 6 }}
        activeDot={{ r: 8 }}
      />
      {enableZoom && (
        <Brush
          dataKey="universidade"
          height={40}
          stroke="#3B82F6"
          fill="#EFF6FF"
          travellerWidth={10}
          tick={<CustomBrushTick />}
        />
      )}
    </LineChart>
  </ResponsiveContainer>
));

LineChartRenderer.displayName = 'LineChartRenderer';

export const PieChartRenderer = memo(({
  dados,
  colors,
  statistics,
  highlightedIndex,
  onHighlight,
}: ChartRendererProps) => (
  <ResponsiveContainer width="100%" height={500}>
    <PieChart>
      <Pie
        data={dados}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={(entry) => {
          const percent = statistics 
            ? ((entry.valor / statistics.total) * 100).toFixed(1)
            : '0';
          return `${entry.universidade}: ${percent}%`;
        }}
        outerRadius={150}
        dataKey="valor"
        onMouseEnter={(_, index) => onHighlight(index)}
        onMouseLeave={() => onHighlight(null)}
      >
        {dados.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={colors[index % colors.length]}
            opacity={highlightedIndex === null || highlightedIndex === index ? 1 : 0.4}
            stroke="#fff"
            strokeWidth={2}
          />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip statistics={statistics} />} />
      <Legend
        verticalAlign="bottom"
        height={36}
        wrapperStyle={{ paddingTop: "20px" }}
        formatter={(value, entry: any) => entry.payload.universidade}
      />
    </PieChart>
  </ResponsiveContainer>
));

PieChartRenderer.displayName = 'PieChartRenderer';

export const AreaChartRenderer = memo(({
  dados,
  colors,
  statistics,
  showAverage,
  enableZoom,
}: ChartRendererProps) => (
  <ResponsiveContainer width="100%" height={500}>
    <AreaChart
      data={dados}
      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis
        dataKey="universidade"
        angle={-45}
        textAnchor="end"
        height={100}
        tick={{ fontSize: 11 }}
      />
      <YAxis tickFormatter={formatAxisValue} tick={{ fontSize: 12 }} />
      <Tooltip content={<CustomTooltip statistics={statistics} />} />
      <Legend wrapperStyle={{ paddingTop: "20px" }} />
      {showAverage && statistics && (
        <ReferenceLine
          y={statistics.media}
          stroke="#8B5CF6"
          strokeDasharray="5 5"
          strokeWidth={2}
          label={{
            value: `Média: ${formatAxisValue(statistics.media)}`,
            position: "right",
            fill: "#8B5CF6",
            fontSize: 12,
          }}
        />
      )}
      <Area
        type="monotone"
        dataKey="valor"
        name="Valor (R$)"
        stroke={colors[0]}
        strokeWidth={2}
        fill={colors[0]}
        fillOpacity={0.6}
      />
      {enableZoom && (
        <Brush
          dataKey="universidade"
          height={40}
          stroke="#3B82F6"
          fill="#EFF6FF"
          travellerWidth={10}
          tick={<CustomBrushTick />}
        />
      )}
    </AreaChart>
  </ResponsiveContainer>
));

AreaChartRenderer.displayName = 'AreaChartRenderer';