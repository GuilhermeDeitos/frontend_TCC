import { memo, lazy, Suspense, useMemo, startTransition, useState, useRef } from "react";
import type { DadoGrafico, TipoGrafico } from "../../types/consulta";
import type { ChartContextType, PaletteKey } from "../../types/chart";
import { motion, AnimatePresence } from "framer-motion";

// Imports estáticos
import { ChartControls } from "./ChartControls";
import { ChartStatisticsDisplay } from "./ChartStatistics";
import { ChartInsights } from "./ChartInsights";
import { ChartExport } from "../ChartExport"; //  Adicionar import

// Lazy load dos componentes pesados de gráficos
const BarChart = lazy(() => 
  import("./ChartRenderers").then(m => ({ default: m.BarChart }))
);
const LineChart = lazy(() => 
  import("./ChartRenderers").then(m => ({ default: m.LineChart }))
);
const PieChart = lazy(() => 
  import("./ChartRenderers").then(m => ({ default: m.PieChart }))
);
const AreaChart = lazy(() => 
  import("./ChartRenderers").then(m => ({ default: m.AreaChart }))
);
const RadarChart = lazy(() => 
  import("./ChartRenderers").then(m => ({ default: m.RadarChart }))
);
const EvolutionChart = lazy(() => 
  import("./ChartRenderers").then(m => ({ default: m.EvolutionChart }))
);

// Hooks
import { useEvolutionChartData } from "../../hooks/useEvolutionChartData";
import { useChartStatistics } from "../../hooks/useChartStatistics";
import { useChartControls } from "../../hooks/useChartControls";

interface ChartDisplayProps {
  dados: DadoGrafico[];
  tipoGrafico: TipoGrafico;
  chartContext: ChartContextType;
  onUniversidadeSelect?: (universidades: string[]) => void;
  selectedUniversidades?: string[];
}

// Loading spinner
const ChartLoader = memo(() => (
  <div className="flex items-center justify-center p-12">
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 4 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
    </div>
  </div>
));
ChartLoader.displayName = "ChartLoader";

