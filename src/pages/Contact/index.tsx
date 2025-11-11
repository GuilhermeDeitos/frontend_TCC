import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header"
import { Form } from "../../components/Form";
import { InputField } from "../../components/Input";
import { TextareaField } from "../../components/TextArea";
import { TourGuide } from "../../components/TourGuide";
import { TourRestartButton } from "../../components/TourRestartButton";
import { useContactPageTour } from "../../hooks/useContactPageTour";
import { useState } from "react";
import Swal from 'sweetalert2'
import { BlueTitleCard } from "../../components/BlueTitleCard";
import api from "../../utils/api";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const tour = useContactPageTour();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Enviar dados para a API
      await api.post('/email/contact', formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Mensagem enviada com sucesso!',
        text: 'Agradecemos seu contato e retornaremos em breve.',
      });
      
      // Limpar o formulário após envio bem-sucedido
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Falha ao enviar mensagem',
        text: 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.',
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
                />
              </div>

              <div data-tour="message-field">
                <TextareaField
                  id="message"
                  name="message"
                  label="Mensagem"
                  placeholder="Digite sua mensagem, dúvida ou sugestão..."
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </Form>
          </div>

          <div 
            className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mt-6"
            data-tour="alternative-contacts"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Outras Formas de Contato</h3>
              <div className="space-y-2 text-gray-600">
                <p>E-mail direto: <a href="mailto:guilherme.cascavel@gmail.com" className="text-blue-600 hover:text-blue-800">guilherme.cascavel@gmail.com</a></p>
                <p>Universidade: UNIOESTE - Campus Cascavel</p>
                <p>Tempo de resposta: Até 48 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Tour Guide */}
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

      {/* Botão para reiniciar tour */}
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