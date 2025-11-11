import { useState, useMemo, useRef, useCallback, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import type { DadoGrafico, TipoGrafico } from "../../types/consulta";
import type { ChartControlsState, ChartContextType } from "../../types/chart";
import { COLOR_PALETTES } from "../../constants/colorPalettes";
import { calculateStatistics, sortChartData } from "../../utils/chartUtils";
import { ChartControls } from "./ChartControls";
import { ChartStatisticsDisplay } from "./ChartStatistics";
import { ChartInsights } from "./ChartInsights";

// Lazy load dos componentes pesados
const UniversitySelector = lazy(() =>
  import("./UniversitySelector").then((m) => ({
    default: m.UniversitySelector,
  }))
);
const BarChartRenderer = lazy(() =>
  import("./ChartRenderers").then((m) => ({ default: m.BarChartRenderer }))
);
const LineChartRenderer = lazy(() =>
  import("./ChartRenderers").then((m) => ({ default: m.LineChartRenderer }))
);
const PieChartRenderer = lazy(() =>
  import("./ChartRenderers").then((m) => ({ default: m.PieChartRenderer }))
);
const AreaChartRenderer = lazy(() =>
  import("./ChartRenderers").then((m) => ({ default: m.AreaChartRenderer }))
);

interface ChartDisplayProps {
  dados: DadoGrafico[];
  tipoGrafico: TipoGrafico;
  showStats?: boolean;
  enableZoom?: boolean;
  chartContext?: ChartContextType;
  onUniversidadeSelect?: (universidades: string[]) => void;
  selectedUniversidades?: string[];
}

// Componente de loading para Suspense
const ChartLoadingFallback = () => (
  <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-600">Carregando gráfico...</p>
    </div>
  </div>
);

export function ChartDisplay({
  dados,
  tipoGrafico,
  showStats = true,
  enableZoom = true,
  chartContext = "comparison",
  onUniversidadeSelect,
  selectedUniversidades = [],
}: ChartDisplayProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const [controls, setControls] = useState<ChartControlsState>({
    selectedPalette: "default",
    showAverage: false,
    showStatistics: showStats,
    sortOrder: "original",
    sortBy: "value",
  });

  // Handler otimizado para mudanças de controle
  const handleControlChange = useCallback(
    (key: keyof ChartControlsState, value: any) => {
      setControls((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Extrair universidades únicas dos dados (para evolução anual)
  const availableUniversities = useMemo(() => {
    if (chartContext !== "evolution") return [];

    const universities = new Set<string>();
    dados.forEach((item) => {
      // Extrair nome da universidade (remover ano se estiver presente)
      const name = item.universidade.split(" (")[0];
      universities.add(name);
    });

    return Array.from(universities);
  }, [dados, chartContext]);

  // Filtrar dados por universidades selecionadas (para evolução anual)
  const filteredData = useMemo(() => {
    if (chartContext !== "evolution" || selectedUniversidades.length === 0) {
      return dados;
    }

    return dados.filter((item) => {
      const universityName = item.universidade.split(" (")[0];
      return selectedUniversidades.includes(universityName);
    });
  }, [dados, chartContext, selectedUniversidades]);

  // Dados processados e ordenados
  const processedData = useMemo(() => {
    return sortChartData(filteredData, controls.sortBy, controls.sortOrder);
  }, [filteredData, controls.sortBy, controls.sortOrder]);

  // Calcular estatísticas (com crescimento apenas para contextos temporais)
  const statistics = useMemo(() => {
    const shouldCalculateGrowth =
      chartContext === "temporal" || chartContext === "evolution";
    return calculateStatistics(processedData, shouldCalculateGrowth);
  }, [processedData, chartContext]);

  // Cores da paleta selecionada
  const colors = useMemo(() => {
    return COLOR_PALETTES[
      controls.selectedPalette as keyof typeof COLOR_PALETTES
    ];
  }, [controls.selectedPalette]);

  // Handler de highlight otimizado
  const handleHighlight = useCallback((index: number | null) => {
    setHighlightedIndex(index);
  }, []);

  // Handler de seleção de universidades
  const handleUniversitySelection = useCallback(
    (universities: string[]) => {
      if (onUniversidadeSelect) {
        onUniversidadeSelect(universities);
      }
    },
    [onUniversidadeSelect]
  );

  // Renderizar gráfico baseado no tipo
  const renderChart = useCallback(() => {
    const commonProps = {
      dados: processedData,
      colors,
      statistics,
      showAverage: controls.showAverage,
      enableZoom,
      highlightedIndex,
      onHighlight: handleHighlight,
    };

    switch (tipoGrafico) {
      case "barras":
        return (
          <Suspense fallback={<ChartLoadingFallback />}>
            <BarChartRenderer {...commonProps} />
          </Suspense>
        );
      case "linhas":
        return (
          <Suspense fallback={<ChartLoadingFallback />}>
            <LineChartRenderer {...commonProps} />
          </Suspense>
        );
      case "pizza":
        return (
          <Suspense fallback={<ChartLoadingFallback />}>
            <PieChartRenderer {...commonProps} />
          </Suspense>
        );
      case "area":
        return (
          <Suspense fallback={<ChartLoadingFallback />}>
            <AreaChartRenderer {...commonProps} />
          </Suspense>
        );
      default:
        return null;
    }
  }, [
    processedData,
    colors,
    statistics,
    controls.showAverage,
    enableZoom,
    highlightedIndex,
    handleHighlight,
    tipoGrafico,
  ]);

  // Estado vazio
  if (!dados || dados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p className="text-gray-500 text-lg font-medium">
          Nenhum dado disponível
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Selecione os filtros apropriados para visualizar os dados
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-tour="chart-display">
      {/* Seletor de Universidades (apenas para evolução anual) */}
      {chartContext === "evolution" && availableUniversities.length > 0 && (
        <Suspense
          fallback={
            <div className="h-32 bg-gray-50 rounded-lg animate-pulse" />
          }
        >
          <div data-tour="university-selector">
            <UniversitySelector
              availableUniversities={availableUniversities}
              selectedUniversidades={selectedUniversidades}
              onSelectionChange={handleUniversitySelection}
            />
          </div>
        </Suspense>
      )}

      {/* Controles */}
      <div data-tour="chart-controls">
        <ChartControls
          controls={controls}
          onControlChange={handleControlChange}
          chartRef={chartRef}
          fileName="grafico-analise"
          tipoGrafico={tipoGrafico}
          chartContext={chartContext}
        />
      </div>

      {/* Estatísticas */}
      <AnimatePresence>
        {controls.showStatistics && statistics && (
          <div data-tour="chart-statistics">
            <ChartStatisticsDisplay
              statistics={statistics}
              chartContext={chartContext}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Gráfico */}
      <div
        ref={chartRef}
        className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm"
        data-tour="chart-canvas"
      >
        {renderChart()}
      </div>

      {/* Insights */}
      {controls.showStatistics && statistics && (
        <ChartInsights statistics={statistics} chartContext={chartContext} />
      )}
    </div>
  );
}
