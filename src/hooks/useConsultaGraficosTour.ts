import { useTour } from "./useTour";
import { useMemo, useEffect, useRef } from "react";

export function useConsultaGraficosTour() {
  const hasStartedRef = useRef(false);

  const tourGraficosSteps = useMemo(() => [
    {
      id: "charts-intro",
      target: '[data-tour="chart-area"]',
      title: "📈 Visualização em Gráficos",
      content:
        "Os gráficos oferecem uma visão visual dos dados, facilitando comparações e identificação de tendências entre universidades e períodos.",
      placement: "top" as const,
    },
    {
      id: "comparison-selector",
      target: '[data-tour="comparison-selector"]',
      title: "🔄 Opções de Comparação",
      content:
        "Escolha o que deseja comparar: universidades entre si, diferentes anos, ou a evolução anual de cada instituição. Também selecione qual campo financeiro analisar.",
      placement: "bottom" as const,
    },
    {
      id: "chart-type-selector",
      target: '[data-tour="chart-type-selector"]',
      title: "📊 Tipo de Gráfico",
      content:
        "Escolha entre gráficos de Barras, Linhas, Pizza ou Área. Cada tipo é mais adequado para diferentes análises:\n• 📊 Barras: Comparação direta\n• 📈 Linhas: Tendências temporais\n• 🥧 Pizza: Proporções\n• 📉 Área: Volumes acumulados",
      placement: "bottom" as const,
    },
    {
      id: "university-selector",
      target: '[data-tour="university-selector"]',
      title: "🎓 Seleção de Universidades",
      content:
        "Para evolução anual, selecione quais universidades você deseja comparar. Você pode escolher todas ou apenas algumas para uma análise mais focada. Este seletor aparece automaticamente quando você escolhe 'Evolução Anual'.",
      placement: "top" as const,
      condition: () => !!document.querySelector('[data-tour="university-selector"]'),
    },
    {
      id: "chart-controls",
      target: '[data-tour="chart-controls"]',
      title: "🎨 Personalização Avançada",
      content:
        "Personalize seu gráfico:\n• Paleta de cores (4 opções)\n• Mostrar/ocultar estatísticas\n• Linha de média\n• Ordenação (para barras)\n• Exportar em alta qualidade",
      placement: "top" as const,
    },
    {
      id: "chart-statistics",
      target: '[data-tour="chart-statistics"]',
      title: "📊 Estatísticas Detalhadas",
      content:
        "Visualize métricas importantes dos seus dados:\n• Total e Média\n• Máximo e Mínimo\n• Mediana e Desvio Padrão\n• Crescimento (para séries temporais)\n• Quantidade de registros\n\nAs estatísticas se adaptam ao contexto da análise.",
      placement: "bottom" as const,
      condition: () => !!document.querySelector('[data-tour="chart-statistics"]'),
    },
    {
      id: "chart-canvas",
      target: '[data-tour="chart-canvas"]',
      title: "📈 Área Interativa do Gráfico",
      content:
        "Este é o gráfico com seus dados. Recursos disponíveis:\n• Passe o mouse sobre elementos para ver detalhes\n• Use o zoom (barra inferior) para focar em intervalos\n• Clique na legenda para filtrar dados\n• Os nomes completos aparecem ao passar o mouse",
      placement: "top" as const,
    },
    {
      id: "chart-zoom",
      target: '[data-tour="chart-canvas"]',
      title: "🔍 Zoom e Navegação",
      content:
        "Use a barra de zoom na parte inferior do gráfico para focar em um intervalo específico de dados. Arraste as alças laterais para ajustar o intervalo visualizado. Perfeito para análises detalhadas!",
      placement: "bottom" as const,
      condition: () => {
        const canvas = document.querySelector('[data-tour="chart-canvas"]');
        return !!canvas && !!canvas.querySelector('.recharts-brush');
      },
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
      const chartTypeSelector = document.querySelector('[data-tour="chart-type-selector"]');
      const chartControls = document.querySelector('[data-tour="chart-controls"]');
      const chartCanvas = document.querySelector('[data-tour="chart-canvas"]');
      
      // Verificar se os elementos principais estão presentes e visíveis
      if (chartArea && comparisonSelector && chartTypeSelector && chartControls && chartCanvas) {
        const isChartAreaVisible = window.getComputedStyle(chartArea).display !== 'none';
        const isChartCanvasVisible = window.getComputedStyle(chartCanvas).display !== 'none';
        
        return isChartAreaVisible && isChartCanvasVisible;
      }
      return false;
    };

    // Tentar múltiplas vezes com intervalos maiores para aguardar o lazy loading
    let attempts = 0;
    const maxAttempts = 10;
    
    const tryStartTour = () => {
      attempts++;
      
      if (checkElements()) {
        hasStartedRef.current = true;
        console.log("✅ Todos os elementos do tour de gráficos encontrados, iniciando...");
        
        setTimeout(() => {
          tour.startTour(true);
        }, 500);
      } else if (attempts < maxAttempts) {
        console.log(`⏳ Aguardando elementos do tour de gráficos... (tentativa ${attempts}/${maxAttempts})`);
        setTimeout(tryStartTour, 800);
      } else {
        console.log("⚠️ Timeout ao aguardar elementos do tour de gráficos");
      }
    };

    // Usar IntersectionObserver como fallback
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          console.log("👁️ Chart area visível, verificando elementos...");
          tryStartTour();
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    const chartArea = document.querySelector('[data-tour="chart-area"]');
    if (chartArea) {
      observer.observe(chartArea);
    } else {
      // Se não encontrar a área, tentar de qualquer forma
      setTimeout(tryStartTour, 1000);
    }

    return () => {
      observer.disconnect();
    };
  }, [tour]);

  return tour;
}