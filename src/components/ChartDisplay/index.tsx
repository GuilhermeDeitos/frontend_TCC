import React, { useMemo } from "react";
import type { TipoGrafico, DadoGrafico } from "../../types/consulta";
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

interface ChartDisplayProps {
  dados: DadoGrafico[];
  tipoGrafico: TipoGrafico;
}

export function ChartDisplay({ dados, tipoGrafico }: ChartDisplayProps) {
  // Usar useMemo para evitar recálculos a cada renderização
  const dadosProcessados = useMemo(() => {
    // Limite mais severo de dados para melhorar performance
    let dadosLimitados = dados;
    
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
  const formatarLabel = (label: string) => {
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
  const formatYAxis = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };

  // Formatar valores no tooltip para mostrar valor completo
  const formatTooltipValue = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };
  
  // Se tivermos limitado os dados, mostrar uma mensagem
  const LimitacaoMensagem = () => {
    if (dadosProcessados.temLimitacao) {
      return (
        <div className="text-center text-sm text-gray-500 mt-2 mb-4">
          Mostrando apenas os {dadosProcessados.dadosLimitados.length} maiores valores de {dadosProcessados.quantidadeOriginal} totais para melhorar o desempenho.
        </div>
      );
    }
    return null;
  };
  
  // Componente especializado para visualização de anos com scroll horizontal
  if (dadosProcessados.visualizacaoAnos && (tipoGrafico === 'barras' || tipoGrafico === 'linhas')) {
    return (
      <div>
        <div className="overflow-x-auto pb-4">
          <div style={{ width: Math.max(800, dadosProcessados.dadosLimitados.length * 60) }}>
            <ResponsiveContainer width="100%" height={400}>
              {tipoGrafico === 'barras' ? (
                <BarChart 
                  data={dadosProcessados.dadosLimitados}
                  margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
                  maxBarSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="universidade" 
                    tickFormatter={(label) => label.replace('Ano ', '')}
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
                  <Tooltip formatter={formatTooltipValue} />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Bar 
                    dataKey="valor" 
                    fill="#8884d8" 
                    name="Valor Total (R$)"
                    animationDuration={300}
                    isAnimationActive={dadosProcessados.dadosLimitados.length <= 20}
                  />
                </BarChart>
              ) : (
                <LineChart 
                  data={dadosProcessados.dadosLimitados}
                  margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="universidade" 
                    tickFormatter={(label) => label.replace('Ano ', '')}
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
                  <Tooltip formatter={formatTooltipValue} />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Line 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#8884d8" 
                    name="Valor Total (R$)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    animationDuration={300}
                    isAnimationActive={dadosProcessados.dadosLimitados.length <= 20}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
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
          <LimitacaoMensagem />
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={dadosProcessados.dadosLimitados}
              margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
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
                tickCount={10}
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
              <Tooltip formatter={formatTooltipValue} />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Bar 
                dataKey="valor" 
                fill="#8884d8" 
                name="Valor Total (R$)"
                animationDuration={300}
                isAnimationActive={dadosProcessados.dadosLimitados.length <= 10}
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      );
    
    case 'linhas':
      return (
        <>
          <LimitacaoMensagem />
          <ResponsiveContainer width="100%" height={400}>
            <LineChart 
              data={dadosProcessados.dadosLimitados}
              margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
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
                tickCount={10}
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
              <Tooltip formatter={formatTooltipValue} />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Line 
                type="monotone" 
                dataKey="valor" 
                stroke="#8884d8" 
                name="Valor Total (R$)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                animationDuration={300}
                isAnimationActive={dadosProcessados.dadosLimitados.length <= 10}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      );
    
    case 'pizza':
      return (
        <>
          <LimitacaoMensagem />
          <ResponsiveContainer width="100%" height={400}>
            <PieChart margin={{ top: 20, right: 80, left: 20, bottom: 20 }}>
              <Pie
                data={dadosProcessados.dadosLimitados}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                  return `${formatarLabel(name)}: ${(percent * 100).toFixed(1)}%`;
                }}
                nameKey="universidade"
                outerRadius={150}
                fill="#8884d8"
                dataKey="valor"
                animationDuration={400}
                isAnimationActive={dadosProcessados.dadosLimitados.length <= 8}
              >
                {dadosProcessados.dadosLimitados.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    name={formatarLabel(entry.universidade)}
                  />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltipValue} />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ fontSize: '12px', paddingLeft: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </>
      );
    
    case 'area':
      return (
        <>
          <LimitacaoMensagem />
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart 
              data={dadosProcessados.dadosLimitados}
              margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
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
                tickCount={10}
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
              <Tooltip formatter={formatTooltipValue} />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Area 
                type="monotone" 
                dataKey="valor" 
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Valor Total (R$)"
                strokeWidth={1.5}
                fillOpacity={0.5}
                animationDuration={300}
                isAnimationActive={dadosProcessados.dadosLimitados.length <= 10}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      );
      
    default:
      return <div>Tipo de gráfico não suportado</div>;
  }
}