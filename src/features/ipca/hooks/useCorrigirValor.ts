import { useMutation } from "@tanstack/react-query";
import apiIpca from "@shared/utils/api";

interface CorrigirValorParams {
  mes_inicial: string;
  ano_inicial: string;
  mes_final: string;
  ano_final: string;
  valor: string;
}

export function useCorrigirValor() {
  return useMutation({
    // Função responsável pela chamada da API
    mutationFn: async (params: CorrigirValorParams) => {
      const response = await apiIpca.get("/ipca/corrigir", {
        params,
      });

      return response.data;
    },
  });
}