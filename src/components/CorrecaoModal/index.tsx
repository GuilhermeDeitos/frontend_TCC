import { useEffect, useRef } from "react";

interface FatorCorrecaoAno {
  ano: number;
  fator_correcao: number;
  ipca_periodo?: number;
  ipca_referencia?: number;
  periodo_referencia?: string;
  tipo_correcao?: string;
}

interface InfoCorrecaoBasica {
  periodo_referencia: string;
  tipo_correcao: string;
  total_anos: number;
}

interface CorrecaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  fatoresCorrecao: FatorCorrecaoAno[];
  infoBasica: InfoCorrecaoBasica | null;
}

export function CorrecaoModal({
  isOpen,
  onClose,
  fatoresCorrecao,
  infoBasica,
}: CorrecaoModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Fechar modal ao clicar fora
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

  // Fechar modal com tecla ESC
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      // Prevenir rolagem do body quando modal está aberto
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-hidden"
      onClick={handleBackdropClick}
      data-tour="correction-modal"
    >
      <div
        ref={modalContentRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do modal */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-white sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Detalhes da Correção Monetária
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
            aria-label="Fechar"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Corpo do modal (área com scroll) */}
        <div className="p-6 overflow-y-auto flex-grow">
          {/* Informações Gerais */}
          <div className="mb-4 bg-blue-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-blue-800 mb-2">
              Informações Gerais
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Período de Referência:</span>{" "}
                {infoBasica?.periodo_referencia || "-"}
              </div>
              <div>
                <span className="font-medium">Tipo de Correção:</span>{" "}
                {infoBasica?.tipo_correcao === "anual"
                  ? "IPCA Anual (Média)"
                  : "IPCA Mensal"}
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-3">
              Os valores foram corrigidos para{" "}
              {infoBasica?.periodo_referencia} usando{" "}
              {infoBasica?.tipo_correcao === "anual"
                ? "médias anuais"
                : "valores mensais"}{" "}
              do IPCA.
            </p>
          </div>

          {/* Título da tabela */}
          <h4 className="text-md font-medium text-gray-800 mb-3">
            Fatores de Correção por Ano
          </h4>

          {/* Tabela de fatores */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ano
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fator de Correção
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    IPCA do Período
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    IPCA Referência
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fatoresCorrecao.map((fator) => (
                  <tr key={fator.ano} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {fator.ano}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      {fator.fator_correcao.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {fator.ipca_periodo
                        ? fator.ipca_periodo.toFixed(4)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {fator.ipca_referencia
                        ? fator.ipca_referencia.toFixed(4)
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Explicação de como interpretar */}
          <div
            className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm"
            data-tour="correction-interpretation"
          >
            <h4 className="text-md font-medium text-amber-800 mb-2 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Como interpretar
            </h4>
            <p className="text-amber-800 mb-2">
              O fator de correção representa o multiplicador aplicado aos
              valores originais para atualizá-los monetariamente.
            </p>
            <ul className="list-disc list-inside text-amber-700 space-y-1">
              <li>
                Um fator maior que 1 indica que houve inflação no período.
              </li>
              <li>
                Quanto mais antigo o ano, maior tende a ser o fator de
                correção.
              </li>
              <li>
                Exemplo: um valor de R$ 1.000,00 em 2010 com fator 3,5
                equivale a R$ 3.500,00 em{" "}
                {infoBasica?.periodo_referencia || "valor de referência"}.
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé do modal (fixo) */}
        <div className="flex justify-end p-4 border-t border-gray-300 bg-white sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}