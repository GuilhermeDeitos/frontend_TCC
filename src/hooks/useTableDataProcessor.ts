import { useMemo } from "react";
import type { DadosConsulta } from "../types/consulta";
import { corrigirValoresInvertidos } from "../utils/dataMappers";

interface UseTableDataProcessorProps {
  dados: DadosConsulta[];
  extrairNomeUniversidade: (nome: string) => string;
}

export function useTableDataProcessor({
  dados,
  extrairNomeUniversidade,
}: UseTableDataProcessorProps) {
  
  // Formatador de moeda memoizado
  const formatCurrency = useMemo(() => {
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return (value: number) => formatter.format(value);
  }, []);

  // Processar dados da tabela
  const dadosTabela = useMemo(() => {
    return dados.map((item, index) => {
      const universidadeDisplay = extrairNomeUniversidade(item.universidade);

      // Corrigir valores invertidos
      const total_orcamentario = corrigirValoresInvertidos(
        item.total_orcamentario_ate_mes,
        item.total_orcamentario_no_mes
      );
      const disponibilidade_orcamentaria = corrigirValoresInvertidos(
        item.disponibilidade_orcamentaria_ate_mes,
        item.disponibilidade_orcamentaria_no_mes
      );
      const empenhado = corrigirValoresInvertidos(
        item.empenhado_ate_mes,
        item.empenhado_no_mes
      );
      const liquidado = corrigirValoresInvertidos(
        item.liquidado_ate_mes,
        item.liquidado_no_mes
      );
      const pago = corrigirValoresInvertidos(
        item.pago_ate_mes,
        item.pago_no_mes
      );

      return {
        id: item.id || index + 1,
        universidade: universidadeDisplay,
        ano: item.ano.toString(),
        funcao: item.funcao || "-",
        grupo_natureza: item.grupo_natureza || "-",
        origem_recursos: item.origem_recursos || "-",
        orcamento_loa: formatCurrency(item.orcamento_inicial_loa || 0),
        total_orcamentario_ate_mes: formatCurrency(total_orcamentario.ate_mes),
        total_orcamentario_no_mes: formatCurrency(total_orcamentario.no_mes),
        disponibilidade_orcamentaria_ate_mes: formatCurrency(disponibilidade_orcamentaria.ate_mes),
        disponibilidade_orcamentaria_no_mes: formatCurrency(disponibilidade_orcamentaria.no_mes),
        empenhado_ate_mes: formatCurrency(empenhado.ate_mes),
        empenhado_no_mes: formatCurrency(empenhado.no_mes),
        liquidado_ate_mes: formatCurrency(liquidado.ate_mes),
        liquidado_no_mes: formatCurrency(liquidado.no_mes),
        pago_ate_mes: formatCurrency(pago.ate_mes),
        pago_no_mes: formatCurrency(pago.no_mes),
      };
    });
  }, [dados, extrairNomeUniversidade, formatCurrency]);

  return {
    dadosTabela,
    formatCurrency,
  };
}