import { useMemo, useState } from "react";
import { InputField } from "../Input";
import { SelectField } from "../Select";
import { converteNotacaoCientifica } from "../../utils/funcoesAuxiliares";

interface TableProps{
  items: {
    id: number;
    data: string;
    valor: number;
  }[];
  columns: string[];
  itemsPerPage?: number;
}

export function Table({ items, columns, itemsPerPage = 10 }: TableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof typeof items[0]; direction: "ascending" | "descending" } | null>(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState<"all" | "month" | "year">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const requestSort = (key: keyof typeof items[0]) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Ordenação otimizada com useMemo
  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;

    return [...items].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Tratamento especial para datas
      if (sortConfig.key === 'data') {
        const dateA = new Date(aValue as string);
        const dateB = new Date(bValue as string);
        
        if (dateA < dateB) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (dateA > dateB) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      }
      
      // Tratamento para outros tipos
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [items, sortConfig]);

  // Filtro otimizado com useMemo
  const filteredItems = useMemo(() => {
    if (!filterDate || filterType === "all") return sortedItems;

    return sortedItems.filter((item) => {
      const itemDate = item.data.split("/");
      const filterDateList = filterDate.split("-");

      if (filterType === "month") {
        return (
          itemDate[0] === filterDateList[1] &&
          itemDate[1] === filterDateList[0]
        );
      } else if (filterType === "year") {
        return itemDate[1].includes(filterDateList[0]);
      }

      return true;
    });
  }, [sortedItems, filterDate, filterType]);

  // Paginação otimizada com useMemo
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    return { totalPages, startIndex, endIndex, currentItems };
  }, [filteredItems, currentPage, itemsPerPage]);

  const { totalPages, startIndex, endIndex, currentItems } = paginationData;

  const getSortIcon = (columnKey: keyof typeof items[0]) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortConfig.direction === "ascending") {
      return (
        <svg className="w-4 h-4 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    
    return (
      <svg className="w-4 h-4 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };


  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Geração de páginas otimizada com useMemo
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [totalPages, currentPage]);

  const clearFilter = () => {
    setFilterDate("");
    setFilterType("all");
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilterDate: string) => {
    setFilterDate(newFilterDate);
    setCurrentPage(1); // Reset para primeira página
  };

  const handleFilterTypeChange = (newFilterType: "all" | "month" | "year") => {
    setFilterType(newFilterType);
    setFilterDate(""); // Limpa o filtro anterior
    setCurrentPage(1);
  };


  return (
    <div className="w-full">
      {/* Header com filtros */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Dados da Tabela
          </h3>
          <p className="text-sm text-gray-500">
            {filteredItems.length} de {items.length} registros
            {(filterDate || filterType !== "all") && (
              <button
                onClick={clearFilter}
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                (limpar filtros)
              </button>
            )}
          </p>
        </div>
        
        {/* Controles de Filtro */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <SelectField
              id="filter-type"
              value={["all", "month", "year"].includes(filterType) ? filterType : "all"}
              onChange={(e) => handleFilterTypeChange(e.target.value as "all" | "month" | "year")}
              name="filter-type"
              label="Filtrar por"
              options={[
                { value: "all", label: "Todos" },
                { value: "month", label: "Mês/Ano" },
                { value: "year", label: "Ano" }
              ]}
            />
          </div>
          
          {filterType !== "all" && (
            <div className="sm:max-w-xs">
              <InputField
                type={filterType === "month" ? "month" : "number"}
                placeholder={filterType === "month" ? "Selecione mês/ano" : "Digite o ano"}
                id="filter-input"
                name="filter"
                value={filterDate}
                onChange={(e) => handleFilterChange(e.target.value)}
                label={filterType === "month" ? "Mês/Ano" : "Ano"}
              />
            </div>
          )}
        </div>
      </div>

      {/* Container da tabela */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th 
                    key={column} 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    onClick={() => requestSort(index === 0 ? 'data' : 'valor')}
                  >
                    <div className="flex items-center">
                      {column}
                      {getSortIcon(index === 0 ? 'data' : 'valor')}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium">Nenhum registro encontrado</p>
                      <p className="text-sm">
                        {filterDate || filterType !== "all" 
                          ? "Tente ajustar os filtros de data" 
                          : "Nenhum dado disponível"
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="font-medium">{item.data}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 20 })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer da tabela com paginação */}
        {filteredItems.length > 0 && (
          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200">
            {/* Informações de registros - sempre visível */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-500 text-center sm:text-left">
                <span className="block sm:inline">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, filteredItems.length)} de {filteredItems.length} registros
                </span>                
              </div>
              
              {/* Controles de paginação */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Indicador de página em mobile */}
                  <div className="text-sm text-gray-500 sm:hidden">
                    Página {currentPage} de {totalPages}
                  </div>
                  
                  <div className="flex items-center justify-center w-full sm:w-auto">
                    {/* Versão mobile: controles simplificados */}
                    <div className="flex sm:hidden items-center space-x-2">
                      <button
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                        className="p-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Primeira página"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      
                      <span className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md min-w-[3rem] text-center">
                        {currentPage}
                      </span>
                      
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima
                      </button>
                      
                      <button
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Última página"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Versão desktop: controles completos */}
                    <div className="hidden sm:flex items-center space-x-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {pageNumbers.map((page, index) => (
                          <span key={index}>
                            {page === '...' ? (
                              <span className="px-3 py-1 text-sm text-gray-500">...</span>
                            ) : (
                              <button
                                onClick={() => goToPage(page as number)}
                                className={`px-3 py-1 text-sm font-medium rounded-md ${
                                  currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input de navegação rápida apenas em desktop */}
            {totalPages > 5 && (
              <div className="hidden sm:flex items-center justify-center mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500">Ir para página:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        goToPage(page);
                      }
                    }}
                    className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-500">de {totalPages}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}