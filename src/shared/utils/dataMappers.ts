/**
 * Corrige valores invertidos de até_mes e no_mes
 * Lógica: até_mes deve sempre ser >= no_mes (acumulado vs mensal)
 */
export function corrigirValoresInvertidos(
  ateMs: number | undefined,
  noMes: number | undefined
): { ate_mes: number; no_mes: number } {
  const valorAte = ateMs || 0;
  const valorNo = noMes || 0;

  // Se até_mes < no_mes, os valores estão invertidos
  if (valorAte < valorNo) {
    return {
      ate_mes: valorNo,  // Inverter
      no_mes: valorAte,  // Inverter
    };
  }

  // Valores corretos
  return {
    ate_mes: valorAte,
    no_mes: valorNo,
  };
}