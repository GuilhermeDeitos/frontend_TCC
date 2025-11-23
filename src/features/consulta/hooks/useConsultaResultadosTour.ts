import { useTour } from "@shared/hooks/useTour";
import { useMemo, useEffect, useRef } from "react";

export function useConsultaResultadosTour() {
  const hasStarted = useRef(false);

  const tourResultadosSteps = useMemo(
    () => [
      {
        id: "results-intro",
        target: '[data-tour="results-viewer"]',
        title: "✅ Consulta Concluída!",
        content:
          "Seus dados estão prontos! Alterne entre tabela ou gráficos, aplique filtros compostos e exporte em diversos formatos (Excel, PDF, CSV, JSON).",
        placement: "top" as const,
      },
      {
        id: "export-options",
        target: '[data-tour="export-options"]',
        title: "📥 Exportação Avançada",
        content:
          "Exporte em múltiplos formatos com personalizações: escolha colunas específicas, adicione título customizado, ajuste formatação e mais. Excel oferece as melhores opções de formatação.",
        placement: "left" as const,
      },
      {
        id: "results-filter-panel",
        target: '[data-tour="results-filter-panel"]',
        title: "🔍 Filtros Compostos (AND)",
        content:
          "Combine até 5 filtros simultaneamente! Todos os critérios devem ser satisfeitos (operação AND). Ex: Ano=2020 E Grupo=Pessoal mostra apenas registros que atendem AMBAS condições.",
        placement: "top" as const,
      },
      {
        id: "table-controls",
        target: '[data-tour="table-controls"]',
        title: "📐 Controles de Densidade",
        content:
          "Ajuste quantos registros ver por página (10-100) e ative o Modo Compacto para visualizar mais dados na tela. Útil para análises de grandes volumes.",
        placement: "top" as const,
        condition: () =>
          !!document.querySelector('[data-tour="table-controls"]'),
      },
      {
        id: "correcao-info",
        target: '[data-tour="correcao-footer"]',
        title: "💰 Detalhes da Correção IPCA",
        content:
          "Veja para qual período os valores foram corrigidos. Clique em 'Detalhes da Correção' para visualizar os fatores de correção aplicados a cada ano individualmente.",
        placement: "top" as const,
        condition: () =>
          !!document.querySelector('[data-tour="correcao-footer"]'),
      },
    ],
    []
  );

  const tour = useTour("consulta_resultados", tourResultadosSteps);

  useEffect(() => {
    if (hasStarted.current || tour.isTourCompleted || tour.isActive) {
      return;
    }

    const checkElements = () => {
      const resultsViewer = document.querySelector(
        '[data-tour="results-viewer"]'
      );
      const tableView = document.querySelector('[data-tour="table-view"]');

      if (resultsViewer && tableView) {
        const isTableVisible =
          window.getComputedStyle(tableView).display !== "none";
        return isTableVisible;
      }
      return false;
    };

    if (checkElements()) {
      hasStarted.current = true;
      const timer = setTimeout(() => {
        tour.startTour(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [tour]);

  return tour;
}