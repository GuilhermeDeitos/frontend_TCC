import { Header } from "@shared/components/Layout/Header";
import { Footer } from "@shared/components/Layout/Footer";
import { BlueTitleCard } from "@shared/components/UI/BlueTitleCard";
import { InputField } from "@shared/components/UI/Input";
import { TourGuide } from "@shared/components/tour/TourGuide";
import { TourRestartButton } from "@shared/components/tour/TourRestartButton";
import { useContactPageTour } from "../../hooks/useContactPageTour";
import { useState } from "react";
import Swal from 'sweetalert2'
import api from "@shared/utils/api";
import { TextareaField } from "@/shared/components/UI/TextArea";
import { Form } from "@/shared/components/UI/Form";
import { AxiosError } from "axios";

interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface ErrorResponse {
  detail: ValidationError[] | string;
  message?: string;
}

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const tour = useContactPageTour();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Atualizar contador de caracteres para mensagem
    if (name === 'message') {
      setCharCount(value.length);
    }
  };

  const getFieldNameInPortuguese = (field: string): string => {
    const fieldMap: Record<string, string> = {
      'name': 'Nome',
      'email': 'E-mail',
      'message': 'Mensagem'
    };
    return fieldMap[field] || field;
  };

  const formatValidationErrors = (errors: ValidationError[]): string => {
    return errors.map(error => {
      const field = error.loc[error.loc.length - 1];
      const fieldName = getFieldNameInPortuguese(String(field));
      
      // Traduzir mensagens comuns
      let message = error.msg;
      
      if (message.includes('field required')) {
        message = 'é obrigatório';
      } else if (message.includes('value is not a valid email')) {
        message = 'deve ser um e-mail válido (ex: seu@email.com)';
      } else if (message.includes('at least')) {
        const match = message.match(/at least (\d+)/);
        if (match) {
          message = `deve ter no mínimo ${match[1]} caracteres`;
        }
      } else if (message.includes('at most')) {
        const match = message.match(/at most (\d+)/);
        if (match) {
          message = `deve ter no máximo ${match[1]} caracteres`;
        }
      }
      
      return `• ${fieldName}: ${message}`;
    }).join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação local antes de enviar
    const localErrors: string[] = [];
    
    if (!formData.name.trim()) {
      localErrors.push('• Nome é obrigatório');
    } else if (formData.name.trim().length < 2) {
      localErrors.push('• Nome deve ter no mínimo 2 caracteres');
    } else if (formData.name.trim().length > 100) {
      localErrors.push('• Nome deve ter no máximo 100 caracteres');
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.name)) {
      localErrors.push('• Nome deve conter apenas letras, espaços, hífens e apóstrofos');
    }
    
    if (!formData.email.trim()) {
      localErrors.push('• E-mail é obrigatório');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      localErrors.push('• E-mail deve ser válido (ex: seu@email.com)');
    }
    
    if (!formData.message.trim()) {
      localErrors.push('• Mensagem é obrigatória');
    } else if (formData.message.trim().length < 10) {
      localErrors.push('• Mensagem deve ter no mínimo 10 caracteres');
    } else if (formData.message.trim().length > 5000) {
      localErrors.push('• Mensagem deve ter no máximo 5000 caracteres');
    } else {
      // Verificar quantidade de links
      const urlRegex = /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g;
      const urls = formData.message.match(urlRegex) || [];
      if (urls.length > 3) {
        localErrors.push('• Mensagem deve conter no máximo 3 links');
      }
    }
    
    if (localErrors.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Verifique os dados do formulário',
        html: `<div style="text-align: left; white-space: pre-line;">${localErrors.join('\n')}</div>`,
        confirmButtonText: 'Entendi',
        confirmButtonColor: '#2563eb'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await api.post('/email/contact', formData);
      
      await Swal.fire({
        icon: 'success',
        title: 'Mensagem enviada com sucesso!',
        text: 'Agradecemos seu contato e retornaremos em breve (até 48 horas).',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981'
      });
      
      setFormData({ name: '', email: '', message: '' });
      setCharCount(0);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      const axiosError = error as AxiosError<ErrorResponse>;
      const status = axiosError.response?.status;
      const data = axiosError.response?.data;
      
      let title = 'Erro ao enviar mensagem';
      let message = 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.';
      let icon: 'error' | 'warning' | 'info' = 'error';
      
      if (status === 422) {
        // Erro de validação
        icon = 'warning';
        title = 'Dados inválidos';
        
        if (data?.detail && Array.isArray(data.detail)) {
          const formattedErrors = formatValidationErrors(data.detail);
          message = `Por favor, corrija os seguintes erros:\n\n${formattedErrors}`;
        } else if (typeof data?.detail === 'string') {
          message = data.detail;
        } else {
          message = 'Verifique se todos os campos estão preenchidos corretamente:\n\n' +
                   '• Nome: 2-100 caracteres, apenas letras\n' +
                   '• E-mail: formato válido (ex: seu@email.com)\n' +
                   '• Mensagem: 10-5000 caracteres, máximo 3 links';
        }
      } else if (status === 400) {
        // Bad Request
        icon = 'warning';
        title = 'Requisição inválida';
        message = typeof data?.detail === 'string' 
          ? data.detail 
          : 'Os dados enviados estão em formato incorreto. Verifique e tente novamente.';
      } else if (status === 500) {
        // Erro interno do servidor
        icon = 'error';
        title = 'Erro no servidor de e-mail';
        message = typeof data?.detail === 'string'
          ? data.detail
          : 'Ocorreu um erro ao processar seu e-mail. Por favor, tente novamente ou entre em contato diretamente pelo e-mail: guilherme.cascavel@gmail.com';
      } else if (status === 503) {
        // Serviço indisponível
        icon = 'info';
        title = 'Serviço temporariamente indisponível';
        message = typeof data?.detail === 'string'
          ? data.detail
          : 'O serviço de e-mail está temporariamente indisponível. Por favor, tente novamente em alguns minutos ou entre em contato diretamente: guilherme.cascavel@gmail.com';
      } else if (!axiosError.response) {
        // Erro de rede
        icon = 'error';
        title = 'Erro de conexão';
        message = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.';
      }
      
      Swal.fire({
        icon,
        title,
        html: `<div style="text-align: left; white-space: pre-line;">${message}</div>`,
        confirmButtonText: 'Entendi',
        confirmButtonColor: '#2563eb',
        footer: status === 500 || status === 503 
          ? '<a href="mailto:guilherme.cascavel@gmail.com" style="color: #2563eb;">Enviar e-mail diretamente</a>'
          : undefined
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div data-tour="title-section">
        <BlueTitleCard
          title="Entre em Contato"
          subtitle="Tem dúvidas, sugestões ou feedback sobre o SAD-UEPR? Estamos aqui para ajudar e ouvir você."
        />
      </div>

      <div className="flex-grow bg-gray-50 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-tour="contact-form">
            <Form
              title="Envie sua Mensagem"
              subtitle="Preencha o formulário abaixo e retornaremos o contato em breve."
              onSubmit={handleSubmit}
              submitButtonText="Enviar Mensagem"
              isLoading={isLoading}
            >
              <div data-tour="name-field">
                <InputField
                  id="name"
                  name="name"
                  type="text"
                  label="Nome Completo"
                  placeholder="Digite seu nome completo"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  helperText="2-100 caracteres, apenas letras, espaços, hífens e apóstrofos"
                />
              </div>

              <div data-tour="email-field">
                <InputField
                  id="email"
                  name="email"
                  type="email"
                  label="E-mail"
                  placeholder="seu.email@exemplo.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  helperText="Formato válido: usuario@dominio.com"
                />
              </div>

              <div data-tour="message-field">
                <TextareaField
                  id="message"
                  name="message"
                  label="Mensagem"
                  placeholder="Digite sua mensagem, dúvida ou sugestão... (mínimo 10 caracteres)"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isLoading}
                  helperText={
                    <div className="flex justify-between items-center text-xs">
                      <span>10-5000 caracteres, máximo 3 links</span>
                      <span className={`font-medium ${
                        charCount < 10 
                          ? 'text-red-600' 
                          : charCount > 5000 
                            ? 'text-red-600' 
                            : charCount > 4500 
                              ? 'text-yellow-600' 
                              : 'text-green-600'
                      }`}>
                        {charCount}/5000
                      </span>
                    </div>
                  }
                />
              </div>

              {/* Info box com regras */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Regras do formulário:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Nome: apenas letras, espaços, hífens e apóstrofos</li>
                      <li>E-mail: deve ser um endereço válido</li>
                      <li>Mensagem: entre 10 e 5000 caracteres</li>
                      <li>Máximo de 3 links na mensagem (anti-spam)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Form>
          </div>

          <div 
            className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mt-6"
            data-tour="alternative-contacts"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Outras Formas de Contato
              </h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <span>E-mail direto: <a href="mailto:guilherme.cascavel@gmail.com" className="text-blue-600 hover:text-blue-800 font-medium">guilherme.cascavel@gmail.com</a></span>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Universidade: UNIOESTE - Campus Cascavel</span>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Tempo de resposta: Até 48 horas</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <TourGuide
        isActive={tour.isActive}
        currentStep={tour.currentStep}
        totalSteps={tour.totalSteps}
        currentStepData={tour.currentStepData}
        onNext={tour.nextStep}
        onPrev={tour.prevStep}
        onSkip={tour.skipTour}
        onClose={tour.closeTour}
        onCancel={tour.cancelTour}
        onSkipAll={tour.skipAllTours}
      />

      <TourRestartButton
        onRestartTour={tour.restartTour}
        onRestartAllTours={tour.restartAllTours}
        tourKey="contactPage"
        completedTours={tour.completedTours}
        onToggleTour={tour.toggleTourStatus}
        completedToursCount={tour.completedToursCount}
        isFirstTimeUser={tour.isFirstTimeUser}
      />
    </div>
  );
}