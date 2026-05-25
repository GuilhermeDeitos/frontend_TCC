// utils/validation.ts
import { z } from "zod";

export const createCalculadoraSchema = (mesAtual: number, anoAtual: number) => {
  return z
    .object({
      valor: z.coerce
        .number({ message: "Por favor, insira um valor válido." })
        .positive("O valor deve ser maior que zero."),
      mesInicial: z.string().min(1, "Mês inicial é obrigatório"),
      anoInicial: z.string().min(1, "Ano inicial é obrigatório"),
      mesFinal: z.string().min(1, "Mês final é obrigatório"),
      anoFinal: z.string().min(1, "Ano final é obrigatório"),
    })
    .superRefine((data, ctx) => {
      // Validar restrição de dezembro de 1979
      if (data.anoInicial === "1979" && data.mesInicial !== "12") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Apenas o mês de dezembro de 1979 é permitido.",
          path: ["mesInicial"],
        });
      }
      if (data.anoFinal === "1979" && data.mesFinal !== "12") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Apenas o mês de dezembro de 1979 é permitido.",
          path: ["mesFinal"],
        });
      }

      // Validar disponibilidade de IPCA para meses recentes
      if (
        data.anoInicial === anoAtual.toString() &&
        parseInt(data.mesInicial) > mesAtual - 2
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ainda não foi disponibilizado o IPCA para este mês.",
          path: ["mesInicial"],
        });
      }
      if (
        data.anoFinal === anoAtual.toString() &&
        parseInt(data.mesFinal) > mesAtual - 2
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ainda não foi disponibilizado o IPCA para este mês.",
          path: ["mesFinal"],
        });
      }
    });
};

// Extrai a tipagem automaticamente do Zod
export type CalculadoraFormData = z.infer<ReturnType<typeof createCalculadoraSchema>>;