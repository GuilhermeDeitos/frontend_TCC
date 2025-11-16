import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConsultaMetadata {
  id: string;
  timestamp: number;
  descricao: string;
  params: any;
  totalRegistros: number;
  filters?: any[];
  visualizacao?: "tabela" | "grafico";
}

interface HistoricoConsultasProps {
  historico: ConsultaMetadata[];
  onReexecutar: (id: string) => void; //Mudou de onRestaurar para onReexecutar
  onRemover: (id: string) => void;
  onLimparTudo: () => void;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean; //Novo prop para mostrar loading
}

export const HistoricoConsultas = memo(({
  historico,
  onReexecutar,
  onRemover,
  onLimparTudo,
  isOpen,
  onClose,
  isLoading = false,
}: HistoricoConsultasProps) => {
  if (!isOpen) return null;

  const formatarData = (timestamp: number) => {
    const data = new Date(timestamp);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    const ehHoje = data.toDateString() === hoje.toDateString();
    const ehOntem = data.toDateString() === ontem.toDateString();

    if (ehHoje) {
      return `Hoje às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (ehOntem) {
      return `Ontem às ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                Histórico de Consultas
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                {historico.length} {historico.length === 1 ? 'configuração' : 'configurações'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
            disabled={isLoading}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {historico.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500 font-medium text-sm sm:text-base">Nenhuma consulta no histórico</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                As consultas realizadas aparecerão aqui
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <AnimatePresence>
                {historico.map((consulta, index) => (
                  <motion.div
                    key={consulta.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                      {/* Info da consulta */}
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                            {consulta.descricao}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 ml-7 sm:ml-8">
                          <span className="flex items-center gap-1 flex-shrink-0">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="hidden sm:inline">{formatarData(consulta.timestamp)}</span>
                            <span className="sm:hidden">{new Date(consulta.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                          </span>
                          
                          {consulta.filters && consulta.filters.length > 0 && (
                            <span className="flex items-center gap-1 text-blue-600 flex-shrink-0">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                              </svg>
                              {consulta.filters.length} {consulta.filters.length === 1 ? 'filtro' : 'filtros'}
                            </span>
                          )}

                          <span className="flex items-center gap-1 text-gray-500 flex-shrink-0">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            ~{consulta.totalRegistros.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => {
                            onReexecutar(consulta.id);
                            onClose();
                          }}
                          disabled={isLoading}
                          className={`px-2 sm:px-3 py-1.5 rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center gap-1 ${
                            isLoading
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {isLoading ? (
                            <>
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="hidden sm:inline">Carregando...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span className="hidden sm:inline">Reexecutar</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onRemover(consulta.id)}
                          disabled={isLoading}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Remover"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {historico.length > 0 && (
          <div className="p-3 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-xs sm:text-sm">
                <p className="text-gray-600">
                  Últimas {historico.length} consultas. Máximo: 5
                </p>
                <p className="text-gray-500 mt-1 hidden sm:block">
                  💡 Histórico armazena apenas configurações
                </p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja limpar todo o histórico?')) {
                    onLimparTudo();
                  }
                }}
                disabled={isLoading}
                className="px-3 sm:px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center gap-2 disabled:opacity-50 w-full sm:w-auto justify-center"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpar Tudo
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
});


HistoricoConsultas.displayName = 'HistoricoConsultas';