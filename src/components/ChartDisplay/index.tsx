import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Label
} from 'recharts';
import { motion } from "framer-motion";
import { ChartExport } from "../ChartExport";

// Definir tipos
export type TipoGrafico = 'barras' | 'linhas' | 'pizza' | 'area';

export interface DadoGrafico {
  universidade: string;
  valor: number;
  [key: string]: string | number;
}

// Interface para props de rótulos
interface LabelProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  value: number;
}

// Paletas de cores pré-definidas
const COLOR_SCHEMES = {
  default: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'],
  blues: ['#004c6d', '#006083', '#007599', '#008bad', '#00a1c1', '#00b8d3', '#00d0e3'],
  greens: ['#004d40', '#00695c', '#00796b', '#00897b', '#009688', '#26a69a', '#4db6ac'],
  autumn: ['#bf4700', '#cd6200', '#d97a00', '#e59100', '#eea700', '#f6bd00', '#ffd300'],
  pastels: ['#7eb0d5', '#b2e061', '#bd7ebe', '#ffb55a', '#ffee65', '#beb9db', '#fdcce5']
};

interface ChartDisplayProps {
  dados: DadoGrafico[];
  tipoGrafico: TipoGrafico;
}

// Interface para os dados processados
interface DadosProcessados {
  dadosLimitados: DadoGrafico[];
  somaTotal: number;
  quantidadeOriginal: number;
  temLimitacao: boolean;
  visualizacaoAnos: boolean;
}

