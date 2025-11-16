import { useMemo } from "react";
import type { DadoGrafico } from "../types/consulta";
import type { ChartStatistics } from "../types/chart";

export function useChartStatistics(dados: DadoGrafico[]): ChartStatistics {
  return useMemo(() => {
    if (dados.length === 0) {
      return {
        total: 0,
        media: 0,
        mediana: 0,
        max: 0,
        min: 0,
        desvioPadrao: 0,
        quantidade: 0,
        crescimento: undefined,
      };
    }

    // Total
    const total = dados.reduce((acc, item) => acc + item.valor, 0);

    // Média
    const media = total / dados.length;

    // Mediana
    const valoresOrdenados = [...dados]
      .map((d) => d.valor)
      .sort((a, b) => a - b);
    
    const meio = Math.floor(valoresOrdenados.length / 2);
    const mediana =
      valoresOrdenados.length % 2 === 0
        ? (valoresOrdenados[meio - 1] + valoresOrdenados[meio]) / 2
        : valoresOrdenados[meio];

    // Máximo
    const max = Math.max(...valoresOrdenados);

    // Mínimo
    const min = Math.min(...valoresOrdenados);

    // Desvio padrão
    const variancia =
      dados.reduce((acc, item) => acc + Math.pow(item.valor - media, 2), 0) / dados.length;
    const desvioPadrao = Math.sqrt(variancia);

    // Crescimento (se aplicável - primeiro vs último)
    let crescimento: number | undefined = undefined;
    if (dados.length >= 2) {
      const primeiro = dados[0].valor;
      const ultimo = dados[dados.length - 1].valor;
      
      if (primeiro !== 0) {
        crescimento = ((ultimo - primeiro) / primeiro) * 100;
      }
    }

    return {
      total: Number(total.toFixed(2)),
      media: Number(media.toFixed(2)),
      mediana: Number(mediana.toFixed(2)),
      max: Number(max.toFixed(2)),
      min: Number(min.toFixed(2)),
      desvioPadrao: Number(desvioPadrao.toFixed(2)),
      quantidade: dados.length,
      crescimento: crescimento !== undefined ? Number(crescimento.toFixed(2)) : undefined,
    };
  }, [dados]);
}