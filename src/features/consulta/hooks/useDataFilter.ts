import { useState, useCallback, useMemo } from "react";
import type { DadosConsulta } from "../types/consulta";
import type { FilterConfig } from "../components/CompactFilterPanel";

interface UseDataFiltersProps {
  dados: DadosConsulta[];
  extractUniversityName: (fullName: string) => string;
}

export function useDataFilters({ dados, extractUniversityName }: UseDataFiltersProps) {
  const [filters, setFilters] = useState<FilterConfig[]>([]);

  // Adicionar novo filtro
  const handleAddFilter = useCallback(() => {
    const usedTypes = new Set(filters.map(f => f.type));
    const availableTypes = ["year", "universidade", "funcao", "grupo_natureza", "origem_recursos"];
    const nextType = availableTypes.find(type => !usedTypes.has(type)) || "year";

    const newFilter: FilterConfig = {
      id: `filter-${Date.now()}-${Math.random()}`,
      type: nextType,
      value: "",
    };

    setFilters(prev => [...prev, newFilter]);
  }, [filters]);

  // Remover filtro
  const handleRemoveFilter = useCallback((id: string) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  }, []);

  // Atualizar filtro
  const handleFilterChange = useCallback((id: string, field: 'type' | 'value', value: string) => {
    setFilters(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  }, []);

  // Extrair anos disponíveis
  const availableYears = useMemo(() => {
    const anos = [...new Set(dados.map(item => item.ano.toString()))];
    return anos.sort((a, b) => a.localeCompare(b));
  }, [dados]);

  // Extrair opções disponíveis para cada tipo de filtro
  const availableFilterOptions = useMemo(() => {
    const optionsMap = new Map<string, Array<{ value: string; label: string }>>();
    const fields = ["universidade", "funcao", "grupo_natureza", "origem_recursos"];

    fields.forEach(field => {
      const values = new Set<string>();
      dados.forEach((item) => {
        if (!item.universidade.includes("Total")) {
          const fieldValue = item[field as keyof DadosConsulta];
          if (fieldValue) {
            if (field === "universidade") {
              values.add(extractUniversityName(String(fieldValue)));
            } else {
              values.add(String(fieldValue));
            }
          }
        }
      });

      optionsMap.set(
        field,
        Array.from(values)
          .sort()
          .map((value) => ({ value, label: value }))
      );
    });

    return optionsMap;
  }, [dados, extractUniversityName]);

  // Aplicar filtros
  const filteredData = useMemo(() => {
    const activeFilters = filters.filter(f => f.value);

    if (activeFilters.length === 0) {
      return dados;
    }

    return dados.filter((item) => {
      return activeFilters.every(filter => {
        if (filter.type === "year") {
          return item.ano.toString() === filter.value;
        }

        if (filter.type === "universidade") {
          const universidadeName = extractUniversityName(item.universidade);
          return universidadeName === filter.value;
        }

        const fieldValue = item[filter.type as keyof DadosConsulta];
        return String(fieldValue) === filter.value;
      });
    });
  }, [dados, filters, extractUniversityName]);

  return {
    filters,
    filteredData,
    availableYears,
    availableFilterOptions,
    activeFiltersCount: filters.filter(f => f.value).length,
    handleAddFilter,
    handleRemoveFilter,
    handleFilterChange,
  };
}