import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import type { IParamsOriginais } from "./useConsultaCacheData";

interface UseCacheRestorationProps {
  consultaAtual: any;
  cacheEstaValido: () => boolean;
  isLoading: boolean;
  setDadosConsulta: (dados: any[]) => void;
  setParametrosConsulta: (params: { anoInicial: number; anoFinal: number }) => void;
  setParametrosOriginais: (params: IParamsOriginais | null) => void;
  handleVisualizacaoChange: (tipo: "tabela" | "grafico") => void;
  limparCache: () => void;
}

export function useCacheRestoration({
  consultaAtual,
  cacheEstaValido,
  isLoading,
  setDadosConsulta,
  setParametrosConsulta,
  setParametrosOriginais,
  handleVisualizacaoChange,
  limparCache,
}: UseCacheRestorationProps) {
  const [cacheJaRestaurado, setCacheJaRestaurado] = useState(false);

  const restaurarCache = useCallback(() => {
    if (!consultaAtual || !cacheEstaValido()) {
      return;
    }

    console.log(" Restaurando cache...");

    try {
      const dadosCache = consultaAtual.dados;

      if (!dadosCache || dadosCache.length === 0) {
        console.warn("Cache sem dados, limpando...");
        limparCache();
        return;
      }

      console.log(`✓ Cache válido com ${dadosCache.length} registros`);

      const anoIni = consultaAtual.params.data_inicio.split("/")[1];
      const anoFim = consultaAtual.params.data_fim.split("/")[1];

      setParametrosConsulta({
        anoInicial: parseInt(anoIni),
        anoFinal: parseInt(anoFim),
      });

      if (consultaAtual.paramsOriginais) {
        setParametrosOriginais(consultaAtual.paramsOriginais);
      }

      console.log("Setando dados da consulta...");
      setDadosConsulta(dadosCache);

      setCacheJaRestaurado(true);

      if (consultaAtual.visualizacao) {
        setTimeout(() => {
          handleVisualizacaoChange(consultaAtual.visualizacao!);
        }, 100);
      }

      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "Cache Restaurado",
          html: `
            <p><strong>${consultaAtual.descricao}</strong></p>
            <p class="text-sm mt-2">${dadosCache.length} registros carregados</p>
          `,
          timer: 3000,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
        });
      }, 300);

      console.log("Cache restaurado com sucesso!");
    } catch (error) {
      console.error("Erro ao restaurar:", error);
      limparCache();
      setCacheJaRestaurado(false);
    }
  }, [
    consultaAtual,
    cacheEstaValido,
    setDadosConsulta,
    setParametrosConsulta,
    setParametrosOriginais,
    handleVisualizacaoChange,
    limparCache,
  ]);

  useEffect(() => {
    if (cacheJaRestaurado || !consultaAtual || !cacheEstaValido() || isLoading) {
      return;
    }

    const timer = setTimeout(restaurarCache, 300);
    return () => clearTimeout(timer);
  }, [cacheJaRestaurado, consultaAtual, isLoading, cacheEstaValido, restaurarCache]);

  return {
    cacheJaRestaurado,
    setCacheJaRestaurado,
  };
}