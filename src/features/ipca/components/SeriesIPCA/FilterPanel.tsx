import type { JSX } from "react";
import type { FilterState, FilterType } from "../../types/series";

interface FilterPanelProps {
  filterState: FilterState;
  onFilterChange: (newState: Partial<FilterState>) => void;
  availableYears: string[];
}

const MESES = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

export function FilterPanel({
  filterState,
  onFilterChange,
  availableYears,
}: FilterPanelProps) {
  const filterTypes: Array<{ value: FilterType; label: string; icon: JSX.Element }> = [
    {
      value: "all",
      label: "Todos os períodos",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
    {
      value: "year",
      label: "Filtrar por ano",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      value: "month",
      label: "Filtrar por mês/ano",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6" data-tour="filter-section">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Filtros de Pesquisa</h3>
      </div>

      {/* Tipo de filtro */}
      <div className="mb-4" data-tour="filter-type">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tipo de filtro
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filterTypes.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => onFilterChange({ type: filter.value, year: "", month: "" })}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                filterState.type === filter.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-blue-300 text-gray-700"
              }`}
            >
              <div className={filterState.type === filter.value ? "text-blue-600" : "text-gray-400"}>
                {filter.icon}
              </div>
              <span className="font-medium text-sm">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filtros específicos */}
      {filterState.type === "year" && (
        <div className="animate-fadeIn">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o ano
          </label>
          <select
            value={filterState.year}
            onChange={(e) => onFilterChange({ year: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os anos</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}

      {filterState.type === "month" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mês
            </label>
            <select
              value={filterState.month}
              onChange={(e) => onFilterChange({ month: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione o mês</option>
              {MESES.map((mes) => (
                <option key={mes.value} value={mes.value}>
                  {mes.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ano
            </label>
            <select
              value={filterState.year}
              onChange={(e) => onFilterChange({ year: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione o ano</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}