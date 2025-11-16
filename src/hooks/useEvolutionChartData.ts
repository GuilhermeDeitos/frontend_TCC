import { useMemo } from "react";
import type { DadoGrafico } from "../types/consulta";

interface UniversidadeEvolutionData {
  universidade: string;
  dados: { ano: string; valor: number }[];
}

export function useEvolutionChartData(
  dados: DadoGrafico[],
  selectedUniversidades: string[]
) {
  // Processar dados de evolução
  const evolutionData = useMemo((): UniversidadeEvolutionData[] => {
    // Agrupar por universidade
    const dadosPorUniversidade = new Map<string, Map<string, number>>();

    dados.forEach((item) => {
      // Extrair universidade e ano do formato "SIGLA (ano)"
      const match = item.universidade.match(/^(.+?)\s*\((\d{4})\)$/);
      if (!match) return;

      const [, universidade, ano] = match;

      if (!dadosPorUniversidade.has(universidade)) {
        dadosPorUniversidade.set(universidade, new Map());
      }

      const dadosAno = dadosPorUniversidade.get(universidade)!;
      const valorAtual = dadosAno.get(ano) || 0;
      dadosAno.set(ano, valorAtual + item.valor);
    });

    // Converter para array de objetos
    const result: UniversidadeEvolutionData[] = [];

    dadosPorUniversidade.forEach((dadosAno, universidade) => {
      // Filtrar se houver seleção
      if (selectedUniversidades.length > 0 && !selectedUniversidades.includes(universidade)) {
        return;
      }

      const dadosOrdenados = Array.from(dadosAno.entries())
        .map(([ano, valor]) => ({
          ano,
          valor: Number(valor.toFixed(2)),
        }))
        .sort((a, b) => parseInt(a.ano) - parseInt(b.ano));

      result.push({
        universidade,
        dados: dadosOrdenados,
      });
    });

    return result.sort((a, b) => a.universidade.localeCompare(b.universidade));
  }, [dados, selectedUniversidades]);

  // Lista de universidades disponíveis
  const availableUniversidades = useMemo(() => {
    const universidades = new Set<string>();

    dados.forEach((item) => {
      const match = item.universidade.match(/^(.+?)\s*\((\d{4})\)$/);
      if (match) {
        universidades.add(match[1]);
      }
    });

    return Array.from(universidades).sort();
  }, [dados]);

  return {
    evolutionData,
    availableUniversidades,
  };
}