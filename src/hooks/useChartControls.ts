import { useState, useCallback, useMemo } from "react";
import type { ChartControlsState, PaletteKey } from "../types/chart";
import type { DadoGrafico } from "../types/consulta";

interface UseChartControlsProps {
  dados: DadoGrafico[];
}

export function useChartControls({ dados }: UseChartControlsProps) {
  const [controls, setControls] = useState<ChartControlsState>({
    selectedPalette: "default",
    showAverage: false,
    showStatistics: false,
    showInsights: false,
    sortOrder: "original",
    sortBy: "value",
    enableAnimations: true,
  });

  // Aplicar ordenação aos dados
  const sortedData = useMemo(() => {
    if (controls.sortOrder === "original") return dados;

    const sorted = [...dados].sort((a, b) => {
      if (controls.sortBy === "name") {
        return a.universidade.localeCompare(b.universidade);
      }
      return a.valor - b.valor;
    });

    return controls.sortOrder === "desc" ? sorted.reverse() : sorted;
  }, [dados, controls.sortOrder, controls.sortBy]);

  // Calcular média
  const average = useMemo(() => {
    if (!controls.showAverage || dados.length === 0) return null;
    const sum = dados.reduce((acc, item) => acc + item.valor, 0);
    return sum / dados.length;
  }, [dados, controls.showAverage]);

  // Atualizar controle específico
  const updateControl = useCallback(<K extends keyof ChartControlsState>(
    key: K,
    value: ChartControlsState[K]
  ) => {
    setControls((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Resetar controles
  const resetControls = useCallback(() => {
    setControls({
      selectedPalette: "default",
      showAverage: false,
      showStatistics: false,
      showInsights: false,
      sortOrder: "original",
      sortBy: "value",
      enableAnimations: true,
    });
  }, []);

  return {
    controls,
    sortedData,
    average,
    updateControl,
    resetControls,
  };
}