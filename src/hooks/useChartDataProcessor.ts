import { useMemo } from "react";
import type { DadosConsulta, DadoGrafico, CampoComparacao, TipoComparacao } from "../types/consulta";

interface UseChartDataProcessorProps {
  dados: DadosConsulta[];
  campoComparacao: CampoComparacao;
  tipoComparacao: TipoComparacao;
  anoSelecionado: string;
  extrairNomeUniversidade: (nome: string) => string;
}

export function useChartDataProcessor({
  dados,
  campoComparacao,
  tipoComparacao,
  anoSelecionado,
  extrairNomeUniversidade,
}: UseChartDataProcessorProps) {
  
  // Preparar dados para gráficos com memoização
  const dadosGrafico = useMemo((): DadoGrafico[] => {
    const dadosFiltrados = dados.filter(
      (item) => !item.universidade.includes("Total")
    );

    if (tipoComparacao === "universidades") {
      // Usar Map para agregação mais eficiente
      const dadosAgrupados = new Map<string, number>();
      
      dadosFiltrados.forEach((item) => {
        if (anoSelecionado !== "todos" && item.ano.toString() !== anoSelecionado) {
          return;
        }

        const universidade = extrairNomeUniversidade(item.universidade);
        const valorAtual = dadosAgrupados.get(universidade) || 0;
        dadosAgrupados.set(universidade, valorAtual + (item[campoComparacao] || 0));
      });

      return Array.from(dadosAgrupados.entries())
        .map(([universidade, valor]) => ({
          universidade,
          valor: Number(valor.toFixed(2)),
        }))
        .sort((a, b) => b.valor - a.valor);

    } else if (tipoComparacao === "anos") {
      const dadosAgrupados = new Map<string, number>();
      
      dadosFiltrados.forEach((item) => {
        const ano = item.ano.toString();
        const valorAtual = dadosAgrupados.get(ano) || 0;
        dadosAgrupados.set(ano, valorAtual + (item[campoComparacao] || 0));
      });

      return Array.from(dadosAgrupados.entries())
        .map(([ano, valor]) => ({
          universidade: `Ano ${ano}`,
          valor: Number(valor.toFixed(2)),
        }))
        .sort((a, b) => {
          const anoA = parseInt(a.universidade.replace("Ano ", ""));
          const anoB = parseInt(b.universidade.replace("Ano ", ""));
          return anoA - anoB;
        });

    } else if (tipoComparacao === "evolucao_anual") {
      const dadosPorUniversidadeAno = new Map<string, { universidade: string; ano: string; valor: number }>();
      
      dadosFiltrados.forEach((item) => {
        if (anoSelecionado !== "todos" && item.ano.toString() !== anoSelecionado) {
          return;
        }

        const universidade = extrairNomeUniversidade(item.universidade);
        const ano = item.ano.toString();
        const chave = `${universidade}-${ano}`;

        const registro = dadosPorUniversidadeAno.get(chave);
        if (registro) {
          registro.valor += item[campoComparacao] || 0;
        } else {
          dadosPorUniversidadeAno.set(chave, {
            universidade,
            ano,
            valor: item[campoComparacao] || 0,
          });
        }
      });

      return Array.from(dadosPorUniversidadeAno.values())
        .map((item) => ({
          universidade: `${item.universidade} (${item.ano})`,
          valor: Number(item.valor.toFixed(2)),
        }))
        .sort((a, b) => a.universidade.localeCompare(b.universidade));
    }

    return [];
  }, [dados, campoComparacao, tipoComparacao, anoSelecionado, extrairNomeUniversidade]);

  return dadosGrafico;
}