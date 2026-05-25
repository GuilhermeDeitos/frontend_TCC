import { memo, useCallback, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { flexRender, type Table } from "@tanstack/react-table";

interface VirtualizedTableProps {
  table: Table<any>;
  isCompact?: boolean;
}

export const VirtualizedTable = memo(function VirtualizedTable({
  table,
  isCompact = false,
}: VirtualizedTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => (isCompact ? 48 : 56), [isCompact]),
    overscan: 10,
  });

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <div className="overflow-x-auto bg-gray-50">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider ${isCompact ? "py-2" : "py-3"} ${header.column.getCanSort() ? "cursor-pointer hover:bg-blue-700 transition-colors" : ""} whitespace-nowrap`}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" ? " ↑" : header.column.getIsSorted() === "desc" ? " ↓" : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        </table>
      </div>

      <div ref={parentRef} className="overflow-auto" style={{ height: "600px" }}>
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}>
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                const isEven = virtualRow.index % 2 === 0;

                return (
                  <tr
                    key={row.id}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    className={`${isEven ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${virtualRow.start}px)` }}
                  >
                    {row.getVisibleCells().map((cell, colIndex) => (
                      <td key={cell.id} className={`px-3 text-sm text-gray-900 whitespace-nowrap ${isCompact ? "py-2" : "py-3"}`}>
                        {colIndex === 0 ? (
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 bg-blue-600 rounded-full mr-3 ${isCompact ? "w-1.5 h-1.5" : "w-2 h-2"}`}></div>
                            <span className="font-medium text-gray-900">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </span>
                          </div>
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </td>
                    ))}
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