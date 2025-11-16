import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterConfig {
  id: string;
  type: string;
  value: string;
}

interface CompactFilterPanelProps {
  filters: FilterConfig[];
  onAddFilter: () => void;
  onRemoveFilter: (id: string) => void;
  onFilterChange: (id: string, field: 'type' | 'value', value: string) => void;
  availableYears: string[];
  availableOptions: Map<string, Array<{ value: string; label: string }>>;
  variant?: 'full' | 'compact';
}

export const CompactFilterPanel = memo(({
  filters,
  onAddFilter,
  onRemoveFilter,
  onFilterChange,
  availableYears,
  availableOptions,
  variant = 'full',
}: CompactFilterPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterTypes = [
    { value: "year", label: "Ano" },
    { value: "universidade", label: "Universidade" },
    { value: "funcao", label: "Função" },
    { value: "grupo_natureza", label: "Grupo Natureza" },
    { value: "origem_recursos", label: "Origem Recursos" },
  ];

  const getOptionsForType = (type: string) => {
    if (type === "year") {
      return availableYears.map(year => ({ value: year, label: year }));
    }
    return availableOptions.get(type) || [];
  };

  const getFilterLabel = (type: string) => {
    return filterTypes.find(f => f.value === type)?.label || type;
  };

  const canAddMore = filters.length < filterTypes.length;
  const activeFiltersCount = filters.filter(f => f.value).length;

  // Versão compacta (para gráficos)
  if (variant === 'compact') {
    return (
      <div className="relative w-full sm:w-auto">
        {/* Botão trigger compacto */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border-2 transition-all w-full sm:w-auto justify-center ${
            activeFiltersCount > 0
              ? "bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100"
              : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
          }`}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="font-medium text-xs sm:text-sm">
            Filtrar Dados
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-1.5 sm:px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </span>
          <motion.svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </button>

        {/* Dropdown expandido */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 sm:left-auto sm:right-auto mt-2 w-full sm:w-[500px] sm:max-w-[90vw] bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 p-3 sm:p-4 overflow-hidden"
            >
              <FilterContent
                filters={filters}
                filterTypes={filterTypes}
                canAddMore={canAddMore}
                activeFiltersCount={activeFiltersCount}
                onAddFilter={onAddFilter}
                onRemoveFilter={onRemoveFilter}
                onFilterChange={onFilterChange}
                getOptionsForType={getOptionsForType}
                getFilterLabel={getFilterLabel}
                onClose={() => setIsExpanded(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
  
  // Versão full (para tabela) - Acordeão
  return (
    <div
      className="bg-white border-2 border-gray-200 rounded-xl mb-4 overflow-hidden"
      data-tour="results-filter-panel"
    >
      {/* Header accordion */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${
            activeFiltersCount > 0 ? 'bg-purple-100' : 'bg-gray-100'
          }`}>
            <svg
              className={`w-5 h-5 transition-colors ${
                activeFiltersCount > 0 ? 'text-purple-600' : 'text-gray-600'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              Filtros Compostos
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-600">
              {activeFiltersCount} {activeFiltersCount === 1 ? 'filtro ativo' : 'filtros ativos'}
            </p>
          </div>
        </div>

        <motion.svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-200">
              <FilterContent
                filters={filters}
                filterTypes={filterTypes}
                canAddMore={canAddMore}
                activeFiltersCount={activeFiltersCount}
                onAddFilter={onAddFilter}
                onRemoveFilter={onRemoveFilter}
                onFilterChange={onFilterChange}
                getOptionsForType={getOptionsForType}
                getFilterLabel={getFilterLabel}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

CompactFilterPanel.displayName = 'CompactFilterPanel';

// Componente interno com o conteúdo dos filtros
interface FilterContentProps {
  filters: FilterConfig[];
  filterTypes: Array<{ value: string; label: string }>;
  canAddMore: boolean;
  activeFiltersCount: number;
  onAddFilter: () => void;
  onRemoveFilter: (id: string) => void;
  onFilterChange: (id: string, field: 'type' | 'value', value: string) => void;
  getOptionsForType: (type: string) => Array<{ value: string; label: string }>;
  getFilterLabel: (type: string) => string;
  onClose?: () => void;
}

const FilterContent = memo(({
  filters,
  filterTypes,
  canAddMore,
  activeFiltersCount,
  onAddFilter,
  onRemoveFilter,
  onFilterChange,
  getOptionsForType,
  getFilterLabel,
  onClose,
}: FilterContentProps) => {
  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Botão Adicionar */}
      {canAddMore && (
        <button
          onClick={onAddFilter}
          className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Adicionar Filtro</span>
          <span className="sm:hidden">Adicionar</span>
        </button>
      )}

      {/* Lista de Filtros */}
      {filters.length === 0 ? (
        <div className="text-center py-4 sm:py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 mt-3">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <p className="text-gray-500 text-xs sm:text-sm font-medium">Nenhum filtro aplicado</p>
          <p className="text-gray-400 text-xs mt-1 hidden sm:block">Adicione filtros para refinar os dados</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3 mt-3 w-full max-w-full">
          <AnimatePresence>
            {filters.map((filter, index) => {
              const options = getOptionsForType(filter.type);
              const usedTypes = filters.map(f => f.type);
              const availableTypes = filterTypes.filter(
                ft => ft.value === filter.type || !usedTypes.includes(ft.value)
              );

              return (
                <motion.div
                  key={filter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="w-full max-w-full overflow-hidden"
                >
                  {/* Layout Mobile (Stacked) */}
                  <div className="sm:hidden w-full bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-2">
                    {/* Linha 1: Badge + Tipo + Remover */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-shrink-0 w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <select
                        value={filter.type}
                        onChange={(e) => {
                          onFilterChange(filter.id, 'type', e.target.value);
                          onFilterChange(filter.id, 'value', '');
                        }}
                        className="flex-1 min-w-0 px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                      >
                        {availableTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => onRemoveFilter(filter.id)}
                        className="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Remover filtro"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Linha 2: Valor */}
                    <div className="w-full">
                      <select
                        value={filter.value}
                        onChange={(e) => onFilterChange(filter.id, 'value', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        disabled={!filter.type}
                      >
                        <option value="">Selecione o valor...</option>
                        {options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Layout Desktop (Horizontal) */}
                  <div className="hidden sm:flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg w-full max-w-full overflow-hidden">
                    {/* Badge de número */}
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>

                    {/* Select de Tipo */}
                    <select
                      value={filter.type}
                      onChange={(e) => {
                        onFilterChange(filter.id, 'type', e.target.value);
                        onFilterChange(filter.id, 'value', '');
                      }}
                      className="flex-1 min-w-0 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                      style={{ maxWidth: '200px' }}
                    >
                      {availableTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>

                    {/* Igual */}
                    <span className="text-purple-600 font-bold flex-shrink-0">=</span>

                    {/* Select de Valor */}
                    <select
                      value={filter.value}
                      onChange={(e) => onFilterChange(filter.id, 'value', e.target.value)}
                      className="flex-1 min-w-0 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                      disabled={!filter.type}
                      style={{ maxWidth: '250px' }}
                    >
                      <option value="">Selecione...</option>
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {/* Botão Remover */}
                    <button
                      onClick={() => onRemoveFilter(filter.id)}
                      className="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Remover filtro"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Chips de filtros ativos */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg w-full max-w-full overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5 max-w-full">
              {filters
                .filter(f => f.value)
                .map((filter) => (
                  <span
                    key={filter.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-purple-300 rounded-full text-xs font-medium text-purple-700"
                  >
                    <span className="font-semibold">{getFilterLabel(filter.type)}</span>
                    <span className="text-purple-400">·</span>
                    <span className="max-w-[80px] sm:max-w-[100px] truncate">{filter.value}</span>
                  </span>
                ))}
            </div>

            <button
              onClick={() => filters.forEach(f => onRemoveFilter(f.id))}
              className="flex-shrink-0 px-2 py-1 text-red-600 hover:bg-red-100 rounded text-xs font-medium flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpar
            </button>
          </div>
        </motion.div>
      )}

      {/* Botão Aplicar (só no compact) */}
      {onClose && activeFiltersCount > 0 && (
        <button
          onClick={onClose}
          className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Aplicar Filtros
        </button>
      )}
    </div>
  );
});

FilterContent.displayName = 'FilterContent';