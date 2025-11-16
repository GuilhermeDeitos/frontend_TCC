import { useState, useMemo, useCallback } from "react";

interface UseTableStateProps<T> {
  items: T[];
  itemsPerPage: number;
  initialSortKey?: string;
  initialSortDirection?: "asc" | "desc";
}

export function useTableState<T extends Record<string, any>>({
  items,
  itemsPerPage,
  initialSortKey,
  initialSortDirection = "asc",
}: UseTableStateProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(
    initialSortKey ? { key: initialSortKey, direction: initialSortDirection } : null
  );

  // Ordenar dados
  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;

    const sorted = [...items].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Valores nulos/indefinidos vão para o final
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Comparação de strings (remover formatação monetária)
      if (typeof aValue === "string" && typeof bValue === "string") {
        const aNum = parseFloat(aValue.replace(/[R$\s.,]/g, ""));
        const bNum = parseFloat(bValue.replace(/[R$\s.,]/g, ""));

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Comparação de números
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [items, sortConfig]);

  // Paginar dados
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedItems.slice(startIndex, endIndex);
  }, [sortedItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  // Handler de ordenação
  const handleSort = useCallback((key: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }

      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }

      return null; // Remove ordenação
    });

    // Reset página ao ordenar
    setCurrentPage(1);
  }, []);

  // Navegação de página
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  return {
    // Dados processados
    sortedItems,
    paginatedItems,
    
    // Estado
    currentPage,
    totalPages,
    sortConfig,
    
    // Handlers
    handleSort,
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage,
  };
}