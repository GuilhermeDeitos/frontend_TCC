import { useEffect, useState, useMemo } from "react";
// 1. Novos imports do React Hook Form e Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Header } from "@shared/components/Layout/Header";
import { Footer } from "@shared/components/Layout/Footer";
import { InputField } from "@shared/components/UI/Input";
import { SelectField } from "@shared/components/UI/Select";
import { BlueTitleCard } from "@shared/components/UI/BlueTitleCard";
import { ErrorPanel } from "@shared/components/Feedback/ErrorPanel";
import { TourGuide } from "@shared/components/tour/TourGuide";
import { TourRestartButton } from "@shared/components/tour/TourRestartButton";
import { useCalculadoraIPCATour } from "../../hooks/useCalculadoraIPCATour";
import { ResultSection } from "../../components/CalculadoraIPCA/ResultSection";
import { HelpModal } from "../../components/CalculadoraIPCA/HelpModal";
import { type Resultado, MESES } from "../../types/calculadora"; // Removido o tipo FormData antigo
// 2. Import do nosso novo schema e sua tipagem
import { createCalculadoraSchema, type CalculadoraFormData } from "../../utils/validation";
import api from "@shared/utils/api";
import { useCorrigirValor } from "../../hooks/useCorrigirValor";

const INITIAL_RESULTADO: Resultado = {
  indice_ipca_final: 0,
  indice_ipca_inicial: 0,
  valor_corrigido: 0,
  valor_inicial: 0,
};

export function CalculadoraIPCAPage() {
  const [resultado, setResultado] = useState<Resultado>(INITIAL_RESULTADO);
  const [error, setError] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const tour = useCalculadoraIPCATour();

  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();

  // 3.schema dinâmico usando useMemo para não recriar a cada render
  const validationSchema = useMemo(
    () => createCalculadoraSchema(mesAtual, anoAtual),
    [mesAtual, anoAtual]
  );

  // 4. 
  // Configurando o React Hook Form com Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CalculadoraFormData>({
    //  'as any' aqui para ignorar o conflito do z.coerce (unknown) com o RHF (number)
    resolver: zodResolver(validationSchema) as any, 
    defaultValues: {
      //"" as unknown as number para o input iniciar vazio (sem mostrar "0")
      // e ainda satisfazer a tipagem do TypeScript
      valor: "" as unknown as number, 
      mesInicial: "",
      anoInicial: "",
      mesFinal: "",
      anoFinal: "",
    },
  });

  // Hook da mutation
  const { mutateAsync, isPending } = useCorrigirValor();

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

  // 5. useEffect para capturar erros do Zod e exibir no SweetAlert
  useEffect(() => {
    // Pega o primeiro erro que ocorrer no formulário
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      Swal.fire({
        icon: "error",
        title: "Atenção",
        text: firstError.message as string,
      });
    }
  }, [errors]);

  // 6. função de submissão (só é chamada se o formulário for validado pelo Zod)
  const onSubmitForm = async (data: CalculadoraFormData) => {
    try {
      // Chamada da mutation do React Query usando os dados já validados
      const resultData = await mutateAsync({
        mes_inicial: data.mesInicial,
        ano_inicial: data.anoInicial,
        mes_final: data.mesFinal,
        ano_final: data.anoFinal,
        valor: data.valor.toString(), // Convertendo para string 
      });

      // Atualiza o resultado
      setResultado(resultData);

      // Feedback de sucesso
      if (resultData.valor_corrigido > 0) {
        Swal.fire({
          icon: "success",
          title: "Sucesso",
          html: `
          <div class="text-left">
            <p class="mb-2">
              <strong>Valor Corrigido:</strong>
              R$ ${resultData.valor_corrigido.toFixed(2)}
            </p>

            <p class="text-sm text-gray-600">
              O resultado detalhado está exibido abaixo do formulário.
            </p>
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
      // Tratamento de erro
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Ocorreu um erro ao calcular a correção monetária.",
      });

      console.error(
        "Erro ao calcular a correção monetária:",
        error
      );
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

                  {/* 7. Formulário conectado ao handleSubmit do Hook Form */}
                  <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Coluna Esquerda */}
                      <div className="space-y-6">
                        {/* Valor */}
                        <div data-tour="valor-field">
                          {/* 8. Substituído 'value' e 'onChange' por {...register("campo")} */}
                          <InputField
                            id="valor"
                            type="number"
                            label="Valor Original (R$)"
                            placeholder="1000.00"
                            step="0.01"
                            min="0.01"
                            {...register("valor")}
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
                                label="Mês"
                                options={MESES}
                                {...register("mesInicial")}
                              />
                            </div>
                            <div data-tour="ano-inicial">
                              <SelectField
                                id="anoInicial"
                                label="Ano"
                                options={gerarAnosDisponiveis(anoAtual)}
                                {...register("anoInicial")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Coluna Direita */}
                      <div className="space-y-6">
                        {/* Fórmula */}
                        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                          <p className="text-xs text-purple-700 font-medium mb-1.5">
                            Fórmula de correção:
                          </p>
                          <div className="font-mono text-sm text-purple-900 bg-white rounded px-2">
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
                                label="Mês"
                                options={MESES}
                                {...register("mesFinal")}
                              />
                            </div>
                            <div data-tour="ano-final">
                              <SelectField
                                id="anoFinal"
                                label="Ano"
                                options={gerarAnosDisponiveis(anoAtual)}
                                {...register("anoFinal")}
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
                        disabled={isPending}
                        className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-3 ${
                          isPending
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                        }`}
                      >
                        {isPending ? (
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