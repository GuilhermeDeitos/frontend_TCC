import { useTour } from './useTour';
import { useEffect } from 'react';

export function useMainPageTour() {
  const tourSteps = [
    {
      id: 'welcome',
      target: 'body',
      title: '👋 Bem-vindo ao SAD-UEPR!',
      content: 'Olá! Seja bem-vindo ao Sistema de Apoio à Decisão das Universidades Estaduais do Paraná. Vamos fazer um tour rápido para você conhecer as funcionalidades do sistema.',
      placement: 'bottom' as const,
    },
    {
      id: 'header',
      target: 'header',
      title: '🧭 Menu de Navegação',
      content: 'Este é o menu principal do sistema. Aqui você pode navegar entre as diferentes seções. Vamos conhecer cada uma delas!',
      placement: 'bottom' as const,
    },
    {
      id: 'nav-sobre',
      target: 'header nav ul li:nth-child(5)',
      title: '📖 Sobre o Projeto',
      content: 'Conheça mais sobre o SAD-UEPR: seus objetivos, metodologia, tecnologias utilizadas e a equipe por trás do desenvolvimento deste sistema acadêmico.',
      placement: 'bottom' as const,
    },
    {
      id: 'nav-contato',
      target: 'header nav ul li:nth-child(6)',
      title: '✉️ Contato',
      content: 'Tem dúvidas, sugestões ou feedback? Use o formulário de contato para enviar sua mensagem. Retornaremos em até 48 horas!',
      placement: 'bottom' as const,
    },
    {
      id: 'nav-ajuda',
      target: 'header nav ul li:nth-child(7)',
      title: '❓ Central de Ajuda',
      content: 'Acesse nossa FAQ completa com respostas para as dúvidas mais comuns sobre o uso do sistema, interpretação dos dados e funcionalidades disponíveis.',
      placement: 'bottom' as const,
    },
    {
      id: 'main-description',
      target: '[data-tour="main-description"]',
      title: '📖 Sobre o Sistema',
      content: 'O SAD-UEPR centraliza e apresenta informações financeiras das sete universidades estaduais do Paraná, facilitando análises e decisões estratégicas com dados claros e acessíveis.',
      placement: 'bottom' as const,
    },
    {
      id: 'cards-section',
      target: '[data-tour="calculadora-card"]',
      title: '🎯 Funcionalidades Principais',
      content: 'Abaixo você encontra cards com acesso direto às três ferramentas principais do sistema. Vamos conhecer cada uma delas!',
      placement: 'top' as const,
    },
    {
      id: 'calculadora-card',
      target: '[data-tour="calculadora-card"]',
      title: '🧮 Calculadora de Correção Monetária',
      content: 'Com esta ferramenta você pode calcular o valor atualizado de montantes do passado usando a correção oficial do IPCA. Essencial para análises financeiras precisas.',
      placement: 'top' as const,
    },
    {
      id: 'series-card',
      target: '[data-tour="series-card"]',
      title: '📊 Série Histórica do IPCA',
      content: 'Acesse a base de dados completa do IPCA. Consulte o valor do índice para qualquer mês e ano, permitindo análises detalhadas e validação de cálculos financeiros.',
      placement: 'top' as const,
    },
    {
      id: 'consulta-card',
      target: '[data-tour="consulta-card"]',
      title: '🔍 Consulta ao Financiamento',
      content: 'Realize buscas detalhadas nos dados de despesas das universidades entre 2002 e 2023. Todos os valores são automaticamente corrigidos pelo IPCA para facilitar comparações.',
      placement: 'top' as const,
    },
    {
      id: 'footer',
      target: 'footer',
      title: '📄 Informações e Links Úteis',
      content: 'No rodapé você encontra informações acadêmicas do projeto, transparência sobre as fontes de dados utilizadas e links úteis como documentação da API e código-fonte.',
      placement: 'top' as const,
    },
    {
      id: 'final',
      target: 'body',
      title: '🎉 Tour Concluído!',
      content: 'Parabéns! Você conheceu todas as principais funcionalidades do SAD-UEPR. Explore o sistema à vontade e não hesite em usar a Central de Ajuda se tiver dúvidas. Você pode refazer este tour a qualquer momento clicando no botão de ajuda no canto inferior esquerdo.',
      placement: 'bottom' as const,
    },
  ];

  const tour = useTour('mainPage', tourSteps);

  // Auto-iniciar tour apenas na primeira visita
  useEffect(() => {
    if (!tour.isTourCompleted && tour.isFirstTimeUser && !tour.isActive) {
      const timer = setTimeout(() => {
        tour.startTour();
      }, 1000); // Aguarda 1 segundo para garantir que a página carregou

      return () => clearTimeout(timer);
    }
  }, [tour.isTourCompleted, tour.isFirstTimeUser, tour.isActive]);

  return tour;
}