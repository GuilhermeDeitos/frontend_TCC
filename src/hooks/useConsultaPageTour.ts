import { useTour } from './useTour';
import { useState, useEffect } from 'react';

// Definir as seções disponíveis do tour
export type ConsultaTourSection = 
  | 'intro'
  | 'formulario'
  | 'carregamento'
  | 'resultados'
  | 'tabela'
  | 'graficos'
  | 'exportacao'
  | 'correcao';

interface TourSection {
  id: ConsultaTourSection;
  title: string;
  icon: string;
  steps: any[];
}

export function useConsultaPageTour() {
  const [currentSection, setCurrentSection] = useState<ConsultaTourSection>('intro');
  const [showSectionMenu, setShowSectionMenu] = useState(false);

  // Definir todas as seções do tour
  const tourSections: TourSection[] = [
    {
      id: 'intro',
      title: 'Introdução',
      icon: '👋',
      steps: [
        {
          id: 'welcome',
          target: 'body',
          title: '🔍 Bem-vindo à Consulta de Financiamento!',
          content: 'Esta é a funcionalidade principal do SAD-UEPR! Aqui você pode consultar dados financeiros das universidades estaduais do Paraná entre 2002 e 2023, com valores automaticamente corrigidos pelo IPCA.',
          placement: 'bottom' as const,
        },
        {
          id: 'overview',
          target: '[data-tour="title-section"]',
          title: '📊 Visão Geral da Consulta',
          content: 'O sistema permite realizar consultas flexíveis por período, com correção monetária automática. Você pode visualizar os resultados em tabelas ou gráficos interativos e exportar em diversos formatos.',
          placement: 'bottom' as const,
        },
        {
          id: 'sections-info',
          target: 'body',
          title: '🗺️ Navegação do Tour',
          content: 'Este tour está dividido em seções temáticas. Você pode navegar entre elas usando o menu que aparecerá no canto da tela, pular partes ou focar apenas nas funcionalidades que te interessam!',
          placement: 'bottom' as const,
        },
      ]
    },
    {
      id: 'formulario',
      title: 'Formulário de Consulta',
      icon: '📝',
      steps: [
        {
          id: 'form-intro',
          target: '[data-tour="consulta-form"]',
          title: '📝 Formulário de Consulta',
          content: 'Este é o formulário onde você configura os parâmetros da sua consulta. Vamos entender cada campo disponível.',
          placement: 'bottom' as const,
        },
        {
          id: 'tipo-correcao',
          target: '[data-tour="tipo-correcao"]',
          title: '🔄 Tipo de Correção',
          content: 'Escolha entre correção pelo IPCA Mensal (mais preciso) ou IPCA Anual (média do ano). A correção garante que valores de diferentes períodos sejam comparáveis.',
          placement: 'right' as const,
        },
        {
          id: 'ipca-referencia',
          target: '[data-tour="ipca-referencia"]',
          title: '📅 IPCA de Referência',
          content: 'Selecione para qual período você quer trazer os valores. Por exemplo, se escolher "12/2023", todos os valores serão atualizados para dezembro de 2023.',
          placement: 'left' as const,
        },
        {
          id: 'periodo-inicial',
          target: '[data-tour="periodo-inicial"]',
          title: '🗓️ Período Inicial',
          content: 'Defina o mês e ano de início da consulta. Os dados disponíveis vão de 01/2002 até 12/2023.',
          placement: 'right' as const,
        },
        {
          id: 'periodo-final',
          target: '[data-tour="periodo-final"]',
          title: '🗓️ Período Final',
          content: 'Defina o mês e ano final da consulta. O sistema buscará todos os dados entre o período inicial e final escolhidos.',
          placement: 'left' as const,
        },
        {
          id: 'submit-button',
          target: '[data-tour="submit-button"]',
          title: '🚀 Iniciar Consulta',
          content: 'Após preencher todos os campos, clique aqui para iniciar a consulta. Para consultas de múltiplos anos, o processo pode levar alguns minutos.',
          placement: 'top' as const,
        },
      ]
    },
    {
      id: 'carregamento',
      title: 'Indicador de Progresso',
      icon: '⏳',
      steps: [
        {
          id: 'loading-intro',
          target: '[data-tour="loading-indicator"]',
          title: '⏳ Indicador de Progresso',
          content: 'Durante consultas longas, este indicador mostra o progresso em tempo real. Você pode acompanhar quantos anos e registros já foram processados.',
          placement: 'center' as const,
          condition: () => !!document.querySelector('[data-tour="loading-indicator"]'),
        },
        {
          id: 'progress-bar',
          target: '[data-tour="progress-bar"]',
          title: '📊 Barra de Progresso',
          content: 'A barra mostra visualmente o percentual de conclusão da consulta. Cada ano processado atualiza o progresso.',
          placement: 'bottom' as const,
          condition: () => !!document.querySelector('[data-tour="progress-bar"]'),
        },
        {
          id: 'stats-display',
          target: '[data-tour="stats-display"]',
          title: '📈 Estatísticas em Tempo Real',
          content: 'Acompanhe quantos anos e registros já foram processados. Isso ajuda a estimar quanto tempo falta para completar a consulta.',
          placement: 'bottom' as const,
          condition: () => !!document.querySelector('[data-tour="stats-display"]'),
        },
        {
          id: 'cancel-button',
          target: '[data-tour="cancel-button"]',
          title: '❌ Cancelar Consulta',
          content: 'Se necessário, você pode cancelar a consulta a qualquer momento. Os dados já processados serão mantidos e estarão disponíveis para análise.',
          placement: 'top' as const,
          condition: () => !!document.querySelector('[data-tour="cancel-button"]'),
        },
      ]
    },
    {
      id: 'resultados',
      title: 'Área de Resultados',
      icon: '📋',
      steps: [
        {
          id: 'results-intro',
          target: '[data-tour="results-viewer"]',
          title: '📋 Área de Resultados',
          content: 'Após a consulta, os dados aparecem aqui. Você pode alternar entre visualização em tabela ou gráficos, e aplicar diversos filtros.',
          placement: 'top' as const,
          condition: () => !!document.querySelector('[data-tour="results-viewer"]'),
        },
        {
          id: 'view-toggle',
          target: '[data-tour="view-toggle"]',
          title: '🔀 Alternar Visualização',
          content: 'Escolha entre visualizar os dados em formato de tabela (detalhado) ou gráficos (visual). Cada formato tem suas vantagens dependendo da análise.',
          placement: 'bottom' as const,
          condition: () => !!document.querySelector('[data-tour="view-toggle"]'),
        },
        {
          id: 'correcao-info',
          target: '[data-tour="correcao-info"]',
          title: '💰 Informações de Correção',
          content: 'Esta área mostra para qual período os valores foram corrigidos. Clique em "Detalhes da Correção" para ver os fatores aplicados a cada ano.',
          placement: 'top' as const,
          condition: () => !!document.querySelector('[data-tour="correcao-info"]'),
        },
      ]
    },
    {
      id: 'tabela',
      title: 'Visualização em Tabela',
      icon: '📊',
      steps: [
        {
          id: 'table-intro',
          target: '[data-tour="table-view"]',
          title: '📊 Tabela de Dados',
          content: 'A visualização em tabela mostra todos os detalhes dos dados consultados. Cada linha representa um registro financeiro de uma universidade.',
          placement: 'top' as const,
          condition: () => !!document.querySelector('[data-tour="table-view"]'),
        },
        {
          id: 'table-columns',
          target: '[data-tour="table-header"]',
          title: '📑 Colunas da Tabela',
          content: 'As colunas mostram: Universidade, Ano, Função, Grupo de Natureza, Origem de Recursos e diversos campos financeiros. Clique nos cabeçalhos para ordenar!',
          placement: 'bottom' as const,
          condition: () => !!document.querySelector('[data-tour="table-header"]'),
        },
        {
          id: 'table-filters',
          target: '[data-tour="table-filters"]',
          title: '🔍 Filtros da Tabela',
          content: 'Use estes filtros para refinar os dados exibidos. Você pode filtrar por ano, universidade, função, grupo de natureza e origem de recursos.',
          placement: 'bottom' as const,
          condition: () => !!document.querySelector('[data-tour="table-filters"]'),
        },
        {
          id: 'table-pagination',
          target: '[data-tour="table-pagination"]',
          title: '📄 Paginação',
          content: 'Os dados são divididos em páginas para melhor performance. Use os controles para navegar entre as páginas de resultados.',
          placement: 'top' as const,
          condition: () => !!document.querySelector('[data-tour="table-pagination"]'),
        },
      ]
    },
    {
      id: 'graficos',
      title: 'Gráficos Interativos',
      icon: '📈',
      steps: [
        {
          id: 'charts-intro',
          target: '[data-tour="chart-view"]',
          title: '📈 Visualização em Gráficos',
          content: 'Os gráficos oferecem uma visão visual dos dados, facilitando comparações e identificação de tendências.',
          placement: 'top' as const,
          condition: () => !!document.querySelector('[data-tour="chart-view"]'),
        },
        {
          id: 'comparison-type',
          target: '[data-tour="comparison-type"]',
          title: '🔄 Tipo de Comparação',
          content: 'Escolha o que deseja comparar: universidades entre si, diferentes anos, ou a evolução anual de cada instituição.',
          placement: 'bottom' as const,
          condition: () => !!document.querySelector('[data-tour="comparison-type"]'),
        },
        {
          id: 'field-selector',
          target: '[data-tour="field-selector"]',
          title: '💰 Campo de Comparação',
          content: 'Selecione qual campo financeiro deseja analisar: Orçamento LOA, Empenhado, Liquidado, Pago, entre outros.',
          placement: 'bottom' as const,
          condition: () => !!document.querySelector('[data-tour="field-selector"]'),
        },
        {
          id: 'chart-type',
          target: '[data-tour="chart-type"]',
          title: '📊 Tipo de Gráfico',
          content: 'Escolha entre gráficos de Barras, Linhas, Pizza ou Área. Cada tipo é mais adequado para diferentes análises.',
          placement: 'bottom' as const,
          condition: () => !!document.querySelector('[data-tour="chart-type"]'),
        },
        {
          id: 'chart-customization',
          target: '[data-tour="chart-customization"]',
          title: '🎨 Personalização',
          content: 'Personalize o gráfico: altere o esquema de cores, altura, exiba valores nos gráficos e exporte em diferentes formatos (PNG, JPG, SVG).',
          placement: 'bottom' as const,
          condition: () => !!document.querySelector('[data-tour="chart-customization"]'),
        },
      ]
    },
    {
      id: 'exportacao',
      title: 'Exportação de Dados',
      icon: '💾',
      steps: [
        {
          id: 'export-intro',
          target: '[data-tour="export-button"]',
          title: '💾 Exportar Dados',
          content: 'Você pode exportar os resultados da consulta em diversos formatos: Excel (XLSX), PDF, CSV ou JSON.',
          placement: 'left' as const,
          condition: () => !!document.querySelector('[data-tour="export-button"]'),
        },
        {
          id: 'export-dialog',
          target: '[data-tour="export-dialog"]',
          title: '⚙️ Opções de Exportação',
          content: 'Personalize sua exportação: escolha o formato, selecione quais colunas incluir, adicione título e subtítulo, e configure detalhes específicos de cada formato.',
          placement: 'center' as const,
          condition: () => !!document.querySelector('[data-tour="export-dialog"]'),
        },
        {
          id: 'export-formats',
          target: '[data-tour="export-formats"]',
          title: '📄 Formatos Disponíveis',
          content: 'XLSX: ideal para análises no Excel. PDF: melhor para impressão e apresentações. CSV: compatível com diversos sistemas. JSON: para uso programático.',
          placement: 'right' as const,
          condition: () => !!document.querySelector('[data-tour="export-formats"]'),
        },
        {
          id: 'export-columns',
          target: '[data-tour="export-columns"]',
          title: '📋 Seleção de Colunas',
          content: 'Escolha quais colunas deseja incluir na exportação. Isso permite criar relatórios focados apenas nos dados que você precisa.',
          placement: 'left' as const,
          condition: () => !!document.querySelector('[data-tour="export-columns"]'),
        },
      ]
    },
    {
      id: 'correcao',
      title: 'Correção Monetária',
      icon: '💰',
      steps: [
        {
          id: 'correction-intro',
          target: '[data-tour="correcao-info"]',
          title: '💰 Correção Monetária',
          content: 'Todos os valores são automaticamente corrigidos pelo IPCA para garantir comparações justas entre diferentes períodos.',
          placement: 'top' as const,
          condition: () => !!document.querySelector('[data-tour="correcao-info"]'),
        },
        {
          id: 'correction-details-button',
          target: '[data-tour="correction-details-button"]',
          title: 'ℹ️ Detalhes da Correção',
          content: 'Clique neste botão para ver os fatores de correção aplicados a cada ano, índices IPCA utilizados e informações detalhadas sobre o cálculo.',
          placement: 'left' as const,
          condition: () => !!document.querySelector('[data-tour="correction-details-button"]'),
        },
        {
          id: 'correction-modal',
          target: '[data-tour="correction-modal"]',
          title: '📊 Modal de Detalhes',
          content: 'Este modal mostra uma tabela completa com: ano, fator de correção, IPCA do período e IPCA de referência. Essencial para validar os cálculos!',
          placement: 'center' as const,
          condition: () => !!document.querySelector('[data-tour="correction-modal"]'),
        },
        {
          id: 'correction-interpretation',
          target: '[data-tour="correction-interpretation"]',
          title: '📖 Como Interpretar',
          content: 'Um fator de 2.5, por exemplo, significa que o valor original deve ser multiplicado por 2.5 para equivaler ao valor na data de referência. Quanto mais antigo o ano, maior o fator.',
          placement: 'bottom' as const,
          condition: () => !!document.querySelector('[data-tour="correction-interpretation"]'),
        },
      ]
    },
  ];

  // Obter passos da seção atual
  const getCurrentSteps = () => {
    const section = tourSections.find(s => s.id === currentSection);
    return section ? section.steps : [];
  };

  // Usar o hook useTour com os passos da seção atual
  const tour = useTour(`consulta_${currentSection}`, getCurrentSteps());

  // Função para mudar de seção
  const goToSection = (sectionId: ConsultaTourSection) => {
    setCurrentSection(sectionId);
    setShowSectionMenu(false);
    // Reiniciar o tour da nova seção
    setTimeout(() => {
      tour.startTour();
    }, 300);
  };

  // Função para ir para próxima seção
  const nextSection = () => {
    const currentIndex = tourSections.findIndex(s => s.id === currentSection);
    if (currentIndex < tourSections.length - 1) {
      goToSection(tourSections[currentIndex + 1].id);
    }
  };

  // Função para ir para seção anterior
  const previousSection = () => {
    const currentIndex = tourSections.findIndex(s => s.id === currentSection);
    if (currentIndex > 0) {
      goToSection(tourSections[currentIndex - 1].id);
    }
  };

  // Auto-iniciar tour apenas na primeira visita
  useEffect(() => {
    if (!tour.isTourCompleted && !tour.isActive) {
      const timer = setTimeout(() => {
        tour.startTour();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [tour.isTourCompleted, tour.isActive, currentSection]);

  return {
    ...tour,
    currentSection,
    tourSections,
    showSectionMenu,
    setShowSectionMenu,
    goToSection,
    nextSection,
    previousSection,
  };
}