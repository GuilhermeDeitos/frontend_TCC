import { useTour } from "./useTour";
import { useMemo, useEffect, useRef } from "react";

export function useConsultaResultadosTour() {
  const hasStarted = useRef(false);

  const tourResultadosSteps = useMemo(
    () => [
      {
        id: "results-intro",
        target: '[data-tour="results-viewer"]',
        title: "📋 Resultados da Consulta",
        content:
          "Aqui estão os dados da sua consulta! Você pode alternar entre visualização em tabela ou gráficos, aplicar filtros e exportar os dados.",
        placement: "top" as const,
      },
      {
        id: "view-toggle",
        target: '[data-tour="view-toggle"]',
        title: "🔀 Alternar Visualização",
        content:
          "Escolha entre tabela (detalhada) ou gráficos (visual). Cada formato tem suas vantagens dependendo da análise que você quer fazer.",
        placement: "bottom" as const,
      },
      {
        id: "export-options",
        target: '[data-tour="export-options"]',
        title: "💾 Exportar Dados",
        content:
          "Exporte os resultados em diversos formatos: Excel (XLSX), PDF, CSV ou JSON. Personalize colunas, título e outras configurações antes de exportar.",
        placement: "left" as const,
      },
      {
        id: "results-filter-panel",
        target: '[data-tour="results-filter-panel"]',
        title: "🔍 Filtros Compostos",
        content:
          "Combine múltiplos critérios de filtro para análises mais específicas. Por exemplo, filtre por ano E grupo de natureza ao mesmo tempo!",
        placement: "top" as const,
      },
      {
        id: "add-filter-button",
        target: '[data-tour="add-filter-button"]',
        title: "➕ Adicionar Filtros",
        content:
          "Clique aqui para adicionar novos filtros. Você pode ter até 5 filtros ativos simultaneamente, permitindo análises muito precisas.",
        placement: "left" as const,
        condition: () =>
          !!document.querySelector('[data-tour="add-filter-button"]'),
      },
      {
        id: "active-filters",
        target: '[data-tour="active-filters"]',
        title: "📋 Filtros Configurados",
        content:
          "Cada filtro funciona como uma condição AND. Configure o tipo (o que filtrar) e o valor (qual valor específico). Todos os filtros devem ser satisfeitos para um registro aparecer.",
        placement: "bottom" as const,
        condition: () =>
          !!document.querySelector('[data-tour="active-filters"]'),
      },
      {
        id: "table-controls",
        target: '[data-tour="table-controls"]',
        title: "⚙️ Controles da Tabela",
        content:
          "Personalize a visualização da tabela: escolha quantos itens exibir por página (10, 25, 50 ou 100) e ative o modo compacto para uma visão mais condensada dos dados.",
        placement: "top" as const,
        condition: () =>
          !!document.querySelector('[data-tour="table-controls"]'),
      },
      {
        id: "compact-mode",
        target: '[data-tour="compact-mode"]',
        title: "📐 Modo Compacto",
        content:
          "Ative o modo compacto para visualizar mais dados na tela. Ideal quando você precisa ter uma visão geral de muitos registros ao mesmo tempo.",
        placement: "left" as const,
        condition: () => !!document.querySelector('[data-tour="compact-mode"]'),
      },
      {
        id: "table-view",
        target: '[data-tour="table-view"]',
        title: "📊 Tabela de Dados",
        content:
          "A tabela mostra todos os detalhes dos dados consultados. Você pode ordenar clicando nos cabeçalhos das colunas.",
        placement: "top" as const,
        condition: () => {
          const element = document.querySelector('[data-tour="table-view"]');
          const isVisible =
            element && window.getComputedStyle(element).display !== "none";
          return !!isVisible;
        },
      },
      {
        id: "correcao-info",
        target: '[data-tour="correcao-footer"]',
        title: "💰 Informações de Correção",
        content:
          "Aqui você vê para qual período os valores foram corrigidos. Clique no botão 'Detalhes da Correção' para ver os fatores aplicados a cada ano.",
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
