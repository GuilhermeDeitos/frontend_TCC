import { useState, useMemo, useCallback } from "react";
import type { ChartControlsState } from "../types/chart";
import type { DadoGrafico } from "../types/consulta";

interface UseChartControlsProps {
  dados: DadoGrafico[];
}

const DEFAULT_CONTROLS: ChartControlsState = {
  showStatistics: false,
  showInsights: false,
  showAverage: false,
  enableAnimations: true,
  selectedPalette: "default",
  sortBy: "value",
  sortOrder: "original",
  // Novos valores padrão
  chartHeight: 400,
  showGrid: true,
  showLegend: true,
  strokeWidth: 2,
  borderRadius: 8,
};

export function useChartControls({ dados }: UseChartControlsProps) {
  const [controls, setControls] = useState<ChartControlsState>(DEFAULT_CONTROLS);

  const sortedData = useMemo(() => {
    if (controls.sortOrder === "original") {
      return dados;
    }

    const sorted = [...dados];

    if (controls.sortBy === "value") {
      sorted.sort((a, b) => 
        controls.sortOrder === "asc" ? a.valor - b.valor : b.valor - a.valor
      );
    } else {
      sorted.sort((a, b) => {
        const comparison = a.universidade.localeCompare(b.universidade);
        return controls.sortOrder === "asc" ? comparison : -comparison;
      });
    }

    return sorted;
  }, [dados, controls.sortBy, controls.sortOrder]);

  const average = useMemo(() => {
    if (dados.length === 0) return null;
    const sum = dados.reduce((acc, d) => acc + d.valor, 0);
    return sum / dados.length;
  }, [dados]);

  const updateControl = useCallback(
    <K extends keyof ChartControlsState>(key: K, value: ChartControlsState[K]) => {
      setControls((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetControls = useCallback(() => {
    setControls(DEFAULT_CONTROLS);
  }, []);

  return {
    controls,
    sortedData,
    average,
    updateControl,
    resetControls,
  };
}