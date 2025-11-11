import type { ChartStatistics } from "../types/chart";
import type { DadoGrafico } from "../types/consulta";

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCompactCurrency = (value: number): string => {
  const absValue = Math.abs(value);
  
  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  
  return value.toFixed(0);
};

export const formatAxisValue = (value: any): string => {
  if (typeof value === "number") {
    return formatCompactCurrency(value);
  }
  return value.length > 15 ? value.substring(0, 15) + "..." : value;
};

export const calculateStatistics = (
  dados: DadoGrafico[],
  calculateGrowth: boolean = false
): ChartStatistics | null => {
  if (!dados.length) return null;

  const valores = dados.map((d) => d.valor);
  const total = valores.reduce((acc, val) => acc + val, 0);
  const media = total / valores.length;
  const max = Math.max(...valores);
  const min = Math.min(...valores);
  const sortedValues = [...valores].sort((a, b) => a - b);
  const mediana = sortedValues[Math.floor(sortedValues.length / 2)];

  // Calcular crescimento apenas se fizer sentido (séries temporais)
  const crescimento = calculateGrowth && valores.length > 1
    ? ((valores[valores.length - 1] - valores[0]) / valores[0]) * 100
    : undefined;

  // Calcular desvio padrão
  const variance = valores.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / valores.length;
  const desvioPadrao = Math.sqrt(variance);

  return {
    total,
    media,
    max,
    min,
    mediana,
    crescimento,
    desvioPadrao,
    quantidade: valores.length,
  };
};

export const sortChartData = (
  dados: DadoGrafico[],
  sortBy: 'name' | 'value',
  sortOrder: 'asc' | 'desc' | 'original'
): DadoGrafico[] => {
  if (sortOrder === 'original') return dados;

  const sorted = [...dados].sort((a, b) => {
    if (sortBy === 'name') {
      return a.universidade.localeCompare(b.universidade);
    } else {
      return a.valor - b.valor;
    }
  });

  return sortOrder === 'desc' ? sorted.reverse() : sorted;
};