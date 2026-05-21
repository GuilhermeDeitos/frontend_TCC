import { memo, useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { VirtualizedTable } from "./VirtualizedTable";
import { TablePagination } from "./TablePagination";

export interface TableProps {
  items: any[];
  columns: any[];
  itemsPerPage?: number;
  tableType?: string;
  hideFilters?: boolean;
  isCompact?: boolean;
  enableVirtualization?: boolean;
  initialSorting?: SortingState; // <--- ADICIONAMOS ISSO AQUI
}

export const Table = memo(function Table({
  items,
  columns,
  itemsPerPage = 25,
  isCompact = false,
  enableVirtualization = false,
  initialSorting = [], //  (Vazio por padrão para não quebrar outras páginas)
}: TableProps) {
  
  // Usamos a prop initialSorting em vez de chumbar "ano"
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: itemsPerPage,
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageSize: itemsPerPage, pageIndex: 0 }));
  }, [itemsPerPage]);

  const table = useReactTable({
    data: items,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const shouldVirtualize = useMemo(() => {
    return enableVirtualization && items.length > 100;
  }, [enableVirtualization, items.length]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum dado disponível</h3>
        <p className="mt-1 text-sm text-gray-500">Aplique filtros diferentes ou ajuste os parâmetros de consulta.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shouldVirtualize ? (
        <VirtualizedTable table={table} isCompact={isCompact} />
      ) : (
        <>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className={`
                            px-3 text-left text-xs font-semibold text-white uppercase tracking-wider
                            ${header.column.getCanSort() ? "cursor-pointer hover:bg-blue-700 transition-colors" : ""}
                            whitespace-nowrap ${isCompact ? "py-2" : "py-3"}
                          `}
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
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row, rowIndex) => (
                    <tr key={row.id} className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}>
                      {row.getVisibleCells().map((cell, colIndex) => (
                        <td key={cell.id} className={`whitespace-nowrap ${isCompact ? "px-3 py-2 text-xs" : "px-6 py-4 text-sm"}`}>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {table.getPageCount() > 1 && (
            <TablePagination
              currentPage={table.getState().pagination.pageIndex + 1}
              totalPages={table.getPageCount()}
              totalItems={table.getPrePaginationRowModel().rows.length}
              itemsPerPage={table.getState().pagination.pageSize}
              onPageChange={(page) => table.setPageIndex(page - 1)}
              onNextPage={() => table.nextPage()}
              onPrevPage={() => table.previousPage()}
            />
          )}
        </>
      )}
    </div>
  );
});

Table.displayName = "Table";