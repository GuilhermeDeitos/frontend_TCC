import { useState, useEffect, useCallback, useRef } from "react";
import api from "../utils/api";

interface IPCAOption {
  value: string;
  label: string;
}

/**
 * Hook para gerenciar dados relacionados ao IPCA
 * Fornece listas e métodos para carregar dados de IPCA
 */
export function useIPCAData() {
  const [listaIPCA, setListaIPCA] = useState<IPCAOption[]>([]);
  const [listaIPCAAnual, setListaIPCAAnual] = useState<IPCAOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const mediasAnuaisCarregadas = useRef<boolean>(false);

  // Buscar lista de IPCA disponíveis
  useEffect(() => {
    api.get("/ipca")
      .then((response) => {
        const opcoes = Object.entries(response.data.data).map(
          ([key, value]) => ({
            value: key,
            label: `${key} - ${Number(value).toFixed(4)}`,
          })
        );
        setListaIPCA(opcoes.reverse());
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          setError("Servidor fora do ar");
        } else {
          setError("Erro ao buscar IPCAs");
        }
        console.error("Erro ao buscar IPCAs:", error);
      });
  }, []);

  // Carregar médias anuais de IPCA
  const carregarMediasAnuais = useCallback((): void => {
    // Evitar carregar múltiplas vezes
    if (mediasAnuaisCarregadas.current || listaIPCAAnual.length > 0) {
      return;
    }

    // Definir anos relevantes apenas (2000-2025) ao invés de todos desde 1979
    const anosRelevantes = Array.from({ length: 26 }, (_, i) =>
      (2000 + i).toString()
    );
    const queryString = anosRelevantes.map((ano) => `anos=${ano}`).join("&");

    console.log("Carregando médias anuais - chamada única");

    // Fazer a requisição diretamente sem depender da primeira consulta
    api.get(`/ipca/medias-anuais?${queryString}`)
      .then((response) => {
        const opcoesAnuais = Object.entries(response.data)
          .filter(([_, data]: any) => !data.erro)
          .map(([ano, data]: any) => ({
            value: ano,
            label: `${ano} - Média: ${data.media_ipca.toFixed(4)}`,
          }))
          .sort((a, b) => b.value.localeCompare(a.value)); // Ordenar decrescente

        setListaIPCAAnual(opcoesAnuais);
        mediasAnuaisCarregadas.current = true;
      })
      .catch((error) => {
        console.error("Erro ao buscar médias anuais:", error);
      });
  }, [listaIPCAAnual.length]);

  return {
    listaIPCA,
    listaIPCAAnual,
    carregarMediasAnuais,
    error
  };
}