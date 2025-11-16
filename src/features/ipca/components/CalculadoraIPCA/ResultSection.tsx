import { motion } from "framer-motion";
import type{ Resultado } from "../../types/calculadora";
import { InfoCard } from "@shared/components/UI/InfoCard";

interface ResultSectionProps {
  resultado: Resultado;
}

export function ResultSection({ resultado }: ResultSectionProps) {
  if (resultado.valor_corrigido <= 0) return null;

  const taxaIPCA = (
    ((resultado.indice_ipca_final / resultado.indice_ipca_inicial - 1) * 100)
  ).toFixed(2);

  const variacao = resultado.valor_corrigido - resultado.valor_inicial;
  const percentualVariacao = (
    ((variacao / resultado.valor_inicial) * 100)
  ).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 mb-6"
      data-tour="resultado-section"
    >
      <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <svg
              className="w-6 h-6 text-blue-600"
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
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Resultado da Correção
            </h3>
            <p className="text-sm text-gray-600">
              Valores atualizados pelo IPCA
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            title="Valor Original"
            value={`R$ ${resultado.valor_inicial.toFixed(2)}`}
            variant="blue"
          />

          <InfoCard
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
            title="Valor Corrigido"
            value={`R$ ${resultado.valor_corrigido.toFixed(2)}`}
            description={`Variação: R$ ${variacao.toFixed(2)} (${percentualVariacao}%)`}
            variant="green"
          />
        </div>

        <div className="mt-4 pt-4 border-t-2 border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">IPCA Inicial</p>
              <p className="text-lg font-semibold text-gray-900">
                {resultado.indice_ipca_inicial.toFixed(4)}
              </p>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">IPCA Final</p>
              <p className="text-lg font-semibold text-gray-900">
                {resultado.indice_ipca_final.toFixed(4)}
              </p>
            </div>

            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 mb-1">Inflação do Período</p>
              <p className="text-lg font-semibold text-blue-900">
                {taxaIPCA}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}