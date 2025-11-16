import { memo } from "react";

interface FilterSummaryProps {
  totalRecords: number;
  filteredRecords: number;
  activeFiltersCount: number;
}

export const FilterSummary = memo(({ 
  totalRecords, 
  filteredRecords, 
  activeFiltersCount 
}: FilterSummaryProps) => {
  if (activeFiltersCount === 0) return null;

  const percentageShown = ((filteredRecords / totalRecords) * 100).toFixed(1);
  const isFiltering = filteredRecords < totalRecords;

  return (
    <div className={`p-3 rounded-lg border-2 mb-4 ${
      isFiltering 
        ? 'bg-yellow-50 border-yellow-300' 
        : 'bg-green-50 border-green-300'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className={`w-5 h-5 ${isFiltering ? 'text-yellow-600' : 'text-green-600'}`}
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
          <span className={`text-sm font-medium ${
            isFiltering ? 'text-yellow-800' : 'text-green-800'
          }`}>
            Exibindo {filteredRecords.toLocaleString('pt-BR')} de {totalRecords.toLocaleString('pt-BR')} registros
            ({percentageShown}%)
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isFiltering 
            ? 'bg-yellow-200 text-yellow-800' 
            : 'bg-green-200 text-green-800'
        }`}>
          {activeFiltersCount} {activeFiltersCount === 1 ? 'filtro ativo' : 'filtros ativos'}
        </span>
      </div>
    </div>
  );
});

FilterSummary.displayName = 'FilterSummary';