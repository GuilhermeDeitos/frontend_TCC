import { useMemo, useState, useEffect } from "react";
import { InputField } from "../Input";
import { SelectField } from "../Select";

// Definir uma interface genérica para itens da tabela
interface TableProps {
  items: any[]; // Itens podem ter qualquer estrutura
  columns: string[]; // Nomes das colunas
  itemsPerPage?: number;
  // Opcionalmente, mapeamento de propriedades para colunas
  keyMap?: Record<string, string>; 
  tableType?: "comparacao" | "geral"; // Tipo de tabela para formatação específica
}

// Tipos de filtro disponíveis
type FilterType = "all" | "month" | "year" | "universidade" | "funcao" | "grupo_natureza" | "origem_recursos";

export function Table({ items, columns, itemsPerPage = 10, keyMap, tableType }: TableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState<{value: string, label: string}[]>([]);
  // Extrair opções únicas para os filtros
  useEffect(() => {
    if (filterType !== "all" && filterType !== "year" && filterType !== "month") {
      const field = filterType;
      const uniqueValues = new Set<string>();
      
      items.forEach(item => {
        // Usar keyMap para obter o valor correto do item
        const fieldKey = keyMap?.[capitalizeFirstLetter(field)] || field;
        const value = item[fieldKey];
        if (value) uniqueValues.add(String(value));
      });
      
      const options = Array.from(uniqueValues)
        .sort()
        .map(value => ({ value, label: value }));
      
      setFilterOptions(options);
    }
  }, [filterType, items, keyMap]);

  // Helper para capitalizar primeira letra (para mapear nomes de campos)
  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Função para obter o valor de uma propriedade do item
  const getItemValue = (item: any, columnIndex: number) => {
    const columnName = columns[columnIndex];
    
    // Se temos um keyMap, usar ele para acessar a propriedade
    if (keyMap && keyMap[columnName]) {
      return item[keyMap[columnName]];
    }

    // Caso contrário, tentar acessar com base no índice
    if (columnIndex === 0) {
      return item.universidade || item.data || '';
    } else if (columnIndex === 1) {
      return item.data || item.ano || '';
    } else {
      // Para outras colunas, tentar um acesso direto ao objeto
      const keyGuess = columnName.toLowerCase().replace(/\s+/g, '_').replace(/[()$]/g, '');
      return item[keyGuess] || '';
    }
  };

  const requestSort = (columnIndex: number) => {
    // Determinar a chave de ordenação
    const columnName = columns[columnIndex];
    const key = keyMap ? keyMap[columnName] : (columnIndex === 0 ? 'universidade' : (columnIndex === 1 ? 'data' : 'valor'));
    
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Ordenação otimizada com useMemo
  const sortedItems = useMemo(() => {
    // ... código existente de ordenação
    if (!sortConfig) return items;

    return [...items].sort((a, b) => {
      let aValue, bValue;
      
      if (keyMap && sortConfig.key) {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      } else {
        // Fallback para comportamento anterior
        aValue = sortConfig.key === 'universidade' ? a.universidade : (sortConfig.key === 'data' ? a.data : a.valor);
        bValue = sortConfig.key === 'universidade' ? b.universidade : (sortConfig.key === 'data' ? b.data : b.valor);
      }
      
      // Tratamento para strings que contêm valores monetários (remover R$, ., etc)
      if (typeof aValue === 'string' && aValue.includes('R$')) {
        aValue = parseFloat(aValue.replace(/[^\d,-]/g, '').replace(',', '.'));
      }
      
      if (typeof bValue === 'string' && bValue.includes('R$')) {
        bValue = parseFloat(bValue.replace(/[^\d,-]/g, '').replace(',', '.'));
      }
      
      // Tratamento especial para datas
      if (sortConfig.key === 'data' || (typeof aValue === 'string' && typeof bValue === 'string' && 
          (aValue.includes('/') || bValue.includes('/')))) {
        // Extrair ano e mês para comparação
        const partsA = String(aValue).split('/');
        const partsB = String(bValue).split('/');
        
        if (partsA.length > 1 && partsB.length > 1) {
          // Formato MM/AAAA
          const dateA = new Date(parseInt(partsA[1]), parseInt(partsA[0]) - 1);
          const dateB = new Date(parseInt(partsB[1]), parseInt(partsB[0]) - 1);
          
          if (dateA < dateB) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (dateA > dateB) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        }
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
  }, [items, sortConfig, keyMap]);

  // Filtro otimizado com useMemo
  const filteredItems = useMemo(() => {
    if (filterType === "all") return sortedItems;

    return sortedItems.filter((item) => {
      // Caso especial para o filtro de ano
      if (filterType === "year") {
        // Primeiro verificamos se há um campo 'ano' diretamente no item
        if (keyMap && keyMap["Ano"]) {
          const anoValue = String(item[keyMap["Ano"]]);
          return anoValue === filterDate;
        }
        
        // Verificar se temos um campo 'ano' diretamente
        if (item.ano !== undefined) {
          return String(item.ano) === filterDate;
        }
      }
      
      // Filtrar por mês/ano
      if (filterType === "month") {
        // Tentar encontrar o campo que contém a data
        let itemDate;
        
        if (keyMap) {
          const dateFieldKey = Object.keys(keyMap).find(k => 
            keyMap[k] === 'data' || k.toLowerCase().includes('período')
          );
          
          if (dateFieldKey && item[keyMap[dateFieldKey]]) {
            itemDate = String(item[keyMap[dateFieldKey]]).split("/");
          }
        }
        
        // Fallback para comportamento padrão
        if (!itemDate && item.data) {
          itemDate = String(item.data).split("/");
        }
        
        if (!itemDate || itemDate.length < 2) return false;
        
        const filterDateList = filterDate.split("-");

        return (
          itemDate[0] === filterDateList[1] &&
          itemDate[1] === filterDateList[0]
        );
      }
      
      // Filtros personalizados para comparação
      if (["universidade", "funcao", "grupo_natureza", "origem_recursos"].includes(filterType)) {
        // Mapear tipo de filtro para o nome da coluna
        const columnName = capitalizeFirstLetter(filterType);
        const fieldKey = keyMap?.[columnName] || filterType;
        
        // Obter o valor a ser comparado
        const itemValue = String(item[fieldKey] || "");
        
        // Comparar com o valor do filtro
        return itemValue === filterText;
      }

      return true;
    });
  }, [sortedItems, filterType, filterDate, filterText, keyMap]);

  // Restante do código permanece igual...
  // Paginação otimizada com useMemo
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    return { totalPages, startIndex, endIndex, currentItems };
  }, [filteredItems, currentPage, itemsPerPage]);

  const { totalPages, startIndex, endIndex, currentItems } = paginationData;

  // Navegar para uma página específica
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Gerar array de números de página para exibição
  const pageNumbers = useMemo(() => {
    // ... código existente
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1, 
      '...', 
      currentPage - 1, 
      currentPage, 
      currentPage + 1,
      '...', 
      totalPages
    ];
  }, [currentPage, totalPages]);

  const formatCellValue = (value: string) => {
    // ... código existente
    if (typeof value === 'string' && value.includes('R$')) {
      const numericValue = parseFloat(
        value
          .replace(/[^\d,-]/g, '') // remove everything except digits, comma, minus
          .replace(/\./g, '')      // remove thousand separators
          .replace(',', '.')       // replace decimal comma with dot
      );
      if (numericValue > 0) {
        return 'bg-green-100 text-green-800'
      } else if (numericValue < 0) {
        return 'bg-red-100 text-red-800'
      } else {
        return 'bg-blue-100 text-blue-800'
      }
    }

    return 'bg-gray-100 text-gray-800';
  };

  // Definir as opções de filtro com base no tipo de tabela
  const options = tableType === "comparacao"
    ? [
        { value: "all", label: "Todos" },
        { value: "year", label: "Filtrar por ano" },
        { value: "universidade", label: "Filtrar por universidade" },
        { value: "funcao", label: "Filtrar por função" },
        { value: "grupo_natureza", label: "Filtrar por grupo natureza" },
        { value: "origem_recursos", label: "Filtrar por origem recursos" },
      ]
    : [
        { value: "all", label: "Todos os períodos" },
        { value: "year", label: "Filtrar por ano" },
        { value: "month", label: "Filtrar por mês/ano" },
      ];

  // Ícone de ordenação
  const getSortIcon = (columnIndex: number) => {
    // ... código existente
    const columnName = columns[columnIndex];
    const key = keyMap ? keyMap[columnName] : (columnIndex === 0 ? 'universidade' : (columnIndex === 1 ? 'data' : 'valor'));
    
    if (!sortConfig || sortConfig.key !== key) {
      return (
        <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortConfig.direction === "ascending") {
      return (
        <svg className="w-4 h-4 ml-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    
    return (
      <svg className="w-4 h-4 ml-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Limpar filtros quando o tipo de filtro muda
  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilterType = e.target.value as FilterType;
    setFilterType(newFilterType);
    setFilterDate("");
    setFilterText("");
    setCurrentPage(1);
  };

  console.log(currentItems)

  return (
    <div className="w-full">
      {/* Header com filtros */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4" data-tour="filter-section">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">
            Exibindo {Math.min(filteredItems.length, startIndex + 1)}-{Math.min(
              filteredItems.length,
              endIndex
            )}{" "}
            de {filteredItems.length} registros
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2" >
                  <div data-tour="filter-type">

          <SelectField
            id="filterType"
            name="filterType"
            value={filterType}
            onChange={handleFilterTypeChange}
            options={options}
            className="w-56"
          />
          </div>

          {filterType === "year" ? (
            <InputField
              id="filterDate"
              name="filterDate"
              type="number"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              disabled={filterType === "all"}
              placeholder="Ano (ex: 2022)"
              className="w-40"
            />
          ) : filterType === "month" ? (
            <InputField
              id="filterDate"
              name="filterDate"
              type="month"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              disabled={filterType === "all"}
              placeholder="Mês/Ano"
              className="w-40"
            />
          ) : filterType !== "all" ? (
            <SelectField
              id="filterText"
              name="filterText"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              options={filterOptions}
              placeholder={`Selecione ${filterType}`}
              className="w-64"
            />
          ) : null}
        </div>
      </div>

      {/* Container da tabela */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* ... resto do código da tabela permanece igual */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50" data-tour="table-header">
              <tr>
                {columns.map((column, index) => (
                  <th 
                    key={column} 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
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
            <tbody className="bg-white divide-y divide-gray-200" data-tour="table-data">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium">Nenhum registro encontrado</p>
                      <p className="text-sm">
                        {(filterDate || filterText || filterType !== "all")
                          ? "Tente ajustar os filtros aplicados" 
                          : "Nenhum dado disponível"
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr 
                    key={item.id || index} 
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}
                  >
                    {columns.map((column, colIndex) => {
                      const cellValue = getItemValue(item, colIndex);
                      
                      return (
                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                          {colIndex === 0 ? (
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                              <span className="font-medium">
                                {cellValue || '-'}
                              </span>
                            </div>
                          ) : (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                              ${formatCellValue(cellValue)}`}
                            >
                              {cellValue || '-'}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer da tabela com paginação */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200" data-tour="pagination">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-gray-700">
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
                } px-3 py-2 border border-gray-300 rounded-md text-sm font-medium`}
              >
                Anterior
              </button>

              <div className="hidden md:flex space-x-1">
                {pageNumbers.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === "number" && goToPage(page)}
                    className={`px-3 py-2 border text-sm font-medium rounded-md ${
                      page === currentPage
                        ? "bg-blue-600 text-white border-blue-600"
                        : page === "..."
                        ? "bg-white text-gray-400 cursor-default"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 "
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
                } px-3 py-2 border border-gray-300 rounded-md text-sm font-medium`}
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