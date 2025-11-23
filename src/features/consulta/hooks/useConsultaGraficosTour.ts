import { useTour } from "@shared/hooks/useTour";
import { useMemo, useEffect, useRef } from "react";

export function useConsultaGraficosTour() {
  const hasStartedRef = useRef(false);

  const tourGraficosSteps = useMemo(() => [
    {
      id: "charts-intro",
      target: '[data-tour="chart-area"]',
      title: "📊 Visualização Gráfica",
      content:
        "Analise seus dados visualmente! Compare universidades, anos ou veja evolução temporal. Escolha entre 5 tipos de gráficos conforme sua análise.",
      placement: "top" as const,
    },
    {
      id: "comparison-selector",
      target: '[data-tour="comparison-selector"]',
      title: "🔄 Tipos de Comparação",
      content:
        "• Universidades: Compare instituições em um período\n• Anos: Compare o mesmo campo em diferentes anos\n• Evolução Anual: Veja tendência temporal de cada universidade\n\nEscolha também QUAL campo financeiro analisar.",
      placement: "bottom" as const,
    },
    {
      id: "chart-controls-toggle",
      target: '[data-tour="chart-controls-toggle"]',
      title: "🎨 Personalização Avançada",
      content:
        "Abra este painel para:\n• Mudar paleta de cores (6 opções)\n• Ver estatísticas e insights automáticos\n• Adicionar linha de média\n• Ordenar dados (crescente/decrescente)\n• Ajustar altura, grid, animações\n\nIndicadores mostram personalizações ativas.",
      placement: "bottom" as const,
    },
    {
      id: "chart-export",
      target: '[data-tour="chart-export"]',
      title: "📸 Exportar Gráfico",
      content:
        "Exporte o gráfico atual em alta qualidade:\n• PNG: Imagem rasterizada (apresentações)\n• SVG: Vetorial escalável (impressão)\n\nO nome do arquivo inclui tipo e data automaticamente.",
      placement: "left" as const,
    },
    {
      id: "chart-canvas",
      target: '[data-tour="chart-canvas"]',
      title: "🖱️ Interatividade",
      content:
        "Recursos interativos:\n• Passe o mouse para ver valores exatos\n• Use o zoom (barra inferior) para focar intervalos\n• Clique na legenda para ocultar/mostrar séries\n• Nomes completos aparecem no tooltip",
      placement: "top" as const,
    },
    {
      id: "chart-statistics",
      target: '[data-tour="chart-statistics"]',
      title: "📈 Estatísticas Automáticas",
      content:
        "Métricas calculadas automaticamente:\n• Total, Média, Mediana\n• Máximo, Mínimo, Amplitude\n• Desvio Padrão\n• Taxa de crescimento (evolução)\n\nAtive em Controles > Visualização.",
      placement: "bottom" as const,
      condition: () => !!document.querySelector('[data-tour="chart-statistics"]'),
    },
  ], []);

  const tour = useTour("consulta_graficos", tourGraficosSteps);

  useEffect(() => {
    if (hasStartedRef.current || tour.isTourCompleted || tour.isActive) {
      return;
    }

    const checkElements = () => {
      const chartArea = document.querySelector('[data-tour="chart-area"]');
      const comparisonSelector = document.querySelector('[data-tour="comparison-selector"]');
      const chartCanvas = document.querySelector('[data-tour="chart-canvas"]');
      
      if (chartArea && comparisonSelector && chartCanvas) {
        const isChartAreaVisible = window.getComputedStyle(chartArea).display !== 'none';
        const isChartCanvasVisible = window.getComputedStyle(chartCanvas).display !== 'none';
        
        return isChartAreaVisible && isChartCanvasVisible;
      }
      return false;
    };

    let attempts = 0;
    const maxAttempts = 10;
    
    const tryStartTour = () => {
      attempts++;
      
      if (checkElements()) {
        hasStartedRef.current = true;
        setTimeout(() => {
          tour.startTour(true);
        }, 500);
      } else if (attempts < maxAttempts) {
        setTimeout(tryStartTour, 800);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          tryStartTour();
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    const chartArea = document.querySelector('[data-tour="chart-area"]');
    if (chartArea) {
      observer.observe(chartArea);
    } else {
      setTimeout(tryStartTour, 1000);
    }

    return () => {
      observer.disconnect();
    };
  }, [tour]);

  return tour;
}