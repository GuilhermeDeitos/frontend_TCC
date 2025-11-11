import type { DadoGrafico, TipoGrafico } from "./consulta";

export interface ChartStatistics {
  total: number;
  media: number;
  max: number;
  min: number;
  mediana: number;
  crescimento?: number; // Opcional, só faz sentido para séries temporais
  desvioPadrao: number;
  quantidade: number;
}

export interface ChartControlsState {
  selectedPalette: string;
  showAverage: boolean;
  showStatistics: boolean;
  sortOrder: 'asc' | 'desc' | 'original';
  sortBy: 'name' | 'value';
}

export type ChartContextType = 'comparison' | 'temporal' | 'evolution';

export interface ChartDisplayProps {
  dados: DadoGrafico[];
  tipoGrafico: TipoGrafico;
  showStats?: boolean;
  enableZoom?: boolean;
  chartContext?: ChartContextType; // Para determinar quais estatísticas mostrar
  onUniversidadeSelect?: (universidades: string[]) => void; // Para evolução anual
  selectedUniversidades?: string[]; // Para evolução anual
}