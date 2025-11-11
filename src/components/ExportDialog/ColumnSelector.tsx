import type { ColumnOption } from "./types";

interface ColumnSelectorProps {
  columns: ColumnOption[];
  onToggleColumn: (columnId: string) => void;
  onSelectAll: () => void;
  onUnselectAll: () => void;
}

export function ColumnSelector({
  columns,
  onToggleColumn,
  onSelectAll,
  onUnselectAll,
}: ColumnSelectorProps) {
  const selectedCount = columns.filter((c) => c.selected).length;

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          Colunas ({selectedCount}/{columns.length})
        </h3>

        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Todas
          </button>
          <button
            onClick={onUnselectAll}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="max-h-[300px] overflow-y-auto border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
        <div className="space-y-2">
          {columns.map((col) => (
            <label
              key={col.id}
              className="flex items-center p-3 rounded-lg hover:bg-white transition-colors cursor-pointer group"
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id={`col-${col.id}`}
                  checked={col.selected}
                  onChange={() => onToggleColumn(col.id)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 transition-all duration-200"
                />
                <svg
                  className="absolute w-4 h-4 text-white pointer-events-none hidden peer-checked:block left-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {col.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}