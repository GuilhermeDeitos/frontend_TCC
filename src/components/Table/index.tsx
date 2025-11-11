import { useMemo, useState, useCallback, memo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface TableProps {
  items: any[];
  columns: string[];
  itemsPerPage?: number;
  keyMap?: Record<string, string>;
  tableType?: "comparacao" | "geral";
  hideFilters?: boolean;
  isCompact?: boolean;
  enableVirtualization?: boolean; // Nova prop
}

// Componente de linha memoizado para evitar re-renders desnecessários
const TableRow = memo(({ 
  item, 
  columns, 
  getItemValue, 
  formatCellValue, 
  isCompact, 
  index 
}: any) => {
  return (
    <tr
      className={`hover:bg-gray-50 transition-colors ${
        index % 2 === 0 ? "bg-white" : "bg-gray-25"
      }`}
    >
      {columns.map((column: string, colIndex: number) => {
        const cellValue = getItemValue(item, colIndex);

        return (
          <td
            key={colIndex}
            className={`whitespace-nowrap ${
              isCompact
                ? "px-3 py-2 text-xs"
                : "px-6 py-4 text-sm"
            }`}
          >
            {colIndex === 0 ? (
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 bg-blue-600 rounded-full mr-3 ${
                    isCompact ? "w-1.5 h-1.5" : "w-2 h-2"
                  }`}
                ></div>
                <span className="font-medium">
                  {cellValue || "-"}
                </span>
              </div>
            ) : (
              <span
                className={`inline-flex items-center rounded-full font-medium ${
                  isCompact ? "px-2 py-0.5 text-xs" : "px-3 py-1"
                } ${formatCellValue(cellValue)}`}
              >
                {cellValue || "-"}
              </span>
            )}
          </td>
        );
      })}
    </tr>
  );
}, (prevProps, nextProps) => {
  // Comparação customizada para otimizar re-renders
  return (
    prevProps.item === nextProps.item &&
    prevProps.isCompact === nextProps.isCompact &&
    prevProps.index === nextProps.index
  );
});

TableRow.displayName = 'TableRow';

export function Table({
  items,
  columns,
  itemsPerPage = 10,
  keyMap,
  tableType,
  hideFilters = false,
  isCompact = false,
  enableVirtualization = false,
}: TableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Memoizar função de obter valor do item
  const getItemValue = useCallback((item: any, columnIndex: number) => {
    const columnName = columns[columnIndex];

    if (keyMap && keyMap[columnName]) {
      return item[keyMap[columnName]];
    }

    if (columnIndex === 0) {
      return item.universidade || item.data || "";
    } else if (columnIndex === 1) {
      return item.data || item.ano || "";
    } else {
      const keyGuess = columnName
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[()$]/g, "");
      return item[keyGuess] || "";
    }
  }, [columns, keyMap]);

  // Memoizar formatação de células
  const formatCellValue = useCallback((value: string) => {
    if (typeof value === "string" && value.includes("R$")) {
      const numericValue = parseFloat(
        value
          .replace(/[^\d,-]/g, "")
          .replace(/\./g, "")
          .replace(",", ".")
      );
      if (numericValue > 0) {
        return "bg-green-100 text-green-800";
      } else if (numericValue < 0) {
        return "bg-red-100 text-red-800";
      } else {
        return "bg-blue-100 text-blue-800";
      }
    }
    return "bg-gray-100 text-gray-800";
  }, []);

  // Otimizar ordenação com useMemo e algoritmo mais eficiente
  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;

    // Usar Intl.Collator para comparação de strings mais rápida
    const collator = new Intl.Collator('pt-BR', { numeric: true, sensitivity: 'base' });

    return [...items].sort((a, b) => {
      let aValue, bValue;

      if (keyMap && sortConfig.key) {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      } else {
        aValue =
          sortConfig.key === "universidade"
            ? a.universidade
            : sortConfig.key === "data"
            ? a.data
            : a.valor;
        bValue =
          sortConfig.key === "universidade"
            ? b.universidade
            : sortConfig.key === "data"
            ? b.data
            : b.valor;
      }

      // Conversão de valores monetários
      if (typeof aValue === "string" && aValue.includes("R$")) {
        aValue = parseFloat(aValue.replace(/[^\d,-]/g, "").replace(",", "."));
      }
      if (typeof bValue === "string" && bValue.includes("R$")) {
        bValue = parseFloat(bValue.replace(/[^\d,-]/g, "").replace(",", "."));
      }

      // Comparação de datas
      if (
        sortConfig.key === "data" ||
        (typeof aValue === "string" &&
          typeof bValue === "string" &&
          (aValue.includes("/") || bValue.includes("/")))
      ) {
        const partsA = String(aValue).split("/");
        const partsB = String(bValue).split("/");

        if (partsA.length > 1 && partsB.length > 1) {
          const dateA = new Date(parseInt(partsA[1]), parseInt(partsA[0]) - 1);
          const dateB = new Date(parseInt(partsB[1]), parseInt(partsB[0]) - 1);

          const comparison = dateA.getTime() - dateB.getTime();
          return sortConfig.direction === "ascending" ? comparison : -comparison;
        }
      }

      // Comparação numérica
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === "ascending" 
          ? aValue - bValue 
          : bValue - aValue;
      }

      // Comparação de strings
      const comparison = collator.compare(String(aValue), String(bValue));
      return sortConfig.direction === "ascending" ? comparison : -comparison;
    });
  }, [items, sortConfig, keyMap]);

  // Filtro de busca otimizado
  const filteredItems = useMemo(() => {
    if (!searchTerm) return sortedItems;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return sortedItems.filter((item) => {
      return columns.some((_, colIndex) => {
        const value = getItemValue(item, colIndex);
        return String(value).toLowerCase().includes(lowerSearchTerm);
      });
    });
  }, [sortedItems, searchTerm, columns, getItemValue]);

  // Paginação otimizada
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    return { totalPages, startIndex, endIndex, currentItems };
  }, [filteredItems, currentPage, itemsPerPage]);

  const { totalPages, startIndex, endIndex, currentItems } = paginationData;

  // Handler de ordenação otimizado
  const requestSort = useCallback((columnIndex: number) => {
    const columnName = columns[columnIndex];
    const key = keyMap
      ? keyMap[columnName]
      : columnIndex === 0
      ? "universidade"
      : columnIndex === 1
      ? "data"
      : "valor";

    setSortConfig((prevConfig) => {
      let direction: "ascending" | "descending" = "ascending";
      if (prevConfig && prevConfig.key === key && prevConfig.direction === "ascending") {
        direction = "descending";
      }
      return { key, direction };
    });
    setCurrentPage(1);
  }, [columns, keyMap]);

  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }, [totalPages]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }, [currentPage, totalPages]);

  const getSortIcon = useCallback((columnIndex: number) => {
    const columnName = columns[columnIndex];
    const key = keyMap
      ? keyMap[columnName]
      : columnIndex === 0
      ? "universidade"
      : columnIndex === 1
      ? "data"
      : "valor";

    if (!sortConfig || sortConfig.key !== key) {
      return (
        <svg
          className="w-4 h-4 ml-2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    if (sortConfig.direction === "ascending") {
      return (
        <svg
          className="w-4 h-4 ml-2 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      );
    }

    return (
      <svg
        className="w-4 h-4 ml-2 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  }, [columns, keyMap, sortConfig]);

  return (
    <div className="w-full">
      {/* Header com busca */}
      {!hideFilters && (
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
          <span className="text-sm text-gray-500">
            Exibindo {Math.min(filteredItems.length, startIndex + 1)}-
            {Math.min(filteredItems.length, endIndex)} de {filteredItems.length}{" "}
            registros
          </span>

          {/* Campo de busca */}
          <div className="relative w-full sm:w-64" data-tour="table-search">
            <input
              type="text"
              placeholder="Buscar na tabela..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              </button>
            )}
          </div>
        </div>
      )}

      {/* Container da tabela */}
      <div
        className={`bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-200 ${
          isCompact ? "text-sm" : ""
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10" data-tour="table-header">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={column}
                    className={`text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none ${
                      isCompact ? "px-3 py-2" : "px-6 py-4"
                    }`}
                    onClick={() => requestSort(index)}
                  >
                    <div className="flex items-center">
                      {column}
                      {getSortIcon(index)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className="bg-white divide-y divide-gray-200"
              data-tour="table-data"
            >
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-lg font-medium">
                        {searchTerm
                          ? `Nenhum resultado encontrado para "${searchTerm}"`
                          : "Nenhum registro encontrado"}
                      </p>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Limpar busca
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <TableRow
                    key={item.id || index}
                    item={item}
                    columns={columns}
                    getItemValue={getItemValue}
                    formatCellValue={formatCellValue}
                    isCompact={isCompact}
                    index={index}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer da tabela com paginação */}
        <div
          className={`bg-gray-50 border-t border-gray-200 ${
            isCompact ? "px-4 py-2" : "px-6 py-4"
          }`}
          data-tour="pagination"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <p className={`text-gray-700 ${isCompact ? "text-xs" : "text-sm"}`}>
                Página <span className="font-medium">{currentPage}</span> de{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300 rounded-md font-medium transition-colors ${
                  isCompact ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"
                }`}
              >
                Anterior
              </button>

              <div className="hidden md:flex space-x-1">
                {pageNumbers.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === "number" && goToPage(page)}
                    className={`border font-medium rounded-md transition-colors ${
                      isCompact ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"
                    } ${
                      page === currentPage
                        ? "bg-blue-600 text-white border-blue-600"
                        : page === "..."
                        ? "bg-white text-gray-400 cursor-default"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    disabled={page === "..."}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300 rounded-md font-medium transition-colors ${
                  isCompact ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"
                }`}
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}