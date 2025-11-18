import { memo, useMemo } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart as RechartsAreaChart,
  Area,
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { OptimizedTooltip } from "./OptimizedTooltip";
import { COLOR_PALETTES, type PaletteKey } from "../../types/chart";
import type { DadoGrafico } from "../../types/consulta";
import type { ChartContextType } from "../../types/chart";

interface ChartRendererProps {
  dados: DadoGrafico[];
  chartContext: ChartContextType;
  palette?: PaletteKey;
  showAverage?: boolean;
  average?: number | null;
  enableAnimations?: boolean;
  chartHeight?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  strokeWidth?: number;
  borderRadius?: number;
}

// Formatador de valores para eixo Y (memoizado globalmente)
const formatYAxis = (value: number) => {
  if (value >= 1_000_000_000) {
    return `R$ ${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(1)}K`;
  }
  return `R$ ${value}`;
};

// Renderizador de legenda customizado com scroll
const CustomLegend = memo(({ payload, maxHeight }: any) => {
  if (!payload || payload.length === 0) return null;

  const needsScroll = payload.length > 12;

  return (
    <div 
      className="mt-4 px-4"
      style={{
        maxHeight: maxHeight || (needsScroll ? '150px' : 'none'),
        overflowY: needsScroll ? 'auto' : 'visible',
        overflowX: 'hidden',
      }}
    >
      <div className="flex flex-wrap justify-center gap-2">
        {payload.map((entry: any, index: number) => (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
            title={entry.value}
          >
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[10px] sm:text-xs font-medium text-gray-700 truncate max-w-[120px]">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
      
      {needsScroll && (
        <div className="text-center mt-2 text-xs text-gray-500 italic">
          Role para ver mais
        </div>
      )}
    </div>
  );
});
CustomLegend.displayName = "CustomLegend";

// Renderizador de legenda para gráfico de pizza (com grid em vez de wrap)
const PieCustomLegend = memo(({ payload }: any) => {
  if (!payload || payload.length === 0) return null;

  const itemCount = payload.length;
  const needsScroll = itemCount > 16;

  return (
    <div 
      className="mt-3 px-2 sm:px-4"
      style={{
        maxHeight: needsScroll ? '180px' : 'none',
        overflowY: needsScroll ? 'auto' : 'visible',
        overflowX: 'hidden',
      }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-2">
        {payload.map((entry: any, index: number) => (
          <div
            key={`pie-legend-${index}`}
            className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors min-w-0"
            title={entry.value}
          >
            <div
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[9px] sm:text-[10px] font-medium text-gray-700 truncate">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
      
      {needsScroll && (
        <div className="text-center mt-2 text-[10px] sm:text-xs text-gray-500 italic sticky bottom-0 bg-white/95 py-1">
          Role para ver mais itens
        </div>
      )}
    </div>
  );
});
PieCustomLegend.displayName = "PieCustomLegend";

// Gráfico de Barras
export const BarChart = memo(function BarChart({ 
  dados, 
  palette = "default",
  showAverage = false,
  average = null,
  enableAnimations = true,
  chartHeight = 400,
  showGrid = true,
  showLegend = true,
  borderRadius = 8,
}: ChartRendererProps) {
  const chartData = useMemo(
    () => dados.map((d) => ({ name: d.universidade, valor: d.valor })),
    [dados]
  );

  const colors = COLOR_PALETTES[palette].colors;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 12 }}
        />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
        <Tooltip content={<OptimizedTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
        {showLegend && <Legend content={<CustomLegend />} />}
        
        {showAverage && average !== null && (
          <ReferenceLine
            y={average}
            stroke="#F59E0B"
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{
              value: `Média: ${formatYAxis(average)}`,
              position: "insideTopRight",
              fill: "#F59E0B",
              fontSize: 12,
              fontWeight: "bold",
            }}
          />
        )}
        
        <Bar 
          dataKey="valor" 
          fill={colors[0]}
          name="Valor (R$)" 
          radius={[borderRadius, borderRadius, 0, 0]}
          animationDuration={enableAnimations ? 500 : 0}
          animationEasing="ease-out"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
});

// Gráfico de Linha
export const LineChart = memo(function LineChart({ 
  dados,
  palette = "default",
  showAverage = false,
  average = null,
  enableAnimations = true,
  chartHeight = 400,
  showGrid = true,
  showLegend = true,
  strokeWidth = 2,
}: ChartRendererProps) {
  const chartData = useMemo(
    () => dados.map((d) => ({ name: d.universidade, valor: d.valor })),
    [dados]
  );

  const colors = COLOR_PALETTES[palette].colors;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <RechartsLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 12 }}
        />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
        <Tooltip content={<OptimizedTooltip />} />
        {showLegend && <Legend content={<CustomLegend />} />}
        
        {showAverage && average !== null && (
          <ReferenceLine
            y={average}
            stroke="#F59E0B"
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{
              value: `Média: ${formatYAxis(average)}`,
              position: "insideTopRight",
              fill: "#F59E0B",
              fontSize: 12,
              fontWeight: "bold",
            }}
          />
        )}
        
        <Line
          type="monotone"
          dataKey="valor"
          stroke={colors[0]}
          strokeWidth={strokeWidth}
          name="Valor (R$)"
          dot={{ fill: colors[0], r: 5 }}
          activeDot={{ r: 8 }}
          animationDuration={enableAnimations ? 500 : 0}
          animationEasing="ease-out"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
});

// Gráfico de Pizza
export const PieChart = memo(function PieChart({ 
  dados,
  palette = "default",
  enableAnimations = true,
  chartHeight = 400,
  showLegend = true,
}: ChartRendererProps) {
  const chartData = useMemo(
    () => dados.map((d) => ({ name: d.universidade, value: d.valor })),
    [dados]
  );

  const colors = COLOR_PALETTES[palette].colors;
  const itemCount = dados.length;

  const adjustedHeight = useMemo(() => {
    if (itemCount <= 8) return Math.max(chartHeight, 450);
    if (itemCount <= 16) return Math.max(chartHeight, 550);
    return Math.max(chartHeight, 650);
  }, [itemCount, chartHeight]);

  const outerRadius = useMemo(() => {
    if (itemCount <= 8) return 130;
    if (itemCount <= 16) return 110;
    return 90;
  }, [itemCount]);

  const renderLabel = (entry: any) => {
    const percent = entry.percent || 0;
    const threshold = itemCount > 16 ? 0.03 : 0.05;
    if (percent < threshold) return "";
    return `${(percent * 100).toFixed(1)}%`;
  };

  return (
    <div className="w-full" style={{ height: adjustedHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy={itemCount > 8 ? "40%" : "45%"}
            labelLine={itemCount <= 16 ? {
              stroke: '#666',
              strokeWidth: 1,
            } : false}
            label={itemCount <= 16 ? renderLabel : false}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey="value"
            animationDuration={enableAnimations ? 500 : 0}
            animationEasing="ease-out"
          >
            {chartData.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<OptimizedTooltip />} />
          {showLegend && (
            <Legend 
              content={<PieCustomLegend />}
              verticalAlign="bottom"
              wrapperStyle={{
                paddingTop: itemCount > 8 ? '10px' : '20px',
              }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
});

// Gráfico de Área
export const AreaChart = memo(function AreaChart({ 
  dados,
  palette = "default",
  showAverage = false,
  average = null,
  enableAnimations = true,
  chartHeight = 400,
  showGrid = true,
  showLegend = true,
  strokeWidth = 2,
}: ChartRendererProps) {
  const chartData = useMemo(
    () => dados.map((d) => ({ name: d.universidade, valor: d.valor })),
    [dados]
  );

  const colors = COLOR_PALETTES[palette].colors;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <RechartsAreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <defs>
          <linearGradient id={`colorValor-${palette}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8} />
            <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 12 }}
        />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
        <Tooltip content={<OptimizedTooltip />} />
        {showLegend && <Legend content={<CustomLegend />} />}
        
        {showAverage && average !== null && (
          <ReferenceLine
            y={average}
            stroke="#F59E0B"
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{
              value: `Média: ${formatYAxis(average)}`,
              position: "insideTopRight",
              fill: "#F59E0B",
              fontSize: 12,
              fontWeight: "bold",
            }}
          />
        )}
        
        <Area
          type="monotone"
          dataKey="valor"
          stroke={colors[0]}
          strokeWidth={strokeWidth}
          fillOpacity={1}
          fill={`url(#colorValor-${palette})`}
          name="Valor (R$)"
          animationDuration={enableAnimations ? 500 : 0}
          animationEasing="ease-out"
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
});

// Gráfico de Radar
export const RadarChart = memo(function RadarChart({ 
  dados,
  palette = "default",
  enableAnimations = true,
  chartHeight = 500,
  showLegend = true,
}: ChartRendererProps) {
  const chartData = useMemo(
    () => dados.map((d) => ({ subject: d.universidade, valor: d.valor })),
    [dados]
  );

  const colors = COLOR_PALETTES[palette].colors;

  const maxValue = useMemo(() => {
    const max = Math.max(...dados.map(d => d.valor));
    if (max >= 1_000_000_000) {
      return Math.ceil(max / 1_000_000_000) * 1_000_000_000;
    }
    if (max >= 1_000_000) {
      return Math.ceil(max / 1_000_000) * 1_000_000;
    }
    return Math.ceil(max / 1_000) * 1_000;
  }, [dados]);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <RechartsRadarChart 
        cx="50%" 
        cy="50%" 
        outerRadius="75%" 
        data={chartData}
      >
        <PolarGrid 
          stroke="#e5e7eb" 
          strokeWidth={1}
          gridType="polygon"
        />
        
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ 
            fontSize: 11,
            fill: '#374151',
            fontWeight: 500,
          }}
          tickLine={{ stroke: '#9ca3af' }}
        />
        
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, maxValue]}
          tickFormatter={formatYAxis}
          tick={{ 
            fontSize: 10,
            fill: '#6b7280',
          }}
          axisLine={{ stroke: '#9ca3af' }}
        />
        
        <defs>
          <linearGradient id={`radarGradient-${palette}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8} />
            <stop offset="95%" stopColor={colors[0]} stopOpacity={0.2} />
          </linearGradient>
        </defs>
        
        <Radar
          name="Valor (R$)"
          dataKey="valor"
          stroke={colors[0]}
          strokeWidth={2}
          fill={`url(#radarGradient-${palette})`}
          fillOpacity={0.6}
          animationDuration={enableAnimations ? 800 : 0}
          animationEasing="ease-out"
          dot={{
            r: 5,
            fill: colors[0],
            stroke: '#fff',
            strokeWidth: 2,
          }}
          activeDot={{
            r: 7,
            fill: colors[1] || colors[0],
            stroke: '#fff',
            strokeWidth: 2,
          }}
        />
        
        <Tooltip content={<OptimizedTooltip />} />
        {showLegend && (
          <Legend 
            content={<CustomLegend />}
            verticalAlign="bottom"
            height={36}
          />
        )}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
});

// Gráfico de Evolução (múltiplas linhas)
interface EvolutionChartProps {
  dados: Array<{
    universidade: string;
    dados: Array<{ ano: string; valor: number }>;
  }>;
  palette?: PaletteKey;
  enableAnimations?: boolean;
  chartHeight?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  strokeWidth?: number;
}

export const EvolutionChart = memo(function EvolutionChart({ 
  dados,
  palette = "default",
  enableAnimations = true,
  chartHeight = 450,
  showGrid = true,
  showLegend = true,
  strokeWidth = 2,
}: EvolutionChartProps) {
  const chartData = useMemo(() => {
    if (dados.length === 0) return [];

    const anosSet = new Set<string>();
    dados.forEach((uni) => {
      uni.dados.forEach((d) => anosSet.add(d.ano));
    });

    const anos = Array.from(anosSet).sort();

    return anos.map((ano) => {
      const ponto: any = { ano };

      dados.forEach((uni) => {
        const dadoAno = uni.dados.find((d) => d.ano === ano);
        ponto[uni.universidade] = dadoAno ? dadoAno.valor : null;
      });

      return ponto;
    });
  }, [dados]);

  const colors = COLOR_PALETTES[palette].colors;
  const lineCount = dados.length;

  const adjustedHeight = lineCount > 5 ? Math.max(chartHeight, 550) : chartHeight;

  const lineConfigs = useMemo(() => {
    return dados.map((uni, index) => ({
      key: uni.universidade,
      dataKey: uni.universidade,
      stroke: colors[index % colors.length],
    }));
  }, [dados, colors]);

  return (
    <div className="w-full" style={{ height: adjustedHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
          <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
          <Tooltip content={<OptimizedTooltip />} />
          {showLegend && (
            <Legend 
              content={(props) => <CustomLegend {...props} maxHeight="120px" />}
              verticalAlign="bottom"
            />
          )}

          {lineConfigs.map((config) => (
            <Line
              key={config.key}
              type="monotone"
              dataKey={config.dataKey}
              stroke={config.stroke}
              strokeWidth={strokeWidth}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls
              animationDuration={enableAnimations ? 500 : 0}
              animationEasing="ease-out"
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
});