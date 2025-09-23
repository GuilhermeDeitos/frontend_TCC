interface LoadingIndicatorProps {
  message?: string;
  progresso?: number;
  registrosProcessados?: number;
  totalRegistros?: number;
  anosProcessados?: Set<number>;
  anoInicial?: number;
  anoFinal?: number;
  onCancel?: () => void; // Nova prop para função de cancelamento
}

export function LoadingIndicator({ 
  message = "Consultando dados...", 
  progresso = 0,
  registrosProcessados = 0,
  totalRegistros = 0,
  anosProcessados = new Set<number>(),
  anoInicial,
  anoFinal,
  onCancel
}: LoadingIndicatorProps) {
  
  // Calcular total de anos processados
  const totalAnosProcessados = anosProcessados.size;
  const totalAnosEsperados = anoInicial && anoFinal ? (anoFinal - anoInicial + 1) : 0;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-8 sm:p-10 text-center max-w-xl w-full mx-4 relative animate-fade-in">
        <div className="flex flex-col items-center w-full">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600 mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {message}
          </h3>
          <p className="text-gray-600 mb-6">Isso pode levar alguns minutos para períodos extensos</p>
          
          {/* Barra de progresso principal */}
          <div className="w-full mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso da consulta</span>
              <span>{progresso}% concluído</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${progresso}%` }}
              ></div>
            </div>
          </div>
          
          {/* Estatísticas detalhadas */}
          <div className="bg-blue-50 rounded-lg p-4 w-full">
            <div className="grid grid-cols-2 gap-6 text-base">
              <div>
                <p className="font-medium text-gray-700">Anos processados</p>
                <p className="text-blue-700 text-lg font-semibold">{totalAnosProcessados} de {totalAnosEsperados}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Registros processados</p>
                <p className="text-blue-700 text-lg font-semibold">{registrosProcessados.toLocaleString('pt-BR')}</p>
              </div>
            </div>
            
            {/* Lista visual de anos processados */}
            {anoInicial && anoFinal && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-700 mb-2">
                  <span>Anos processados:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: anoFinal - anoInicial + 1 }, (_, i) => anoInicial + i).map(ano => (
                    <div 
                      key={ano}
                      className={`text-sm px-3 py-1.5 rounded-md ${
                        anosProcessados.has(ano) 
                          ? 'bg-green-100 text-green-800 font-medium' 
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {ano}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Dica informativa */}
          <p className="text-sm text-blue-600 mt-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Você pode visualizar o progresso enquanto os dados são processados
          </p>
          
          {/* Botão de cancelamento */}
          {onCancel && (
            <button 
              onClick={onCancel}
              className="mt-6 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 rounded-lg font-medium transition-colors flex items-center gap-2 border border-red-200"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar Consulta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}