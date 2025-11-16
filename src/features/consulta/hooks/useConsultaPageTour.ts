import { useTour } from "@shared/hooks/useTour";
import { useMemo } from "react";

export function useConsultaPageTour() {
  // Tour de introdução e formulário (enxuto)
  const tourIntroSteps = useMemo(() => [
    {
      id: "welcome",
      target: "body",
      title: "🔍 Bem-vindo à Consulta de Financiamento!",
      content:
        "Esta é a funcionalidade principal do SAD-UEPR! Aqui você pode consultar dados financeiros das universidades estaduais do Paraná entre 2002 e 2023, com valores corrigidos automaticamente pelo IPCA.",
      placement: "bottom" as const,
    },
    {
      id: "overview",
      target: '[data-tour="title-section"]',
      title: "📊 Visão Geral",
      content:
        "O sistema permite consultas flexíveis por período, com correção monetária automática. Você pode visualizar os resultados em tabelas ou gráficos interativos e exportar em diversos formatos.",
      placement: "bottom" as const,
    },
    {
      id: "form-intro",
      target: '[data-tour="consulta-form"]',
      title: "📝 Formulário de Consulta",
      content:
        "Configure os parâmetros da sua consulta: escolha o tipo de correção (mensal ou anual), o período de referência e o intervalo de datas que deseja consultar.",
      placement: "bottom" as const,
    },
    {
      id: "tipo-correcao",
      target: '[data-tour="tipo-correcao"]',
      title: "🔄 Tipo de Correção",
      content:
        "Escolha entre IPCA Mensal (mais preciso) ou IPCA Anual (média do ano). A correção garante que valores de diferentes períodos sejam comparáveis.",
      placement: "right" as const,
    },
    {
      id: "ipca-referencia",
      target: '[data-tour="ipca-referencia"]',
      title: "📅 IPCA de Referência",
      content:
        "Selecione para qual período você quer trazer os valores. Ex: se escolher '12/2023', todos os valores serão atualizados para dezembro de 2023.",
      placement: "left" as const,
    },
    {
      id: "periodos",
      target: '[data-tour="periodo-inicial"]',
      title: "🗓️ Período da Consulta",
      content:
        "Defina o intervalo de datas (início e fim) para sua consulta. Os dados disponíveis vão de 01/2002 até 12/2023.",
      placement: "right" as const,
    },
    {
      id: "submit-button",
      target: '[data-tour="submit-button"]',
      title: "🚀 Iniciar Consulta",
      content:
        "Após preencher todos os campos, clique aqui para iniciar a consulta. Para consultas de múltiplos anos, o processo pode levar alguns minutos.",
      placement: "top" as const,
    },
  ], []);

  const tourIntro = useTour("consulta_intro", tourIntroSteps);

  return {
    tourIntro,
  };
}