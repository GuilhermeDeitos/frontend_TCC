import { useTour } from '@shared/hooks/useTour';
import { useEffect } from 'react';

export function useHelpPageTour() {
  const tourSteps = [
    {
      id: 'welcome',
      target: 'body',
      title: '❓ Bem-vindo à Central de Ajuda!',
      content: 'Aqui você encontra respostas para suas dúvidas sobre o SAD-UEPR. Vamos mostrar rapidamente os recursos principais desta página.',
      placement: 'bottom' as const,
    },
    {
      id: 'search-bar',
      target: '[data-tour="search-bar"]',
      title: '🔍 Busca Inteligente',
      content: 'Use a barra de busca para encontrar respostas rapidamente. Digite palavras-chave e o sistema filtrará as perguntas relevantes em tempo real. Você pode buscar em perguntas, respostas e tags.',
      placement: 'bottom' as const,
    },
    {
      id: 'quick-navigation',
      target: '[data-tour="quick-navigation"]',
      title: '🧭 Filtro por Categorias',
      content: 'Clique em uma categoria para filtrar as perguntas por tema específico. Os números indicam quantas perguntas existem em cada categoria. Clique novamente para remover o filtro.',
      placement: 'bottom' as const,
    },
    {
      id: 'faq-item',
      target: '[data-tour="faq-item"]',
      title: '💡 Expandir Respostas',
      content: 'Clique em qualquer pergunta para expandir e ver a resposta completa. As tags coloridas abaixo de cada pergunta ajudam a identificar o tema rapidamente.',
      placement: 'top' as const,
    },
    {
      id: 'contact-section',
      target: '[data-tour="contact-section"]',
      title: '📞 Não Encontrou sua Resposta?',
      content: 'Se sua dúvida não foi respondida, entre em contato conosco através do formulário ou por email. Respondemos em até 48 horas!',
      placement: 'top' as const,
    },
    {
      id: 'final',
      target: 'body',
      title: '🎉 Tour Concluído!',
      content: 'Agora você sabe como usar a Central de Ajuda! Use a busca e os filtros para encontrar respostas rapidamente. Você pode refazer este tour a qualquer momento.',
      placement: 'bottom' as const,
    },
  ];

  const tour = useTour('helpPage', tourSteps);

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