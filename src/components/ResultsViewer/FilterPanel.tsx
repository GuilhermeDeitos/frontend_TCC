interface FilterPanelProps {
  filterType: string;
  filterValue: string;
  onFilterTypeChange: (type: string) => void;
  onFilterValueChange: (value: string) => void;
  filterOptions: Array<{ value: string; label: string }>;
  availableYears: string[];
  tableType?: "comparacao" | "geral";
}

export function ResultsFilterPanel({
  filterType,
  filterValue,
  onFilterTypeChange,
  onFilterValueChange,
  filterOptions,
  availableYears,
}: FilterPanelProps) {
  const filterTypes = [
    { value: "all", label: "Sem filtro"},
    { value: "year", label: "Por ano" },
    { value: "universidade", label: "Por universidade"},
    { value: "funcao", label: "Por função"},
    { value: "grupo_natureza", label: "Por grupo natureza" },
    { value: "origem_recursos", label: "Por origem recursos" },
  ];

  const currentFilter = filterTypes.find((f) => f.value === filterType);

  return (
    <div
      className="bg-white border-2 border-gray-200 rounded-xl p-5 mb-4"
      data-tour="results-filter-panel"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-purple-100 p-2 rounded-lg">
          <svg
            className="w-5 h-5 text-purple-600"
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
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Filtros de Dados
          </h3>
          <p className="text-xs text-gray-600">
            Refine os resultados da consulta
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de filtro */}
        <div data-tour="results-filter-type">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de filtro
          </label>
            
            <select
              value={filterType}
              onChange={(e) => {
                onFilterTypeChange(e.target.value);
                onFilterValueChange("");
              }}
              className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
            >
              {filterTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
        </div>

        {/* Valor do filtro */}
        {filterType !== "all" && (
          <div data-tour="results-filter-value">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {filterType === "year" ? "Selecione o ano" : "Selecione o valor"}
            </label>
            <select
              value={filterValue}
              onChange={(e) => onFilterValueChange(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">
                {filterType === "year" ? "Todos os anos" : "Todos"}
              </option>
              {filterType === "year"
                ? availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))
                : filterOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
            </select>
          </div>
        )}
      </div>

      {filterType !== "all" && filterValue && (
        <div className="mt-3 flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-purple-700">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Filtrando por: <strong>{currentFilter?.label}</strong> ={" "}
              <strong>{filterValue}</strong>
            </span>
          </div>
          <button
            onClick={() => {
              onFilterTypeChange("all");
              onFilterValueChange("");
            }}
            className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Limpar
          </button>
        </div>
      )}
    </div>
  );
}