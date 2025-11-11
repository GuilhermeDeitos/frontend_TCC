import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { InputField } from "../../components/Input";
import { SelectField } from "../../components/Select";
import { BlueTitleCard } from "../../components/BlueTitleCard";
import { ErrorPanel } from "../../components/ErrorPanel";
import { TourGuide } from "../../components/TourGuide";
import { TourRestartButton } from "../../components/TourRestartButton";
import { useCalculadoraIPCATour } from "../../hooks/useCalculadoraIPCATour";
import { ResultSection } from "./ResultSection";
import { HelpModal } from "./HelpModal";
import { type FormData, type Resultado, MESES } from "./types";
import { validateCalculatorInput } from "./validation";
import apiIpca from "../../utils/api";
import api from "../../utils/api";

const INITIAL_FORM_DATA: FormData = {
  valor: "",
  mesInicial: "",
  anoInicial: "",
  mesFinal: "",
  anoFinal: "",
};

const INITIAL_RESULTADO: Resultado = {
  indice_ipca_final: 0,
  indice_ipca_inicial: 0,
  valor_corrigido: 0,
  valor_inicial: 0,
};

export function CalculadoraIPCAPage() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [resultado, setResultado] = useState<Resultado>(INITIAL_RESULTADO);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const tour = useCalculadoraIPCATour();

  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await api.get("/ipca");
      } catch (error) {
        setError("Erro ao verificar status da API");
        console.error("Erro ao verificar status da API:", error);
      }
    };

    checkApiStatus();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateCalculatorInput(formData, mesAtual, anoAtual);
    if (!validation.isValid) {
      Swal.fire({
        icon: "error",
        title: "Atenção",
        text: validation.message,
      });
      return;
    }

    setIsCalculating(true);

    try {
      const response = await apiIpca.get("/ipca/corrigir", {
        params: {
          mes_inicial: formData.mesInicial,
          ano_inicial: formData.anoInicial,
          mes_final: formData.mesFinal,
          ano_final: formData.anoFinal,
          valor: formData.valor,
        },
      });

      setResultado(response.data);

      if (response.data.valor_corrigido > 0) {
        Swal.fire({
          icon: "success",
          title: "Sucesso",
          html: `
            <div class="text-left">
              <p class="mb-2"><strong>Valor Corrigido:</strong> R$ ${response.data.valor_corrigido.toFixed(
                2
              )}</p>
              <p class="text-sm text-gray-600">O resultado detalhado está exibido abaixo do formulário.</p>
            </div>
          `,
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "Atenção",
          text: "O valor corrigido é negativo ou igual a zero.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Ocorreu um erro ao calcular a correção monetária.",
      });
      console.error("Erro ao calcular a correção monetária:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const gerarAnosDisponiveis = (anoFinal: number) => {
    return Array.from({ length: anoFinal - 1979 + 1 }, (_, i) => {
      const year = anoFinal - i;
      return { value: year.toString(), label: year.toString() };
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {error ? (
        <ErrorPanel message={error} />
      ) : (
        <>
          <div data-tour="title-section">
            <BlueTitleCard
              title="Calculadora de Correção Monetária"
              subtitle="Atualize valores históricos pela inflação oficial medida pelo IPCA"
            />
          </div>

          <main className="flex-grow bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ResultSection resultado={resultado} />

                <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  {/* Header com botão de ajuda */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1">
                          Dados para Correção
                        </h2>
                        <p className="text-blue-100 text-sm">
                          Preencha os campos abaixo
                        </p>
                      </div>
                      <button
                        onClick={() => setShowHelpModal(true)}
                        className="bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-lg transition-colors flex items-center gap-2 group"
                        title="Como usar a calculadora"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium hidden sm:inline group-hover:underline">
                          Ajuda
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Formulário */}
                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Coluna Esquerda */}
                      <div className="space-y-6">
                        {/* Valor */}
                        <div data-tour="valor-field">
                          <InputField
                            id="valor"
                            name="valor"
                            type="number"
                            label="Valor Original (R$)"
                            placeholder="1000.00"
                            required
                            value={formData.valor}
                            onChange={handleChange}
                            step="0.01"
                            min="0.01"
                          />
                        </div>

                        {/* Período Inicial */}
                        <div data-tour="data-inicial">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Período Inicial
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <div data-tour="mes-inicial">
                              <SelectField
                                id="mesInicial"
                                name="mesInicial"
                                label="Mês"
                                required
                                value={formData.mesInicial}
                                onChange={handleChange}
                                options={MESES}
                              />
                            </div>
                            <div data-tour="ano-inicial">
                              <SelectField
                                id="anoInicial"
                                name="anoInicial"
                                label="Ano"
                                required
                                value={formData.anoInicial}
                                onChange={handleChange}
                                options={gerarAnosDisponiveis(anoAtual)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Coluna Direita */}
                      <div className="space-y-6">
                        {/* Fórmula */}
                        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                          <p className="text-xs text-purple-700 font-medium mb-2">
                            Fórmula de correção:
                          </p>
                          <div className="font-mono text-sm text-purple-900 bg-white rounded px-3 py-2">
                            Valor × (Índice Final ÷ Índice Inicial)
                          </div>
                        </div>

                        {/* Período Final */}
                        <div data-tour="data-final">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Período Final
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <div data-tour="mes-final">
                              <SelectField
                                id="mesFinal"
                                name="mesFinal"
                                label="Mês"
                                required
                                value={formData.mesFinal}
                                onChange={handleChange}
                                options={MESES}
                              />
                            </div>
                            <div data-tour="ano-final">
                              <SelectField
                                id="anoFinal"
                                name="anoFinal"
                                label="Ano"
                                required
                                value={formData.anoFinal}
                                onChange={handleChange}
                                options={gerarAnosDisponiveis(anoAtual)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botão de submit */}
                    <div className="mt-6" data-tour="submit-button">
                      <button
                        type="submit"
                        disabled={isCalculating}
                        className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-3 ${
                          isCalculating
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                        }`}
                      >
                        {isCalculating ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <span>Calculando...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            <span>Calcular Correção</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </main>
        </>
      )}

      <Footer />

      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

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
        onToggleTour={tour.toggleTourStatus}
        tourKey="calculadoraIPCA"
        completedTours={tour.completedTours}
        completedToursCount={tour.completedToursCount}
        isFirstTimeUser={tour.isFirstTimeUser}
      />
    </div>
  );
}