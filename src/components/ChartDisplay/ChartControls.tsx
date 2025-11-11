import { memo } from "react";
import { COLOR_PALETTES, PALETTE_LABELS } from "../../constants/colorPalettes";
import { ChartExport } from "../ChartExport";
import type { ChartControlsState, ChartContextType } from "../../types/chart";

interface ChartControlsProps {
  controls: ChartControlsState;
  onControlChange: (key: keyof ChartControlsState, value: any) => void;
  chartRef: React.RefObject<HTMLDivElement | null>;
  fileName: string;
  tipoGrafico: string;
  chartContext: ChartContextType;
}

export const ChartControls = memo(({
  controls,
  onControlChange,
  chartRef,
  fileName,
  tipoGrafico,
  chartContext,
}: ChartControlsProps) => {
  const showSortControls = tipoGrafico === 'barras';
  const showAverageToggle = tipoGrafico !== 'pizza';

  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4" data-tour="chart-controls">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Paleta de cores */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Paleta:</label>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(COLOR_PALETTES).map((palette) => (
              <button
                key={palette}
                onClick={() => onControlChange('selectedPalette', palette)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  controls.selectedPalette === palette
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
                title={PALETTE_LABELS[palette]}
              >
                {PALETTE_LABELS[palette]}
              </button>
            ))}
          </div>
        </div>

        {/* Controles adicionais */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Toggle de estatísticas */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={controls.showStatistics}
              onChange={(e) => onControlChange('showStatistics', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Estatísticas</span>
          </label>

          {/* Toggle de média */}
          {showAverageToggle && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={controls.showAverage}
                onChange={(e) => onControlChange('showAverage', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Mostrar Média</span>
            </label>
          )}

          {/* Controles de ordenação para gráficos de barras */}
          {showSortControls && (
            <>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Ordenar:</label>
                <select
                  value={controls.sortBy}
                  onChange={(e) => onControlChange('sortBy', e.target.value)}
                  className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Nome</option>
                  <option value="value">Valor</option>
                </select>
                <select
                  value={controls.sortOrder}
                  onChange={(e) => onControlChange('sortOrder', e.target.value)}
                  className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="original">Original</option>
                  <option value="asc">Crescente</option>
                  <option value="desc">Decrescente</option>
                </select>
              </div>
            </>
          )}

          <div className="h-6 w-px bg-gray-300"></div>
          <ChartExport targetRef={chartRef} fileName={fileName} />
        </div>
      </div>
    </div>
  );
});

ChartControls.displayName = 'ChartControls';