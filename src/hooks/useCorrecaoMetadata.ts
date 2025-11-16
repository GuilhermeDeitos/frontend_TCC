import { useMemo } from "react";
import type { DadosConsulta } from "../types/consulta";

interface FatorCorrecaoAno {
  ano: number;
  fator_correcao: number;
  ipca_periodo?: number;
  ipca_referencia?: number;
  periodo_referencia?: string;
  tipo_correcao?: string;
}

interface InfoCorrecaoBasica {
  periodo_referencia: string;
  tipo_correcao: string;
  total_anos: number;
}

export function useCorrecaoMetadata(dados: DadosConsulta[]) {
  
  // Extrair fatores de correção por ano (otimizado)
  const fatoresCorrecaoPorAno = useMemo((): FatorCorrecaoAno[] => {
    if (!dados.length) return [];

    // Usar Map para agrupamento mais eficiente
    const dadosPorAno = new Map<number, DadosConsulta>();

    dados.forEach((item) => {
      if (!item.universidade.includes("Total")) {
        const ano = item.ano;
        // Guardar apenas o primeiro registro de cada ano
        if (!dadosPorAno.has(ano)) {
          dadosPorAno.set(ano, item);
        }
      }
    });

    const fatores: FatorCorrecaoAno[] = [];

    dadosPorAno.forEach((registroReferencia, ano) => {
      const correcaoAplicada =
        registroReferencia._correcao_aplicada ||
        registroReferencia.correcao_aplicada;

      if (correcaoAplicada) {
        fatores.push({
          ano,
          fator_correcao: correcaoAplicada.fator_correcao,
          ipca_periodo: correcaoAplicada.ipca_periodo,
          ipca_referencia: correcaoAplicada.ipca_referencia,
          periodo_referencia: correcaoAplicada.periodo_referencia,
          tipo_correcao: correcaoAplicada.tipo_correcao,
        });
      } else if (registroReferencia.fator_correcao) {
        fatores.push({
          ano,
          fator_correcao: registroReferencia.fator_correcao,
          ipca_referencia: registroReferencia.ipca_base,
          periodo_referencia: registroReferencia.periodo_base,
        });
      }
    });

    return fatores.sort((a, b) => b.ano - a.ano);
  }, [dados]);

  // Info básica de correção
  const infoCorrecaoBasica = useMemo((): InfoCorrecaoBasica | null => {
    if (!fatoresCorrecaoPorAno.length) return null;

    const primeiroFator = fatoresCorrecaoPorAno[0];

    return {
      periodo_referencia: primeiroFator.periodo_referencia || "-",
      tipo_correcao: primeiroFator.tipo_correcao || "mensal",
      total_anos: fatoresCorrecaoPorAno.length,
    };
  }, [fatoresCorrecaoPorAno]);

  return {
    fatoresCorrecaoPorAno,
    infoCorrecaoBasica,
  };
}