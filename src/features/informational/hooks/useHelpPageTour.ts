import { useTour } from '@shared/hooks/useTour';
import { useEffect } from 'react';

export function useHelpPageTour() {
  const tourSteps = [
    {
      id: 'welcome',
      target: 'body',
      title: '❓ Bem-vindo à Central de Ajuda!',
      content: 'Aqui você encontra respostas detalhadas para as principais dúvidas sobre o SAD-UEPR. Vamos fazer um tour rápido para você conhecer como navegar pela página de ajuda.',
      placement: 'bottom' as const,
    },
    {
      id: 'title-section',
      target: '[data-tour="title-section"]',
      title: '📋 Central de Ajuda',
      content: 'Esta é a página de ajuda do sistema, onde reunimos todas as perguntas frequentes (FAQ) organizadas por categorias para facilitar sua busca.',
      placement: 'bottom' as const,
    },
    {
      id: 'quick-navigation',
      target: '[data-tour="quick-navigation"]',
      title: '🧭 Navegação Rápida',
      content: 'Use estes atalhos para ir diretamente à categoria de perguntas que você procura. Clique em qualquer categoria para rolar automaticamente até ela.',
      placement: 'bottom' as const,
    },
    {
      id: 'category-general',
      target: '[data-tour="category-general"]',
      title: '📚 Questões Gerais',
      content: 'Nesta seção você encontra informações básicas sobre o SAD-UEPR: o que é o sistema, período dos dados, fontes de informação e universidades cobertas.',
      placement: 'top' as const,
    },
    {
      id: 'faq-item',
      target: '[data-tour="faq-item"]',
      title: '💡 Como Usar as Perguntas',
      content: 'Clique em qualquer pergunta para expandir e ver a resposta completa. As respostas são detalhadas e incluem exemplos práticos quando necessário.',
      placement: 'top' as const,
    },
    {
      id: 'category-data',
      target: '[data-tour="category-data"]',
      title: 'Entendendo os Dados',
      content: 'Seção fundamental para compreender conceitos como correção pelo IPCA, termos financeiros (Empenhado, Liquidado, Pago) e como interpretar os resultados do sistema.',
      placement: 'top' as const,
    },
    {
      id: 'category-usage',
      target: '[data-tour="category-usage"]',
      title: '🔧 Como Usar o Portal',
      content: 'Aprenda a realizar consultas, usar filtros, exportar dados, alternar entre visualizações e resolver problemas comuns como anos ausentes nos resultados.',
      placement: 'top' as const,
    },
    {
      id: 'category-developers',
      target: '[data-tour="category-developers"]',
      title: '👨‍💻 Para Desenvolvedores e Pesquisadores',
      content: 'Informações técnicas sobre a API, tecnologias utilizadas, código-fonte aberto e recomendações para análises acadêmicas e científicas.',
      placement: 'top' as const,
    },
    {
      id: 'contact-section',
      target: '[data-tour="contact-section"]',
      title: '📞 Não Encontrou sua Resposta?',
      content: 'Se sua dúvida não foi respondida aqui, você pode entrar em contato conosco através do formulário ou por email direto. Respondemos em até 48 horas!',
      placement: 'top' as const,
    },
    {
      id: 'final',
      target: 'body',
      title: '🎉 Tour da Ajuda Concluído!',
      content: 'Agora você sabe como navegar pela Central de Ajuda! Use as categorias para encontrar respostas específicas e não hesite em nos contatar se precisar de mais informações. Você pode refazer este tour a qualquer momento.',
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