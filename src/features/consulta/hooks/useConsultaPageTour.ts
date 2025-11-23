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
        "Esta é a funcionalidade principal do SAD-UEPR! Consulte dados financeiros das universidades estaduais do Paraná (2002-2023) com valores corrigidos automaticamente pelo IPCA.",
      placement: "bottom" as const,
    },
    {
      id: "tipo-correcao",
      target: '[data-tour="tipo-correcao"]',
      title: "📊 Tipo de Correção",
      content:
        "IPCA Mensal é mais preciso (mês a mês). IPCA Anual usa a média do ano. A correção garante que valores de diferentes períodos sejam comparáveis considerando a inflação.",
      placement: "right" as const,
    },
    {
      id: "ipca-referencia",
      target: '[data-tour="ipca-referencia"]',
      title: "🎯 Período de Referência",
      content:
        "Escolha PARA QUANDO atualizar os valores. Ex: 12/2023 = todos os valores trazidos para dezembro de 2023. Use o período mais recente para valores atuais.",
      placement: "left" as const,
    },
    {
      id: "periodos",
      target: '[data-tour="periodo-inicial"]',
      title: "📅 Atenção ao Período",
      content:
        "Defina DE ONDE até ONDE consultar (01/2002 a 12/2023). Para múltiplos anos, a consulta pode demorar alguns minutos. Você pode cancelar durante o processo.",
      placement: "right" as const,
    },
  ], []);

  const tourIntro = useTour("consulta_intro", tourIntroSteps);

  return {
    tourIntro,
  };
}