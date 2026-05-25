import { useQuery } from "@tanstack/react-query";
import api from "@shared/utils/api";

export function useIPCAData() {
  return useQuery({
    // Chave única do cache
    queryKey: ["ipca-series"],

    // Busca dados da API
    queryFn: async () => {
      const response = await api.get("/ipca");

      // Converte objeto da API para array
      return Object.entries(response.data.data).map(
        ([key, value], index) => ({
          id: index,
          data: key,
          valor: Number(value),
        })
      );
    },

    // Cache por 5 minutos
    staleTime: 0,
  });
}