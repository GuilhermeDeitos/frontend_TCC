import type{ FormData } from "./types";

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateCalculatorInput(
  formData: FormData,
  mesAtual: number,
  anoAtual: number
): ValidationResult {
  // Validar valor monetário
  if (isNaN(Number(formData.valor)) || Number(formData.valor) <= 0) {
    return {
      isValid: false,
      message: "Por favor, insira um valor válido.",
    };
  }

  // Validar preenchimento de todos os campos
  if (
    !formData.mesInicial ||
    !formData.anoInicial ||
    !formData.mesFinal ||
    !formData.anoFinal
  ) {
    return {
      isValid: false,
      message: "Por favor, preencha todos os campos.",
    };
  }

  // Validar restrição de dezembro de 1979
  if (
    (formData.anoFinal === "1979" && formData.mesFinal !== "12") ||
    (formData.anoInicial === "1979" && formData.mesInicial !== "12")
  ) {
    return {
      isValid: false,
      message: "Apenas o mês de dezembro de 1979 é permitido.",
    };
  }

  // Validar disponibilidade de IPCA para meses recentes
  if (
    (formData.anoInicial === anoAtual.toString() &&
      parseInt(formData.mesInicial) > mesAtual - 2) ||
    (formData.anoFinal === anoAtual.toString() &&
      parseInt(formData.mesFinal) > mesAtual - 2)
  ) {
    return {
      isValid: false,
      message: "Ainda não foi disponibilizado o IPCA para esses meses.",
    };
  }

  return { isValid: true };
}