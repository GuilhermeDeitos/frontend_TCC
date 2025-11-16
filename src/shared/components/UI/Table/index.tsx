import { memo, useMemo } from "react";
import { VirtualizedTable } from "./VirtualizedTable";
import { TablePagination } from "./TablePagination";
import { useTableState } from "../../../hooks/useTableState";

export interface TableProps {
  items: any[];
  columns: string[];
  keyMap: Record<string, string>;
  itemsPerPage?: number;
  tableType?: string;
  hideFilters?: boolean;
  isCompact?: boolean;
  enableVirtualization?: boolean;
}

/**
 * Converte string no formato brasileiro para número
 * Ex: "R$ 110.119.865,74" -> 110119865.74
 */
const parseValorBrasileiro = (value: any): number | null => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  // Remover símbolo de R$, espaços e underscores
  const cleaned = value
    .replace(/R\$\s*/g, '')
    .replace(/\s/g, '')
    .trim();

  // Se estiver vazio ou for um traço, retornar null
  if (!cleaned || cleaned === '-' || cleaned === '—') {
    return null;
  }

  // Verificar se é um valor numérico brasileiro (com . como separador de milhar e , como decimal)
  // Ex: 110.119.865,74
  if (/^\d{1,3}(\.\d{3})*,\d{2}$/.test(cleaned)) {
    // Remover pontos (separadores de milhar) e trocar vírgula por ponto
    const number = parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
    return isNaN(number) ? null : number;
  }

  // Verificar se é um número simples com vírgula
  // Ex: 1.234,56 ou 1234,56
  if (/^\d+\.?\d*,\d{1,2}$/.test(cleaned)) {
    const number = parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
    return isNaN(number) ? null : number;
  }

  // Tentar como número normal (formato americano ou inteiro)
  const number = parseFloat(cleaned.replace(',', '.'));
  return isNaN(number) ? null : number;
};

/**
 * Determina a classe CSS do badge baseada no valor
 */
const formatCellValue = (value: any): string => {
  const numericValue = parseValorBrasileiro(value);

  // Se não for um número válido, retornar estilo neutro
  if (numericValue === null) {
    return 'bg-gray-100 text-gray-800';
  }

  // Zero - azul
  if (numericValue === 0) {
    return 'bg-blue-100 text-blue-900';
  }

  // Negativo - vermelho
  if (numericValue < 0) {
    return 'bg-red-100 text-red-900';
  }

  // Positivo - verde
  return 'bg-green-100 text-green-900';
};

export const Table = memo(function Table({
  items,
  columns,
  keyMap,
  itemsPerPage = 25,
  isCompact = false,
  enableVirtualization = false,
}: TableProps) {
  
  const {
    paginatedItems,
    currentPage,
    totalPages,
    sortConfig,
    handleSort,
    goToPage,
    nextPage,
    prevPage,
  } = useTableState({
    items,
    itemsPerPage,
    initialSortKey: "ano",
    initialSortDirection: "desc",
  });

  // Determinar se deve usar virtualização
  const shouldVirtualize = useMemo(() => {
    return enableVirtualization && items.length > 100;
  }, [enableVirtualization, items.length]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum dado disponível</h3>
        <p className="mt-1 text-sm text-gray-500">
          Aplique filtros diferentes ou ajuste os parâmetros de consulta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shouldVirtualize ? (
        // Tabela virtualizada para grandes datasets
        <VirtualizedTable
          items={items}
          columns={columns}
          keyMap={keyMap}
          isCompact={isCompact}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      ) : (
        // Tabela padrão com paginação
        <>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column}
                        onClick={() => handleSort(keyMap[column] || column)}
                        className={`
                          px-3 text-left text-xs font-semibold text-white uppercase tracking-wider
                          cursor-pointer hover:bg-blue-700 transition-colors whitespace-nowrap
                          ${isCompact ? "py-2" : "py-3"}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          {column}
                          {sortConfig && sortConfig.key === (keyMap[column] || column) && (
                            <span className="text-white">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedItems.map((item, rowIndex) => {
                    const isEven = rowIndex % 2 === 0;

                    return (
                      <tr
                        key={item.id || rowIndex}
                        className={`
                          ${isEven ? "bg-white" : "bg-gray-50"}
                          hover:bg-blue-50 transition-colors
                        `}
                      >
                        {columns.map((column, colIndex) => {
                          const key = keyMap[column] || column.toLowerCase().replace(/ /g, "_");
                          const value = item[key];

                          return (
                            <td
                              key={column}
                              className={`whitespace-nowrap ${
                                isCompact
                                  ? "px-3 py-2 text-xs"
                                  : "px-6 py-4 text-sm"
                              }`}
                            >
                              {colIndex === 0 ? (
                                // Primeira coluna com indicador visual
                                <div className="flex items-center">
                                  <div
                                    className={`flex-shrink-0 bg-blue-600 rounded-full mr-3 ${
                                      isCompact ? "w-1.5 h-1.5" : "w-2 h-2"
                                    }`}
                                  ></div>
                                  <span className="font-medium text-gray-900">
                                    {value !== null && value !== undefined ? value : "-"}
                                  </span>
                                </div>
                              ) : (
                                // Outras colunas com badge colorido
                                <span
                                  className={`inline-flex items-center rounded-full font-medium ${
                                    isCompact ? "px-2 py-0.5 text-xs" : "px-3 py-1"
                                  } ${formatCellValue(value)}`}
                                >
                                  {value !== null && value !== undefined ? value : "-"}
                                </span>
                              )}
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

          {/* Paginação */}
          {totalPages > 1 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={items.length}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
              onNextPage={nextPage}
              onPrevPage={prevPage}
            />
          )}
        </>
      )}
    </div>
  );
});

Table.displayName = "Table";