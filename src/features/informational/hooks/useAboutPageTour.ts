import { useTour } from '@shared/hooks/useTour';
import { useEffect } from 'react';

export function useAboutPageTour() {
  const tourSteps = [
    {
      id: 'welcome',
      target: 'body',
      title: 'ℹ️ Bem-vindo à Página Sobre!',
      content: 'Aqui você conhecerá a história, objetivos e funcionamento do SAD-UEPR. Vamos fazer um tour para entender melhor este projeto acadêmico.',
      placement: 'bottom' as const,
    },
    {
      id: 'hero-section',
      target: '[data-tour="hero-section"]',
      title: '🎓 Sistema de Apoio à Decisão',
      content: 'O SAD-UEPR é um projeto desenvolvido como Trabalho de Conclusão de Curso na UNIOESTE, focado na análise de dados financeiros das universidades estaduais do Paraná.',
      placement: 'bottom' as const,
    },
    {
      id: 'project-section',
      target: '[data-tour="project-section"]',
      title: '📚 O Projeto',
      content: 'Conheça a origem e propósito do SAD-UEPR: um portal acadêmico para centralizar e analisar 22 anos de dados financeiros das universidades estaduais do Paraná.',
      placement: 'top' as const,
    },
    {
      id: 'problem-section',
      target: '[data-tour="problem-section"]',
      title: '🔍 O Problema Identificado',
      content: 'O projeto nasceu da necessidade de resolver dois grandes desafios: dados fragmentados em diferentes portais e falta de correção monetária para comparações históricas.',
      placement: 'top' as const,
    },
    {
      id: 'fragmentation-card',
      target: '[data-tour="fragmentation-card"]',
      title: '📂 Fragmentação dos Dados',
      content: 'Antes do SAD-UEPR, era necessário coletar manualmente informações de diferentes fontes, um processo demorado e sujeito a erros.',
      placement: 'top' as const,
    },
    {
      id: 'correction-card',
      target: '[data-tour="correction-card"]',
      title: '💰 Correção Monetária',
      content: 'Valores de diferentes anos não podem ser comparados diretamente devido à inflação. O SAD-UEPR aplica automaticamente a correção pelo IPCA para análises precisas.',
      placement: 'top' as const,
    },
    {
      id: 'mission-section',
      target: '[data-tour="mission-section"]',
      title: '🎯 Nossa Missão',
      content: 'O sistema tem quatro objetivos principais: centralizar dados, permitir análises precisas, promover transparência e apoiar decisões estratégicas.',
      placement: 'top' as const,
    },
    {
      id: 'how-works-section',
      target: '[data-tour="how-works-section"]',
      title: '⚙️ Como o Sistema Funciona',
      content: 'Entenda a arquitetura do SAD-UEPR: desde a coleta automatizada de dados até a disponibilização via API para análises e visualizações.',
      placement: 'top' as const,
    },
    {
      id: 'scraping-step',
      target: '[data-tour="scraping-step"]',
      title: '🤖 Coleta Automatizada',
      content: 'Um robô desenvolvido em Python navega automaticamente pelos portais públicos para extrair os dados brutos de despesas das universidades.',
      placement: 'top' as const,
    },
    {
      id: 'processing-step',
      target: '[data-tour="processing-step"]',
      title: ' Processamento e Correção',
      content: 'Os dados extraídos são limpos, organizados e corrigidos automaticamente pelo IPCA, garantindo comparações justas entre diferentes períodos.',
      placement: 'top' as const,
    },
    {
      id: 'api-step',
      target: '[data-tour="api-step"]',
      title: '🌐 Disponibilização via API',
      content: 'Todos os dados tratados são disponibilizados através de APIs REST, permitindo acesso programático para pesquisadores e desenvolvedores.',
      placement: 'top' as const,
    },
    {
      id: 'author-section',
      target: '[data-tour="author-section"]',
      title: '👨‍🎓 Sobre o Autor',
      content: 'Conheça o desenvolvedor do projeto e os orientadores que tornaram este trabalho acadêmico possível na UNIOESTE.',
      placement: 'top' as const,
    },
    {
      id: 'cta-section',
      target: '[data-tour="cta-section"]',
      title: '🚀 Explore o Sistema',
      content: 'Agora que você conhece a história e funcionamento do SAD-UEPR, está pronto para explorar todas as funcionalidades disponíveis!',
      placement: 'top' as const,
    },
    {
      id: 'final',
      target: 'body',
      title: '🎉 Tour Sobre Concluído!',
      content: 'Agora você conhece toda a história, missão e funcionamento do SAD-UEPR! Este é um projeto acadêmico dedicado a promover transparência e facilitar análises sobre o financiamento das universidades estaduais do Paraná.',
      placement: 'bottom' as const,
    },
  ];

  const tour = useTour('aboutPage', tourSteps);

  // Auto-iniciar tour apenas na primeira visita
  useEffect(() => {
    if (!tour.isTourCompleted && !tour.isActive) {
      const timer = setTimeout(() => {
        tour.startTour();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [tour.isTourCompleted, tour.isActive]);

  return tour;
}