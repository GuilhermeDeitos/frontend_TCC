import { memo, useState, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLOR_PALETTES, type PaletteKey, type ChartControlsState } from "../../types/chart";

interface ChartControlsProps {
  controls: ChartControlsState;
  onControlChange: <K extends keyof ChartControlsState>(
    key: K,
    value: ChartControlsState[K]
  ) => void;
  onReset: () => void;
  isEvolutionChart?: boolean;
  availableUniversidades?: string[];
  selectedUniversidades?: string[];
  onUniversidadeToggle?: (universidade: string) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
}

type TabType = "visibility" | "style" | "sorting" | "universities";

export const ChartControls = memo(function ChartControls({
  controls,
  onControlChange,
  onReset,
  isEvolutionChart = false,
  availableUniversidades = [],
  selectedUniversidades = [],
  onUniversidadeToggle,
  onSelectAll,
  onDeselectAll,
}: ChartControlsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("visibility");

  const tabs: Array<{ id: TabType; label: string; icon: JSX.Element }> = [
    {
      id: "visibility",
      label: "Visualização",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      id: "style",
      label: "Estilo",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: "sorting",
      label: "Ordenação",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
      ),
    },
  ];

  // Adicionar aba de universidades se for gráfico de evolução
  if (isEvolutionChart && availableUniversidades.length > 0) {
    tabs.push({
      id: "universities",
      label: "Universidades",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    });
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-4">
      {/* Abas */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}

        <button
          onClick={onReset}
          className="ml-auto px-3 py-2 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Resetar configurações"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Conteúdo das abas */}
      <AnimatePresence mode="wait">
        {activeTab === "visibility" && (
          <motion.div
            key="visibility"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Elementos Visíveis</h4>
            
            <ToggleSwitch
              label="Mostrar Estatísticas"
              checked={controls.showStatistics}
              onChange={(checked) => onControlChange("showStatistics", checked)}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />

            <ToggleSwitch
              label="Mostrar Insights"
              checked={controls.showInsights}
              onChange={(checked) => onControlChange("showInsights", checked)}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
            />

            <ToggleSwitch
              label="Mostrar Linha de Média"
              checked={controls.showAverage}
              onChange={(checked) => onControlChange("showAverage", checked)}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              }
            />

            <ToggleSwitch
              label="Ativar Animações"
              checked={controls.enableAnimations}
              onChange={(checked) => onControlChange("enableAnimations", checked)}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </motion.div>
        )}

        {activeTab === "style" && (
          <motion.div
            key="style"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Paleta de Cores</h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(COLOR_PALETTES).map(([key, palette]) => (
                <button
                  key={key}
                  onClick={() => onControlChange("selectedPalette", key as PaletteKey)}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200
                    ${
                      controls.selectedPalette === key
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }
                  `}
                >
                  <p className="text-xs font-medium text-gray-900 mb-2">{palette.name}</p>
                  <div className="flex gap-1">
                    {palette.colors.slice(0, 5).map((color, index) => (
                      <div
                        key={index}
                        className="h-6 flex-1 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "sorting" && (
          <motion.div
            key="sorting"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Ordenar Por</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onControlChange("sortBy", "value")}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      controls.sortBy === "value"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  Valor
                </button>
                <button
                  onClick={() => onControlChange("sortBy", "name")}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      controls.sortBy === "name"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  Nome
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Direção</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onControlChange("sortOrder", "original")}
                  className={`
                    px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1
                    ${
                      controls.sortOrder === "original"
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Original
                </button>
                <button
                  onClick={() => onControlChange("sortOrder", "asc")}
                  className={`
                    px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1
                    ${
                      controls.sortOrder === "asc"
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  Crescente
                </button>
                <button
                  onClick={() => onControlChange("sortOrder", "desc")}
                  className={`
                    px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1
                    ${
                      controls.sortOrder === "desc"
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                  Decrescente
                </button>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Dica:</strong> Use "Original" para manter a ordem dos dados como recebidos,
                "Crescente/Decrescente" para ordenar por {controls.sortBy === "value" ? "valor" : "nome"}.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === "universities" && isEvolutionChart && (
          <motion.div
            key="universities"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900">
                Selecionar Universidades
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={onSelectAll}
                  className="text-xs px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Todas
                </button>
                <button
                  onClick={onDeselectAll}
                  className="text-xs px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Nenhuma
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {availableUniversidades.map((universidade) => {
                const isSelected = selectedUniversidades.includes(universidade);

                return (
                  <button
                    key={universidade}
                    onClick={() => onUniversidadeToggle?.(universidade)}
                    className={`
                      px-3 py-2 rounded-md text-xs font-medium transition-all duration-200
                      ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400"
                      }
                    `}
                  >
                    {universidade}
                  </button>
                );
              })}
            </div>

            {selectedUniversidades.length === 0 && (
              <p className="text-xs text-gray-600 mt-3 text-center p-2 bg-yellow-50 border border-yellow-200 rounded">
                Selecione pelo menos uma universidade para visualizar a evolução
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ChartControls.displayName = "ChartControls";

// Componente auxiliar ToggleSwitch
interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: JSX.Element;
}

const ToggleSwitch = memo(function ToggleSwitch({
  label,
  checked,
  onChange,
  icon,
}: ToggleSwitchProps) {
  return (
    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
      <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
        {icon}
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${checked ? "bg-blue-600" : "bg-gray-300"}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </label>
  );
});

ToggleSwitch.displayName = "ToggleSwitch";