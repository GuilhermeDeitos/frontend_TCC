import { memo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

interface VirtualizedTableProps {
  items: any[];
  columns: string[];
  keyMap: Record<string, string>;
  isCompact?: boolean;
  onSort?: (key: string) => void;
  sortConfig?: { key: string; direction: "asc" | "desc" } | null;
}

export const VirtualizedTable = memo(function VirtualizedTable({
  items,
  columns,
  keyMap,
  isCompact = false,
  onSort,
  sortConfig,
}: VirtualizedTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Configurar virtualização
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => (isCompact ? 48 : 56), [isCompact]),
    overscan: 10, // Renderizar 10 linhas extras acima/abaixo
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // Handler de ordenação memoizado
  const handleSort = useCallback(
    (column: string) => {
      if (onSort) {
        const key = keyMap[column] || column.toLowerCase().replace(/ /g, "_");
        onSort(key);
      }
    },
    [onSort, keyMap]
  );

  // Ícone de ordenação
  const getSortIcon = useCallback(
    (column: string) => {
      if (!sortConfig) return null;
      const key = keyMap[column] || column.toLowerCase().replace(/ /g, "_");

      if (sortConfig.key !== key) {
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        );
      }

      return sortConfig.direction === "asc" ? (
        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    },
    [sortConfig, keyMap]
  );

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      {/* Cabeçalho fixo */}
      <div className="overflow-x-auto bg-gray-50">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className={`
                    px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider
                    ${isCompact ? "py-2" : "py-3"}
                    ${onSort ? "cursor-pointer hover:bg-blue-700 transition-colors" : ""}
                    whitespace-nowrap
                  `}
                >
                  <div className="flex items-center gap-2">
                    {column}
                    {onSort && getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Corpo virtualizado */}
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ height: "600px" }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {virtualItems.map((virtualRow) => {
                const item = items[virtualRow.index];
                const isEven = virtualRow.index % 2 === 0;

                return (
                  <tr
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    className={`
                      ${isEven ? "bg-white" : "bg-gray-50"}
                      hover:bg-blue-50 transition-colors
                    `}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {columns.map((column) => {
                      const key = keyMap[column] || column.toLowerCase().replace(/ /g, "_");
                      const value = item[key];

                      return (
                        <td
                          key={column}
                          className={`
                            px-3 text-sm text-gray-900 whitespace-nowrap
                            ${isCompact ? "py-2" : "py-3"}
                          `}
                        >
                          {value !== null && value !== undefined ? value : "-"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

VirtualizedTable.displayName = "VirtualizedTable";