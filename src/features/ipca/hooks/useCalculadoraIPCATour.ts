import { useTour } from '@shared/hooks/useTour';
import { useEffect } from 'react';

export function useCalculadoraIPCATour() {
  const tourSteps = [
    {
      id: 'welcome',
      target: 'body',
      title: '🧮 Bem-vindo à Calculadora IPCA!',
      content: 'Esta ferramenta corrige valores monetários pela inflação oficial (IPCA). Vamos mostrar rapidamente os recursos principais e algumas informações importantes.',
      placement: 'bottom' as const,
    },
    {
      id: 'title-section',
      target: '[data-tour="title-section"]',
      title: '📊 Correção Monetária pelo IPCA',
      content: 'Utiliza os índices oficiais do IPCA (IBGE) para atualizar valores entre dezembro/1979 e dois meses antes da data atual (devido ao delay na divulgação oficial).',
      placement: 'bottom' as const,
    },
    {
      id: 'data-inicial',
      target: '[data-tour="data-inicial"]',
      title: '📅 Período Inicial',
      content: 'Selecione a data de referência do valor original (quando o valor foi registrado). Esta é a data "de onde" você quer corrigir.',
      placement: 'right' as const,
    },
    {
      id: 'data-final',
      target: '[data-tour="data-final"]',
      title: '🎯 Período Final',
      content: 'Selecione a data para qual você quer atualizar o valor. Esta é a data "para onde" você quer trazer o valor. Use o mês/ano mais recente disponível para valores atuais.',
      placement: 'right' as const,
    },
    {
      id: 'resultado-section',
      target: '[data-tour="resultado-section"]',
      title: '📈 Interpretando o Resultado',
      content: 'O resultado mostra: valor corrigido em reais, variação monetária absoluta e percentual, além dos índices IPCA usados no cálculo e a inflação total do período.',
      placement: 'top' as const,
      condition: () => !!document.querySelector('[data-tour="resultado-section"]'),
    },
    {
      id: 'restrictions',
      target: 'body',
      title: '⚠️ Restrições Importantes',
      content: '1) Para 1979, apenas dezembro está disponível\n2) O IPCA mais recente é de 2 meses atrás\n3) A data inicial deve ser anterior à data final\n4) Todos os valores devem ser positivos',
      placement: 'bottom' as const,
    },
    {
      id: 'final',
      target: 'body',
      title: '🎉 Tour Concluído!',
      content: 'Agora você sabe como usar a calculadora! Use-a para comparar valores de diferentes períodos considerando a inflação oficial. Você pode refazer este tour a qualquer momento.',
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