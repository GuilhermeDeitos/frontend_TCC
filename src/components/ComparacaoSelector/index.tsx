import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CampoComparacao, TipoComparacao } from "../../types/consulta";
interface ComparacaoSelectorProps {
  tipoComparacao: TipoComparacao;
  setTipoComparacao: (tipo: TipoComparacao) => void;
  campoSelecionado: CampoComparacao;
  setCampoSelecionado: (campo: CampoComparacao) => void;
}

export function ComparacaoSelector({ 
  tipoComparacao, 
  setTipoComparacao, 
  campoSelecionado, 
  setCampoSelecionado 
}: ComparacaoSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const opcoesComparacao = [
    { value: 'orcamento_inicial_loa', label: 'Orçamento Inicial (LOA)' },
    { value: 'valor_empenhado', label: 'Valor Empenhado' },
    { value: 'valor_liquidado', label: 'Valor Liquidado' },
    { value: 'valor_pago', label: 'Valor Pago' },
    { value: 'total_orcamentario_ate_mes', label: 'Total Orçamentário Até Mês' },
    { value: 'total_orcamentario_no_mes', label: 'Total Orçamentário No Mês' },
    { value: 'disponibilidade_orcamentaria_ate_mes', label: 'Disp. Orçamentária Até Mês' },
    { value: 'disponibilidade_orcamentaria_no_mes', label: 'Disp. Orçamentária No Mês' },
    { value: 'empenhado_ate_mes', label: 'Empenhado Até Mês' },
    { value: 'empenhado_no_mes', label: 'Empenhado no Mês' },
    { value: 'liquidado_ate_mes', label: 'Liquidado Até Mês' },
    { value: 'liquidado_no_mes', label: 'Liquidado no Mês' },
    { value: 'pago_ate_mes', label: 'Pago Até Mês' },
    { value: 'pago_no_mes', label: 'Pago no Mês' }
  ];

  const gruposOpcoes = [
    {
      titulo: "Valores Principais",
      opcoes: opcoesComparacao.slice(0, 4)
    },
    {
      titulo: "Valores Orçamentários",
      opcoes: opcoesComparacao.slice(4, 8)
    },
    {
      titulo: "Valores Mensais e Acumulados",
      opcoes: opcoesComparacao.slice(8)
    }
  ];

  const tiposComparacao = [
    { value: 'universidades', label: 'Entre Universidades' },
    { value: 'anos', label: 'Entre Anos' },
    { value: 'evolucao_anual', label: 'Evolução Anual'}
  ];

  const campoAtual = opcoesComparacao.find(o => o.value === campoSelecionado)?.label || '';
  const tipoAtual = tiposComparacao.find(t => t.value === tipoComparacao)?.label || '';

  return (
    <div className="mb-6 bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden max-w-full">
      {/* Header Colapsável */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div className="text-left min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
              Opções de Comparação
            </h3>
            <p className="text-xs text-gray-600 truncate">
              {tipoAtual} • {campoAtual}
            </p>
          </div>
        </div>

        <motion.svg
          className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      {/* Content Expandível */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 gap-4 max-w-full">
                {/* Tipo de Comparação */}
                <div className="w-full">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Tipo de Comparação
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {tiposComparacao.map((tipo) => (
                      <button
                        key={tipo.value}
                        onClick={() => setTipoComparacao(tipo.value as TipoComparacao)}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm cursor-pointer font-medium transition-all ${
                          tipoComparacao === tipo.value
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        <span className="truncate">{tipo.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Campo para Comparação */}
                <div className="w-full">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Campo para Comparação
                  </label>
                  <select
                    value={campoSelecionado}
                    onChange={(e) => setCampoSelecionado(e.target.value as CampoComparacao)}
                    className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm cursor-pointer"
                  >
                    {gruposOpcoes.map(grupo => (
                      <optgroup key={grupo.titulo} label={grupo.titulo}>
                        {grupo.opcoes.map(opcao => (
                          <option key={opcao.value} value={opcao.value}>
                            {opcao.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}