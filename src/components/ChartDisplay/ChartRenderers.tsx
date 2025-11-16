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

// Renderizador de legenda customizado (evita bugs ao passar mouse)
const CustomLegend = memo(({ payload }: any) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4 px-4">
      {payload.map((entry: any, index: number) => (
        <div
          key={`legend-${index}`}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200"
        >
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs font-medium text-gray-700">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
});
CustomLegend.displayName = "CustomLegend";

// Gráfico de Barras
export const BarChart = memo(function BarChart({ 
  dados, 
  palette = "default",
  showAverage = false,
  average = null,
  enableAnimations = true,
}: ChartRendererProps) {
  const chartData = useMemo(
    () => dados.map((d) => ({ name: d.universidade, valor: d.valor })),
    [dados]
  );

  const colors = COLOR_PALETTES[palette].colors;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 12 }}
        />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
        <Tooltip content={<OptimizedTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
        <Legend content={<CustomLegend />} />
        
        {/* Linha de média */}
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
          radius={[8, 8, 0, 0]}
          animationDuration={enableAnimations ? 500 : 0}
          animationEasing="ease-out"
        >
          {chartData.map((entry, index) => (
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
}: ChartRendererProps) {
  const chartData = useMemo(
    () => dados.map((d) => ({ name: d.universidade, valor: d.valor })),
    [dados]
  );

  const colors = COLOR_PALETTES[palette].colors;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 12 }}
        />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
        <Tooltip content={<OptimizedTooltip />} />
        <Legend content={<CustomLegend />} />
        
        {/* Linha de média */}
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
          strokeWidth={3}
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
}: ChartRendererProps) {
  const chartData = useMemo(
    () => dados.map((d) => ({ name: d.universidade, value: d.valor })),
    [dados]
  );

  const colors = COLOR_PALETTES[palette].colors;

  // Renderizador customizado de label
  const renderLabel = (entry: any) => {
    const percent = entry.percent || 0;
    if (percent < 0.05) return ""; // Ocultar labels muito pequenas
    return `${entry.name}: ${(percent * 100).toFixed(1)}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={450}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          labelLine={{
            stroke: '#666',
            strokeWidth: 1,
          }}
          label={renderLabel}
          outerRadius={130}
          fill="#8884d8"
          dataKey="value"
          animationDuration={enableAnimations ? 500 : 0}
          animationEasing="ease-out"
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<OptimizedTooltip />} />
        <Legend 
          content={<CustomLegend />}
          verticalAlign="bottom"
          height={36}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
});

// Gráfico de Área
export const AreaChart = memo(function AreaChart({ 
  dados,
  palette = "default",
  showAverage = false,
  average = null,
  enableAnimations = true,
}: ChartRendererProps) {
  const chartData = useMemo(
    () => dados.map((d) => ({ name: d.universidade, valor: d.valor })),
    [dados]
  );

  const colors = COLOR_PALETTES[palette].colors;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsAreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <defs>
          <linearGradient id={`colorValor-${palette}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8} />
            <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 12 }}
        />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
        <Tooltip content={<OptimizedTooltip />} />
        <Legend content={<CustomLegend />} />
        
        {/* Linha de média */}
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
          strokeWidth={2}
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

export const RadarChart = memo(function RadarChart({ 
  dados,
  palette = "default",
  enableAnimations = true,
}: ChartRendererProps) {
  const chartData = useMemo(
    () => dados.map((d) => ({ subject: d.universidade, valor: d.valor })),
    [dados]
  );

  const colors = COLOR_PALETTES[palette].colors;

  // Calcular o domínio máximo para melhor visualização
  const maxValue = useMemo(() => {
    const max = Math.max(...dados.map(d => d.valor));
    // Arredondar para cima para o próximo milhão/bilhão
    if (max >= 1_000_000_000) {
      return Math.ceil(max / 1_000_000_000) * 1_000_000_000;
    }
    if (max >= 1_000_000) {
      return Math.ceil(max / 1_000_000) * 1_000_000;
    }
    return Math.ceil(max / 1_000) * 1_000;
  }, [dados]);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <RechartsRadarChart 
        cx="50%" 
        cy="50%" 
        outerRadius="75%" 
        data={chartData}
      >
        {/* Grid polar com mais níveis para melhor leitura */}
        <PolarGrid 
          stroke="#e5e7eb" 
          strokeWidth={1}
          gridType="polygon"
        />
        
        {/* Eixos angulares (labels das universidades) */}
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ 
            fontSize: 11,
            fill: '#374151',
            fontWeight: 500,
          }}
          tickLine={{ stroke: '#9ca3af' }}
        />
        
        {/* Eixo radial (valores) */}
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
        
        {/* Área do radar com gradiente */}
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
        <Legend 
          content={<CustomLegend />}
          verticalAlign="bottom"
          height={36}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
});

// Gráfico de Evolução (múltiplas linhas) OTIMIZADO
interface EvolutionChartProps {
  dados: Array<{
    universidade: string;
    dados: Array<{ ano: string; valor: number }>;
  }>;
  palette?: PaletteKey;
  enableAnimations?: boolean;
}

export const EvolutionChart = memo(function EvolutionChart({ 
  dados,
  palette = "default",
  enableAnimations = true,
}: EvolutionChartProps) {
  // Transformar dados para formato Recharts
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

  // Memoizar configuração de linhas
  const lineConfigs = useMemo(() => {
    return dados.map((uni, index) => ({
      key: uni.universidade,
      dataKey: uni.universidade,
      stroke: colors[index % colors.length],
    }));
  }, [dados, colors]);

  return (
    <ResponsiveContainer width="100%" height={450}>
      <RechartsLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
        <Tooltip content={<OptimizedTooltip />} />
        <Legend content={<CustomLegend />} />

        {lineConfigs.map((config) => (
          <Line
            key={config.key}
            type="monotone"
            dataKey={config.dataKey}
            stroke={config.stroke}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls
            animationDuration={enableAnimations ? 500 : 0}
            animationEasing="ease-out"
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
});