export function ChartDisplay({ dados, tipoGrafico }: ChartDisplayProps) {
  const chartRef = useRef<HTMLDivElement>(null!);
  const [colorScheme, setColorScheme] = useState<keyof typeof COLOR_SCHEMES>("default");
  const [chartHeight, setChartHeight] = useState<number>(400);
  const [showValues, setShowValues] = useState<boolean>(false);
  
  // Usar useMemo para evitar recálculos a cada renderização
  const dadosProcessados = useMemo<DadosProcessados>(() => {
    // Limite mais severo de dados para melhorar performance
    let dadosLimitados = [...dados];
    
    // Para visualização de anos, não limitar quantidade (usaremos scroll horizontal)
    const visualizacaoAnos = dados.length > 0 && dados[0].universidade.includes('Ano ');
    
    if (!visualizacaoAnos) {
      // Se for gráfico de barras ou linhas, limitar para melhor performance
      if ((tipoGrafico === 'barras' || tipoGrafico === 'linhas') && dados.length > 10) {
        dadosLimitados = [...dados].sort((a, b) => b.valor - a.valor).slice(0, 10);
      }
      // Para gráficos de pizza, que são mais pesados para renderizar, limitar ainda mais
      else if (tipoGrafico === 'pizza' && dados.length > 8) {
        dadosLimitados = [...dados].sort((a, b) => b.valor - a.valor).slice(0, 8);
      }
      // Para outros tipos, usar limite de 15
      else if (dados.length > 15) {
        dadosLimitados = [...dados].sort((a, b) => b.valor - a.valor).slice(0, 15);
      }
    }
    
    // Calcular a soma total para gráficos de pizza (percentual)
    const somaTotal = dadosLimitados.reduce((sum, item) => sum + item.valor, 0);
    
    // Retornar dados processados com informações adicionais
    return {
      dadosLimitados,
      somaTotal,
      quantidadeOriginal: dados.length,
      temLimitacao: !visualizacaoAnos && dados.length > dadosLimitados.length,
      visualizacaoAnos
    };
  }, [dados, tipoGrafico]);
  
  // Formatar label para melhorar exibição
  const formatarLabel = (label: string): string => {
    if (!label) return '';
    
    // Para anos, mostrar como está
    if (label.includes('Ano ')) {
      return label;
    }
    
    // Extrair apenas sigla da universidade para economizar espaço
    if (label.includes('UNIVERSIDADE ESTADUAL')) {
      // Tentar extrair a sigla
      const match = label.match(/(UEL|UEM|UEPG|UENP|UNICENTRO|UNIOESTE|UNESPAR)/i);
      if (match) return match[0].toUpperCase();
    }
    
    // Para valores longos, truncar
    if (label.length > 10) {
      return label.substring(0, 10) + '...';
    }
    
    return label;
  };

  // Formatar valores no eixo Y para notação científica
  const formatYAxis = (value: number): string => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  // Formatar valores no tooltip para mostrar valor completo
  const formatTooltipValue = (value: number): string => {
    return `R$ ${value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };
  
  // Renderização de rótulos de valor para barras
  const renderBarLabel = (props: any): React.ReactElement | null => {
    // x, y, width, value podem ser string | number | undefined
    const { x, y, width = 0, value } = props;
    if (!showValues) return null;
  
    // Garantir que x, y, width e value são números
    const xNum = typeof x === 'number' ? x : Number(x) || 0;
    const yNum = typeof y === 'number' ? y : Number(y) || 0;
    const widthNum = typeof width === 'number' ? width : Number(width) || 0;
    const valueNum = typeof value === 'number' ? value : Number(value) || 0;
  
    return (
      <text 
        x={xNum + widthNum / 2} 
        y={yNum - 5} 
        fill="#333" 
        fontSize={10}
        textAnchor="middle"
      >
        {valueNum.toLocaleString('pt-BR')}
      </text>
    );
  };
  
  // Renderização de rótulos para linhas
  const renderLineLabel = (props: { x?: number | string; y?: number | string; value?: number | string }) => {
    if (!showValues) return null;
    const xNum = typeof props.x === 'number' ? props.x : Number(props.x) || 0;
    const yNum = typeof props.y === 'number' ? props.y : Number(props.y) || 0;
    const valueNum = typeof props.value === 'number' ? props.value : Number(props.value) || 0;
  
    return (
      <text 
        x={xNum} 
        y={yNum - 10} 
        fill="#333" 
        fontSize={10}
        textAnchor="middle"
      >
        {valueNum.toLocaleString('pt-BR')}
      </text>
    );
  };
  
  // Opções de personalização - extraído para fora para melhorar tipagem
  function ChartOptionsComponent() {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
      >
        <h4 className="font-medium text-gray-700 mb-3">Personalização do gráfico</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Esquema de cores */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Esquema de cores:
            </label>
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value as keyof typeof COLOR_SCHEMES)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="default">Padrão</option>
              <option value="blues">Tons de azul</option>
              <option value="greens">Tons de verde</option>
              <option value="autumn">Cores outonais</option>
              <option value="pastels">Tons pastéis</option>
            </select>
          </div>
          
          {/* Altura do gráfico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Altura do gráfico:
            </label>
            <select
              value={chartHeight}
              onChange={(e) => setChartHeight(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={300}>Pequeno (300px)</option>
              <option value={400}>Médio (400px)</option>
              <option value={500}>Grande (500px)</option>
              <option value={600}>Extra grande (600px)</option>
            </select>
          </div>
          
          {/* Mostrar valores */}
          <div className="flex items-center">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={showValues}
                onChange={(e) => setShowValues(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2">Mostrar valores nos gráficos</span>
            </label>
          </div>
          
          {/* Botão de exportação */}
          <div className="flex items-center justify-end">
            <ChartExport 
              targetRef={chartRef} 
              fileName={`grafico_${tipoGrafico}_${new Date().toISOString().slice(0, 10)}`}
            />
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Se tivermos limitado os dados, mostrar uma mensagem
  function LimitacaoMensagem() {
    if (dadosProcessados.temLimitacao) {
      return (
        <div className="text-center text-sm text-gray-500 mt-2 mb-4">
          Mostrando apenas os {dadosProcessados.dadosLimitados.length} maiores valores de {dadosProcessados.quantidadeOriginal} totais para melhorar o desempenho.
        </div>
      );
    }
    return null;
  }

  // Componente especializado para visualização de anos com scroll horizontal
  if (dadosProcessados.visualizacaoAnos && (tipoGrafico === 'barras' || tipoGrafico === 'linhas')) {
    return (
      <div>
        <ChartOptionsComponent />
        <div className="overflow-x-auto pb-4">
          <div style={{ width: Math.max(800, dadosProcessados.dadosLimitados.length * 60) }}>
            <div ref={chartRef}>
              <ResponsiveContainer width="100%" height={chartHeight}>
                {tipoGrafico === 'barras' ? (
                  <BarChart 
                    data={dadosProcessados.dadosLimitados}
                    margin={{ top: 40, right: 30, left: 60, bottom: 40 }}
                    maxBarSize={40}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="universidade" 
                      tickFormatter={(label: string) => label.replace('Ano ', '')}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={formatYAxis}
                      width={50}
                    >
                      <Label 
                        value="Valor (R$)" 
                        position="insideLeft" 
                        angle={-90}
                        style={{ textAnchor: 'middle' }} 
                        dx={-20}
                      />
                    </YAxis>
                    <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar 
                      dataKey="valor" 
                      fill={COLOR_SCHEMES[colorScheme][0]}
                      name="Valor Total (R$)"
                      animationDuration={800}
                      isAnimationActive={true}
                      label={showValues ? renderBarLabel : undefined}
                    />
                  </BarChart>
                ) : (
                  <LineChart 
                    data={dadosProcessados.dadosLimitados}
                    margin={{ top: 40, right: 30, left: 60, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="universidade" 
                      tickFormatter={(label: string) => label.replace('Ano ', '')}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={formatYAxis}
                      width={50}
                    >
                      <Label 
                        value="Valor (R$)" 
                        position="insideLeft" 
                        angle={-90}
                        style={{ textAnchor: 'middle' }} 
                        dx={-20}
                      />
                    </YAxis>
                    <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke={COLOR_SCHEMES[colorScheme][0]}
                      name="Valor Total (R$)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      animationDuration={800}
                      isAnimationActive={true}
                      label={showValues ? renderLineLabel : undefined}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderização para outros tipos de gráficos
  switch (tipoGrafico) {
    case 'barras':
      return (
        <>
          <ChartOptionsComponent />
          <LimitacaoMensagem />
          <div ref={chartRef}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart 
                data={dadosProcessados.dadosLimitados}
                margin={{ top: 40, right: 30, left: 60, bottom: 80 }}
                maxBarSize={60}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="universidade" 
                  tickFormatter={formatarLabel}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 11 }}
                  height={80}
                />
                <YAxis 
                  tickFormatter={formatYAxis}
                  width={50}
                  tickCount={5}
                >
                  <Label 
                    value="Valor (R$)" 
                    position="insideLeft" 
                    angle={-90}
                    style={{ textAnchor: 'middle' }} 
                    dx={-20}
                  />
                </YAxis>
                <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Bar 
                  dataKey="valor" 
                  fill={COLOR_SCHEMES[colorScheme][0]} 
                  name="Valor Total (R$)"
                  animationDuration={800}
                  isAnimationActive={true}
                  label={showValues ? renderBarLabel : undefined}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      );
    
    case 'linhas':
      return (
        <>
          <ChartOptionsComponent />
          <LimitacaoMensagem />
          <div ref={chartRef}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart 
                data={dadosProcessados.dadosLimitados}
                margin={{ top: 40, right: 30, left: 60, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="universidade" 
                  tickFormatter={formatarLabel}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 11 }}
                  height={80}
                />
                <YAxis 
                  tickFormatter={formatYAxis}
                  width={50}
                  tickCount={5}
                >
                  <Label 
                    value="Valor (R$)" 
                    position="insideLeft" 
                    angle={-90}
                    style={{ textAnchor: 'middle' }} 
                    dx={-20}
                  />
                </YAxis>
                <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke={COLOR_SCHEMES[colorScheme][0]}
                  name="Valor Total (R$)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  animationDuration={800}
                  isAnimationActive={true}
                  label={showValues ? renderLineLabel : undefined}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      );
    
    case 'pizza':
      return (
        <>
          <ChartOptionsComponent />
          <LimitacaoMensagem />
          <div ref={chartRef}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart margin={{ top: 20, right: 80, left: 20, bottom: 20 }}>
                <Pie
                  data={dadosProcessados.dadosLimitados}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props) => {
                    // PieLabelRenderProps may have payload with name and percent
                    const name = (props && (props as any).name) || (props && props.payload && (props.payload as DadoGrafico).universidade) || '';
                    const percent = (props && (props as any).percent) || 0;
                    return showValues 
                      ? `${formatarLabel(name)}: ${(percent * 100).toFixed(1)}%` 
                      : formatarLabel(name);
                  }}
                  nameKey="universidade"
                  outerRadius={chartHeight * 0.35}
                  fill="#8884d8"
                  dataKey="valor"
                  animationDuration={800}
                  isAnimationActive={true}
                >
                  {dadosProcessados.dadosLimitados.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLOR_SCHEMES[colorScheme][index % COLOR_SCHEMES[colorScheme].length]} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  formatter={(value: string) => formatarLabel(value)}
                  wrapperStyle={{ fontSize: '12px', paddingLeft: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      );
    
    case 'area':
      return (
        <>
          <ChartOptionsComponent />
          <LimitacaoMensagem />
          <div ref={chartRef}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <AreaChart 
                data={dadosProcessados.dadosLimitados}
                margin={{ top: 40, right: 30, left: 60, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="universidade" 
                  tickFormatter={formatarLabel}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 11 }}
                  height={80}
                />
                <YAxis 
                  tickFormatter={formatYAxis}
                  width={50}
                  tickCount={5}
                >
                  <Label 
                    value="Valor (R$)" 
                    position="insideLeft" 
                    angle={-90}
                    style={{ textAnchor: 'middle' }} 
                    dx={-20}
                  />
                </YAxis>
                <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Area 
                  type="monotone" 
                  dataKey="valor" 
                  stroke={COLOR_SCHEMES[colorScheme][0]}
                  fill={COLOR_SCHEMES[colorScheme][0]}
                  name="Valor Total (R$)"
                  strokeWidth={1.5}
                  fillOpacity={0.5}
                  animationDuration={800}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      );
      
    default:
      return <div>Tipo de gráfico não suportado</div>;
  }
}