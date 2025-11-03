import { useTour } from './useTour';
import { useEffect } from 'react';

export function useSeriesIPCATour() {
  const tourSteps = [
    {
      id: 'welcome',
      target: 'body',
      title: '📊 Bem-vindo à Série Histórica do IPCA!',
      content: 'Aqui você pode consultar todos os valores históricos do IPCA (Índice Nacional de Preços ao Consumidor Amplo) desde dezembro de 1979. Esta é a base de dados oficial usada para todas as correções monetárias do sistema.',
      placement: 'bottom' as const,
    },
    {
      id: 'title-section',
      target: '[data-tour="title-section"]',
      title: '📈 Série Histórica Completa',
      content: 'Esta página apresenta a tabela completa com todos os índices IPCA disponíveis, mês a mês. Os dados são obtidos diretamente do IPEA (Instituto de Pesquisa Econômica Aplicada) e atualizados regularmente.',
      placement: 'bottom' as const,
    },
    {
      id: 'filter-section',
      target: '[data-tour="filter-section"]',
      title: '🔍 Filtros de Pesquisa',
      content: 'Use estes filtros para encontrar rapidamente o índice IPCA que você procura. Você pode filtrar por ano específico ou por mês/ano para consultas mais precisas.',
      placement: 'bottom' as const,
      condition: () => !!document.querySelector('[data-tour="filter-section"]'),
    },
    {
      id: 'filter-type',
      target: '[data-tour="filter-type"]',
      title: '📋 Tipo de Filtro',
      content: 'Escolha como deseja filtrar os dados: visualizar todos os períodos, filtrar por um ano específico ou buscar um mês/ano exato.',
      placement: 'left' as const,
      condition: () => !!document.querySelector('[data-tour="filter-type"]'),
    },
    {
      id: 'table-header',
      target: '[data-tour="table-header"]',
      title: '📑 Cabeçalhos da Tabela',
      content: 'A tabela possui duas colunas principais: Data (formato MM/AAAA) e Valor (o índice IPCA daquele período). Clique nos cabeçalhos para ordenar os dados de forma crescente ou decrescente.',
      placement: 'bottom' as const,
      condition: () => !!document.querySelector('[data-tour="table-header"]'),
    },
    {
      id: 'sort-feature',
      target: '[data-tour="table-header"]',
      title: '🔄 Ordenação',
      content: 'Clique em qualquer cabeçalho de coluna para ordenar os dados. Uma seta verde indica ordenação crescente, e uma seta vermelha indica decrescente. Clique novamente para inverter a ordem.',
      placement: 'bottom' as const,
      condition: () => !!document.querySelector('[data-tour="table-header"]'),
    },
    {
      id: 'table-data',
      target: '[data-tour="table-data"]',
      title: '📊 Dados do IPCA',
      content: 'Cada linha representa um mês específico com seu respectivo índice IPCA. Estes valores são usados pela Calculadora de Correção Monetária para atualizar valores históricos.',
      placement: 'top' as const,
      condition: () => !!document.querySelector('[data-tour="table-data"]'),
    },
    {
      id: 'pagination',
      target: '[data-tour="pagination"]',
      title: '📄 Paginação',
      content: 'Os dados estão divididos em páginas para facilitar a navegação. Use os botões "Anterior" e "Próximo" ou clique diretamente no número da página desejada.',
      placement: 'top' as const,
      condition: () => !!document.querySelector('[data-tour="pagination"]'),
    },
    {
      id: 'records-info',
      target: '[data-tour="records-info"]',
      title: 'ℹ️ Informações dos Registros',
      content: 'Aqui você vê quantos registros estão sendo exibidos na página atual e o total de registros disponíveis (considerando os filtros aplicados).',
      placement: 'bottom' as const,
      condition: () => !!document.querySelector('[data-tour="records-info"]'),
    },
    {
      id: 'usage-tip',
      target: 'body',
      title: '💡 Dica de Uso',
      content: 'Você pode usar esta tabela para: 1) Validar cálculos da Calculadora IPCA; 2) Pesquisar o índice de um período específico; 3) Analisar a evolução histórica da inflação no Brasil.',
      placement: 'bottom' as const,
    },
    {
      id: 'final',
      target: 'body',
      title: '🎉 Tour das Séries IPCA Concluído!',
      content: 'Agora você sabe como consultar a série histórica completa do IPCA! Esta base de dados é fundamental para garantir a precisão de todas as correções monetárias realizadas no SAD-UEPR.',
      placement: 'bottom' as const,
    },
  ];

  const tour = useTour('seriesIPCA', tourSteps);

  // Auto-iniciar tour apenas na primeira visita e quando os dados carregarem
  useEffect(() => {
    if (!tour.isTourCompleted && !tour.isActive) {
      // Aguardar um pouco mais para garantir que os dados carregaram
      const timer = setTimeout(() => {
        // Verificar se os dados foram carregados checando se a tabela existe
        const tableExists = document.querySelector('[data-tour="table-data"]');
        if (tableExists) {
          tour.startTour();
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [tour.isTourCompleted, tour.isActive]);

  return tour;
}