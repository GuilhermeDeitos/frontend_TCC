interface TableControlsProps {
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  isCompact: boolean;
  onCompactToggle: () => void;
  totalItems: number;
}

export function TableControls({
  itemsPerPage,
  onItemsPerPageChange,
  isCompact,
  onCompactToggle,
  totalItems,
}: TableControlsProps) {
  const itemsPerPageOptions = [10, 25, 50, 100];

  return (
    <div
      className="flex flex-col gap-3 mb-4 p-3 sm:p-4 bg-gray-50 border-2 border-gray-200 rounded-xl max-w-full overflow-hidden"
      data-tour="table-controls"
    >
      {/* Linha 1: Controles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          {/* Itens por página */}
          <div className="flex items-center gap-2 w-full sm:w-auto" data-tour="items-per-page">
            <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
              Itens/página:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm min-w-0"
            >
              {itemsPerPageOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Separador (apenas desktop) */}
          <div className="hidden sm:block w-px h-6 bg-gray-300"></div>

          {/* Modo compacto */}
          <div className="flex items-center gap-2 w-full sm:w-auto" data-tour="compact-mode">
            <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
              Compacto:
            </label>
            <button
              onClick={onCompactToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0 ${
                isCompact ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={isCompact ? "Desativar modo compacto" : "Ativar modo compacto"}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isCompact ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Info de registros */}
        <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 w-full sm:w-auto">
          <svg
            className="w-4 h-4 text-blue-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="font-medium truncate">
            {totalItems.toLocaleString('pt-BR')} registro(s)
          </span>
        </div>
      </div>
    </div>
  );
}