export const ChartDisplay = memo(function ChartDisplay({
  dados,
  tipoGrafico,
  chartContext,
  onUniversidadeSelect,
  selectedUniversidades = [],
}: ChartDisplayProps) {
  
  //  Ref para capturar o container do gráfico
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  // Estado para controlar expansão dos controles
  const [isControlsExpanded, setIsControlsExpanded] = useState(false);
  
  // Hook de controles com ordenação
  const { controls, sortedData, average, updateControl, resetControls } = useChartControls({
    dados,
  });

  // Processar dados de evolução se necessário
  const { evolutionData, availableUniversidades } = useEvolutionChartData(
    dados,
    selectedUniversidades
  );

  // Calcular estatísticas (usando dados ordenados)
  const statistics = useChartStatistics(sortedData);

  // Handler de toggle de universidades (para gráfico de evolução)
  const handleUniversidadeToggle = (universidade: string) => {
    if (!onUniversidadeSelect) return;

    startTransition(() => {
      const isSelected = selectedUniversidades.includes(universidade);

      if (isSelected) {
        onUniversidadeSelect(selectedUniversidades.filter((u) => u !== universidade));
      } else {
        onUniversidadeSelect([...selectedUniversidades, universidade]);
      }
    });
  };

  const handleSelectAll = () => {
    if (!onUniversidadeSelect) return;
    startTransition(() => {
      onUniversidadeSelect(availableUniversidades);
    });
  };

  const handleDeselectAll = () => {
    if (!onUniversidadeSelect) return;
    startTransition(() => {
      onUniversidadeSelect([]);
    });
  };

  // Determinar se deve usar virtualização
  const isEvolutionChart = chartContext === "evolution";
  const chartData = isEvolutionChart ? evolutionData : sortedData;

  // Componente de gráfico baseado no tipo
  const ChartComponent = useMemo(() => {
    if (isEvolutionChart) {
      return EvolutionChart;
    }

    switch (tipoGrafico) {
      case "barras":
        return BarChart;
      case "linhas":
        return LineChart;
      case "pizza":
        return PieChart;
      case "area":
        return AreaChart;
      case "radar":
        return RadarChart;
      default:
        return BarChart;
    }
  }, [tipoGrafico, isEvolutionChart]);

  //  Gerar nome do arquivo baseado no contexto
  const getFileName = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const chartTypeName = tipoGrafico.charAt(0).toUpperCase() + tipoGrafico.slice(1);
    return `grafico_${chartTypeName}_${timestamp}`;
  };

  if (dados.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum dado disponível</h3>
        <p className="mt-1 text-sm text-gray-500">
          Ajuste os filtros ou parâmetros de consulta para visualizar dados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/*  Header com botão de exportação */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Botão para expandir/colapsar controles */}
          <div data-tour="chart-controls-toggle">
            <button
              onClick={() => setIsControlsExpanded(!isControlsExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group cursor-pointer"
            >
              <span className="flex items-center gap-2 font-medium">
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" 
                  />
                </svg>
                {isControlsExpanded ? "Ocultar" : "Mostrar"} Controles de Personalização
              </span>
              
              <div className="flex items-center gap-3">
                {/* Indicadores de configurações ativas */}
                {!isControlsExpanded && (
                  <div className="flex items-center gap-2 text-xs">
                    {controls.selectedPalette !== "default" && (
                      <span className="px-2 py-1 bg-white/20 rounded-md">
                        {controls.selectedPalette}
                      </span>
                    )}
                    {controls.sortOrder !== "original" && (
                      <span className="px-2 py-1 bg-white/20 rounded-md">
                      {controls.sortOrder}
                      </span>
                    )}
                    {controls.showAverage && (
                      <span className="px-2 py-1 bg-white/20 rounded-md">
                        média
                      </span>
                    )}
                  </div>
                )}
                
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: isControlsExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </div>
            </button>
          </div>
        </div>

        {/*  Botão de exportação flutuante */}
        <div className="ml-4" data-tour="chart-export">
          <ChartExport 
            targetRef={chartContainerRef}
            fileName={getFileName()}
          />
        </div>
      </div>

      {/* Controles com abas (colapsável) */}
      <AnimatePresence>
        {isControlsExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            data-tour="chart-controls"
          >
            <ChartControls
              controls={controls}
              onControlChange={updateControl}
              onReset={resetControls}
              isEvolutionChart={isEvolutionChart}
              availableUniversidades={availableUniversidades}
              selectedUniversidades={selectedUniversidades}
              onUniversidadeToggle={handleUniversidadeToggle}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Seletor de Universidades (sempre visível na evolução) */}
      {isEvolutionChart && availableUniversidades.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-600 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">
                Selecionar Universidades para Evolução
              </h3>
              <span className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded-full">
                {selectedUniversidades.length === 0
                  ? 'Todas'
                  : `${selectedUniversidades.length} selecionada${selectedUniversidades.length > 1 ? 's' : ''}`
                }
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                disabled={selectedUniversidades.length === availableUniversidades.length}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedUniversidades.length === availableUniversidades.length
                    ? "bg-purple-600 text-white cursor-default"
                    : "bg-white text-purple-600 hover:bg-purple-100 border border-purple-300 "
                }`}
              >
                Todas
              </button>
              <button
                onClick={handleDeselectAll}
                disabled={selectedUniversidades.length === 0}
                className="px-3 py-1 text-xs font-medium rounded-lg transition-colors bg-white text-gray-600 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Nenhuma
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {availableUniversidades.map((universidade) => {
              const isSelected = selectedUniversidades.length === 0 || selectedUniversidades.includes(universidade);

              return (
                <button
                  key={universidade}
                  onClick={() => handleUniversidadeToggle(universidade)}
                  className={`relative px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  <span className="block truncate">{universidade}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          {selectedUniversidades.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-white border border-purple-200 rounded-lg"
            >
              <p className="text-xs text-gray-600">
                <strong className="text-purple-700">
                  {selectedUniversidades.length}
                </strong>{" "}
                universidade(s) selecionada(s) para visualizar a evolução temporal
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Estatísticas */}
      {controls.showStatistics && (
        <ChartStatisticsDisplay
          statistics={statistics}
        />
      )}

      {/* Insights */}
      {controls.showInsights && (
        <ChartInsights
          statistics={statistics}
        />
      )}

      {/*  Gráfico com ref para exportação */}
      <div 
        ref={chartContainerRef}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
        data-tour="chart-canvas"
      >
        <Suspense fallback={<ChartLoader />}>
          <ChartComponent
            dados={chartData as any}
            chartContext={chartContext}
            palette={controls.selectedPalette as PaletteKey}
            showAverage={controls.showAverage}
            average={average}
            enableAnimations={controls.enableAnimations}
            chartHeight={controls.chartHeight}
            showGrid={controls.showGrid}
            showLegend={controls.showLegend}
            strokeWidth={controls.strokeWidth}
            borderRadius={controls.borderRadius}
          />
        </Suspense>
      </div>

      {/* Info de registros */}
      <div className="text-center text-sm text-gray-600">
        {isEvolutionChart ? (
          <span>
            Exibindo evolução de{" "}
            <strong>
              {selectedUniversidades.length > 0
                ? selectedUniversidades.length
                : availableUniversidades.length}
            </strong>{" "}
            {selectedUniversidades.length === 1 || availableUniversidades.length === 1
              ? "universidade"
              : "universidades"}
          </span>
        ) : (
          <span>
            Exibindo <strong>{sortedData.length}</strong>{" "}
            {sortedData.length === 1 ? "registro" : "registros"}
            {controls.sortOrder !== "original" && (
              <span className="text-blue-600 ml-1">
                (ordenado por {controls.sortBy === "value" ? "valor" : "nome"} -{" "}
                {controls.sortOrder === "asc" ? "crescente" : "decrescente"})
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
});

ChartDisplay.displayName = "ChartDisplay";