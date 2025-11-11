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
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl"
      data-tour="table-controls"
    >
      <div className="flex items-center gap-4">
        {/* Itens por página */}
        <div className="flex items-center gap-2" data-tour="items-per-page">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Itens por página:
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {itemsPerPageOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Separador */}
        <div className="hidden sm:block w-px h-6 bg-gray-300"></div>

        {/* Modo compacto */}
        <div className="flex items-center gap-2" data-tour="compact-mode">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Modo compacto:
          </label>
          <button
            onClick={onCompactToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isCompact ? "bg-blue-600" : "bg-gray-300"
            }`}
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
      <div className="text-sm text-gray-600">
        <span className="font-medium">{totalItems}</span> registro(s) no total
      </div>
    </div>
  );
}