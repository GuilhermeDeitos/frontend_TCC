import type { DadosConsulta } from "@features/consulta/types/consulta";

/**
 * Converte uma string monetária para número
 */
export function converterValorMonetario(valor: string | null | undefined): number {
  if (!valor) return 0;
  return parseFloat(String(valor).replace(/\./g, "").replace(",", ".")) || 0;
}

/**
 * Processa os dados recebidos do servidor e os converte para o formato da aplicação
 */
export function processarDadosChunk(
  chunk: any,
  dadosAcumulados: DadosConsulta[]
): DadosConsulta[] {
  return chunk.dados.map((item: any, index: number) => {
    // Extrair valores monetários dos dados
    const valorPago = converterValorMonetario(item.PAGO_NO_MES);
    const valorEmpenhado = converterValorMonetario(item.EMPENHADO_NO_MES);
    const valorLiquidado = converterValorMonetario(item.LIQUIDADO_NO_MES);

    // Extrair metadados de correção se existirem
    const correcaoAplicada = item._correcao_aplicada || null;

    return {
      id: dadosAcumulados.length + index + 1,
      ano: item._ano_validado || chunk.ano_processado,
      mes: parseInt(String(item.MES)) || 12,
      universidade:
        item.UNIDADE_ORCAMENTARIA || item.universidade || "Não informado",
      valor_empenhado: valorEmpenhado,
      valor_liquidado: valorLiquidado,
      valor_pago: valorPago,
      funcao: item.FUNCAO,
      grupo_natureza: item.GRUPO_NATUREZA_DESPESA,
      origem_recursos: item.ORIGEM_RECURSOS,

      // Novos campos do Portal da Transparência
      orcamento_inicial_loa: converterValorMonetario(
        item.ORCAMENTO_INICIAL_LOA
      ),
      total_orcamentario_ate_mes: converterValorMonetario(
        item.TOTAL_ORCAMENTARIO_ATE_MES
      ),
      total_orcamentario_no_mes: converterValorMonetario(
        item.TOTAL_ORCAMENTARIO_NO_MES
      ),
      disponibilidade_orcamentaria_ate_mes: converterValorMonetario(
        item.DISPONIBILIDADE_ORCAMENTARIA_ATE_MES
      ),
      disponibilidade_orcamentaria_no_mes: converterValorMonetario(
        item.DISPONIBILIDADE_ORCAMENTARIA_NO_MES
      ),
      empenhado_ate_mes: converterValorMonetario(item.EMPENHADO_ATE_MES),
      empenhado_no_mes: converterValorMonetario(item.EMPENHADO_NO_MES),
      liquidado_ate_mes: converterValorMonetario(item.LIQUIDADO_ATE_MES),
      liquidado_no_mes: converterValorMonetario(item.LIQUIDADO_NO_MES),
      pago_ate_mes: converterValorMonetario(item.PAGO_ATE_MES),
      pago_no_mes: converterValorMonetario(item.PAGO_NO_MES),

      // Dados de correção monetária
      _correcao_aplicada: correcaoAplicada,
      correcao_aplicada: correcaoAplicada,
      fator_correcao: correcaoAplicada?.fator_correcao,
      ipca_base: correcaoAplicada?.ipca_referencia,
      periodo_base: correcaoAplicada?.periodo_referencia,
    };
  });
}