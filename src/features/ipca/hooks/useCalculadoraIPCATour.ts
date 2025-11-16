import { useTour } from '@shared/hooks/useTour';
import { useEffect } from 'react';

export function useCalculadoraIPCATour() {
  const tourSteps = [
    {
      id: 'welcome',
      target: 'body',
      title: '🧮 Bem-vindo à Calculadora IPCA!',
      content: 'Esta é a ferramenta de correção monetária do SAD-UEPR. Aqui você pode atualizar valores do passado considerando a inflação oficial medida pelo IPCA. Vamos conhecer como usar a calculadora!',
      placement: 'bottom' as const,
    },
    {
      id: 'title-section',
      target: '[data-tour="title-section"]',
      title: '📊 Calculadora de Correção Monetária',
      content: 'Esta calculadora utiliza os índices oficiais do IPCA (Índice Nacional de Preços ao Consumidor Amplo) do IBGE para corrigir valores monetários entre dezembro de 1979 e dois meses antes da data atual.',
      placement: 'bottom' as const,
    },
    {
      id: 'formula-explanation',
      target: '[data-tour="formula-explanation"]',
      title: '📐 Entendendo a Fórmula',
      content: 'A correção monetária utiliza uma fórmula simples: Valor Corrigido = Valor Inicial × (IPCA Final ÷ IPCA Inicial). Isso significa que o valor original é multiplicado pela variação do índice entre as duas datas.',
      placement: 'bottom' as const,
    },
    {
      id: 'valor-field',
      target: '[data-tour="valor-field"]',
      title: '💰 Valor Original',
      content: 'Insira aqui o valor monetário que você deseja corrigir. Por exemplo, se você quer saber quanto valia R$ 1.000,00 de 2010 em valores de hoje, digite 1000.',
      placement: 'right' as const,
    },
    {
      id: 'data-inicial',
      target: '[data-tour="data-inicial"]',
      title: '📅 Data Inicial',
      content: 'Selecione o mês e ano de referência do valor original. Esta é a data "de onde" você quer corrigir o valor. Exemplo: se o valor é de janeiro de 2010, selecione 01/2010.',
      placement: 'right' as const,
    },
    {
      id: 'mes-inicial',
      target: '[data-tour="mes-inicial"]',
      title: '📆 Mês Inicial',
      content: 'Escolha o mês de referência inicial. O sistema usa os índices IPCA oficiais do IBGE para esse mês.',
      placement: 'right' as const,
    },
    {
      id: 'ano-inicial',
      target: '[data-tour="ano-inicial"]',
      title: '📅 Ano Inicial',
      content: 'Selecione o ano inicial. Você pode escolher qualquer ano desde 1979 (apenas dezembro) até dois meses antes da data atual.',
      placement: 'right' as const,
    },
    {
      id: 'data-final',
      target: '[data-tour="data-final"]',
      title: '🎯 Data Final',
      content: 'Selecione o mês e ano para o qual você quer corrigir o valor. Esta é a data "para onde" você quer trazer o valor. Exemplo: para valores atualizados até hoje, selecione o mês/ano mais recente disponível.',
      placement: 'right' as const,
    },
    {
      id: 'mes-final',
      target: '[data-tour="mes-final"]',
      title: '📆 Mês Final',
      content: 'Escolha o mês final da correção. O IPCA é calculado mensalmente, então você pode ser bem preciso na correção.',
      placement: 'right' as const,
    },
    {
      id: 'ano-final',
      target: '[data-tour="ano-final"]',
      title: '📅 Ano Final',
      content: 'Selecione o ano final. Lembre-se que o IPCA só está disponível até dois meses antes da data atual, pois há um delay na divulgação oficial.',
      placement: 'right' as const,
    },
    {
      id: 'submit-button',
      target: '[data-tour="submit-button"]',
      title: '🚀 Calcular Correção',
      content: 'Após preencher todos os campos, clique aqui para calcular a correção monetária. O sistema buscará os índices IPCA correspondentes e aplicará a fórmula automaticamente.',
      placement: 'top' as const,
    },
    {
      id: 'resultado-section',
      target: '[data-tour="resultado-section"]',
      title: '📈 Resultado da Correção',
      content: 'Aqui aparecerá o resultado após o cálculo. Você verá o valor corrigido em reais e a taxa IPCA aproximada do período. Isso te ajuda a entender quanto a inflação impactou o valor original.',
      placement: 'top' as const,
      condition: () => !!document.querySelector('[data-tour="resultado-section"]'),
    },
    {
      id: 'restrictions',
      target: 'body',
      title: '⚠️ Restrições Importantes',
      content: 'Atenção: 1) Para 1979, apenas dezembro está disponível; 2) O IPCA mais recente disponível é de dois meses atrás (devido ao delay de divulgação oficial); 3) Todos os valores devem ser positivos.',
      placement: 'bottom' as const,
    },
    {
      id: 'final',
      target: 'body',
      title: '🎉 Tour da Calculadora Concluído!',
      content: 'Agora você sabe como usar a Calculadora de Correção Monetária! Essa ferramenta é essencial para comparar valores de diferentes períodos de forma justa. Use-a sempre que precisar atualizar valores históricos pela inflação oficial.',
      placement: 'bottom' as const,
    },
  ];

  const tour = useTour('calculadoraIPCA', tourSteps);

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