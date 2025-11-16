import { useState, useCallback } from "react";
import type { TipoVisualizacao, TipoGrafico, CampoComparacao, TipoComparacao } from "../types/consulta";

export function useResultsViewerState(onVisualizacaoChange?: (tipo: "tabela" | "grafico") => void) {
  const [tipoVisualizacao, setTipoVisualizacao] = useState<TipoVisualizacao>("tabela");
  const [tipoGrafico, setTipoGrafico] = useState<TipoGrafico>("barras");
  const [campoComparacao, setCampoComparacao] = useState<CampoComparacao>("pago_ate_mes");
  const [tipoComparacao, setTipoComparacao] = useState<TipoComparacao>("universidades");
  const [anoSelecionado, setAnoSelecionado] = useState<string>("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);
  const [selectedUniversidadesEvolucao, setSelectedUniversidadesEvolucao] = useState<string[]>([]);
  const [isCompactMode, setIsCompactMode] = useState<boolean>(false);

  const handleVisualizacaoChange = useCallback((tipo: TipoVisualizacao) => {
    setTipoVisualizacao(tipo);
    if (onVisualizacaoChange) {
      onVisualizacaoChange(tipo);
    }
  }, [onVisualizacaoChange]);

  const handleAbrirModalCorrecao = useCallback(() => {
    setModalAberto(true);
  }, []);

  const handleFecharModalCorrecao = useCallback(() => {
    setModalAberto(false);
  }, []);

  return {
    // Estado
    tipoVisualizacao,
    tipoGrafico,
    campoComparacao,
    tipoComparacao,
    anoSelecionado,
    modalAberto,
    itemsPerPage,
    selectedUniversidadesEvolucao,
    isCompactMode,
    
    // Setters
    setTipoGrafico,
    setCampoComparacao,
    setTipoComparacao,
    setAnoSelecionado,
    setItemsPerPage,
    setSelectedUniversidadesEvolucao,
    setIsCompactMode,
    
    // Handlers
    handleVisualizacaoChange,
    handleAbrirModalCorrecao,
    handleFecharModalCorrecao,
  };
}