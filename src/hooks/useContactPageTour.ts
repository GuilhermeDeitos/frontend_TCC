import { useTour } from './useTour';
import { useEffect } from 'react';

export function useContactPageTour() {
  const tourSteps = [
    {
      id: 'welcome',
      target: 'body',
      title: '✉️ Bem-vindo à Página de Contato!',
      content: 'Esta é a página onde você pode enviar suas dúvidas, sugestões ou feedback sobre o SAD-UEPR. Vamos conhecer como usar o formulário de contato.',
      placement: 'bottom' as const,
    },
    {
      id: 'title-section',
      target: '[data-tour="title-section"]',
      title: '📬 Entre em Contato',
      content: 'Aqui você pode se comunicar diretamente com a equipe do SAD-UEPR. Todas as mensagens são lidas e respondidas em até 48 horas.',
      placement: 'bottom' as const,
    },
    {
      id: 'contact-form',
      target: '[data-tour="contact-form"]',
      title: '📝 Formulário de Contato',
      content: 'Este é o formulário principal para enviar sua mensagem. Preencha todos os campos obrigatórios para que possamos entrar em contato com você.',
      placement: 'right' as const,
    },
    {
      id: 'name-field',
      target: '[data-tour="name-field"]',
      title: '👤 Nome Completo',
      content: 'Digite seu nome completo. Isso nos ajuda a personalizar a resposta e identificar quem está entrando em contato.',
      placement: 'right' as const,
    },
    {
      id: 'email-field',
      target: '[data-tour="email-field"]',
      title: '📧 E-mail',
      content: 'Informe um e-mail válido. É por ele que enviaremos nossa resposta. Certifique-se de que está correto para não perder nosso retorno!',
      placement: 'right' as const,
    },
    {
      id: 'message-field',
      target: '[data-tour="message-field"]',
      title: '💬 Sua Mensagem',
      content: 'Escreva aqui sua dúvida, sugestão ou feedback. Seja o mais detalhado possível para que possamos entender melhor sua necessidade e fornecer uma resposta adequada.',
      placement: 'right' as const,
    },
    {
      id: 'submit-button',
      target: '[data-tour="submit-button"]',
      title: '📤 Enviar Mensagem',
      content: 'Após preencher todos os campos, clique neste botão para enviar sua mensagem. Você receberá uma confirmação na tela quando o envio for bem-sucedido.',
      placement: 'top' as const,
    },
    {
      id: 'alternative-contacts',
      target: '[data-tour="alternative-contacts"]',
      title: '📞 Outras Formas de Contato',
      content: 'Além do formulário, você também pode nos contatar diretamente por e-mail. Aqui você encontra informações sobre tempo de resposta e nossa localização institucional.',
      placement: 'top' as const,
    },
    {
      id: 'final',
      target: 'body',
      title: '🎉 Tour de Contato Concluído!',
      content: 'Agora você sabe como enviar mensagens para a equipe do SAD-UEPR! Fique à vontade para entrar em contato sempre que tiver dúvidas, sugestões ou feedback. Respondemos todas as mensagens em até 48 horas.',
      placement: 'bottom' as const,
    },
  ];

  const tour = useTour('contactPage', tourSteps);

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