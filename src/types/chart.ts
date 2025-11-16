import type { DadoGrafico, TipoGrafico } from "./consulta";

export interface ChartStatistics {
  total: number;
  media: number;
  max: number;
  min: number;
  mediana: number;
  crescimento?: number;
  desvioPadrao: number;
  quantidade: number;
}

export interface ChartControlsState {
  selectedPalette: string;
  showAverage: boolean;
  showStatistics: boolean;
  showInsights: boolean;
  sortOrder: 'asc' | 'desc' | 'original';
  sortBy: 'name' | 'value';
  enableAnimations: boolean;
  chartHeight: number;
  showGrid: boolean;
  showLegend: boolean;
  strokeWidth: number;
  borderRadius: number;
}

export type ChartContextType = 'comparison' | 'temporal' | 'evolution';

export interface ChartDisplayProps {
  dados: DadoGrafico[];
  tipoGrafico: TipoGrafico;
  showStats?: boolean;
  enableZoom?: boolean;
  chartContext?: ChartContextType;
  onUniversidadeSelect?: (universidades: string[]) => void;
  selectedUniversidades?: string[];
}

// Paletas de cores disponíveis
export const COLOR_PALETTES = {
  default: {
    name: "Padrão",
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#06B6D4", "#84CC16"],
  },
  pastel: {
    name: "Pastel",
    colors: ["#A7C7E7", "#B4E7CE", "#FFD1A4", "#FFB3BA", "#D4B5F7", "#F7C6E0", "#B8E6E6", "#FFCBA4", "#B3E5FC", "#E7F5A7"],
  },
  vibrant: {
    name: "Vibrante",
    colors: ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6BCF7F", "#A8E6CF", "#FF8B94", "#C9A0DC", "#FFA07A", "#98D8C8", "#F7DC6F"],
  },
  ocean: {
    name: "Oceano",
    colors: ["#006994", "#1E88E5", "#42A5F5", "#64B5F6", "#90CAF9", "#03A9F4", "#00BCD4", "#26C6DA", "#4DD0E1", "#80DEEA"],
  },
  earth: {
    name: "Terra",
    colors: ["#8B4513", "#A0522D", "#CD853F", "#DEB887", "#F4A460", "#D2691E", "#BC8F8F", "#F5DEB3", "#FFE4B5", "#FFDEAD"],
  },
  sunset: {
    name: "Por do Sol",
    colors: ["#FF6B35", "#F7931E", "#FDC830", "#F37335", "#FF8C42", "#E74C3C", "#F39C12", "#E67E22", "#D35400", "#FF5733"],
  },
} as const;

export type PaletteKey = keyof typeof COLOR_PALETTES;