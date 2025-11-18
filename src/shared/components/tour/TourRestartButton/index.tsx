import { useState } from "react";
import {
  HelpCircle,
  CheckCircle,
  Circle,
  RefreshCw,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";

interface TourRestartButtonProps {
  onRestartTour?: () => void;
  onRestartAllTours?: () => void;
  onToggleTour?: (tourId: string, completed: boolean) => void; // Nova prop
  size?: "small" | "medium" | "large";
  tourKey?: string;
  completedTours?: string[];
  completedToursCount?: number;
  isFirstTimeUser?: boolean;
}

export function TourRestartButton({
  onRestartTour,
  onRestartAllTours,
  onToggleTour,
  size = "small",
  tourKey,
  completedTours = [],
  completedToursCount = 0,
  isFirstTimeUser = false,
}: TourRestartButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  const getButtonPosition = () => {
    const hasBottomNavigation = document.querySelector(
      '[data-tour="bottom-navigation"]'
    );

    return {
      bottom: hasBottomNavigation ? 90 : 80,
      left: 16,
    };
  };

  const buttonPosition = getButtonPosition();
  const isMobile = window.innerWidth < 640;

  const tourNames: Record<string, string> = {
    mainPage: "🏠 Tour da Página Principal",
    calculadoraIPCA: "🧮 Tour da Calculadora IPCA",
    seriesIPCA: "Tour das Séries IPCA",
    consulta_intro: "🔍 Tour da Consulta - Introdução",
    consulta_resultados: "📋 Tour dos Resultados",
    consulta_graficos: "📈 Tour dos Gráficos",
    consulta_correcao: "💰 Tour da Correção Monetária",
    helpPage: "❓ Tour da Central de Ajuda",
    aboutPage: "ℹ️ Tour da Página Sobre",
    contactPage: "📞 Tour da Página de Contato",
  };

  const allTours = [
    "mainPage",
    "calculadoraIPCA",
    "seriesIPCA",
    "consulta_intro",
    "consulta_resultados",
    "consulta_graficos",
    "consulta_correcao",
    "helpPage",
    "aboutPage",
    "contactPage",
  ];

  const sizeClasses = {
    small: isMobile ? "w-12 h-12" : "w-14 h-14",
    medium: "w-14 h-14",
    large: "w-16 h-16",
  };

  // Handler para alternar status do tour
  const handleToggleTour = (tourId: string) => {
    const isCompleted = completedTours.includes(tourId);

    if (onToggleTour) {
      onToggleTour(tourId, !isCompleted);
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setShowDialog(true)}
        className={`fixed ${sizeClasses[size]} bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-80 hover:opacity-100 z-[1001] flex items-center justify-center`}
        style={{
          bottom: `${buttonPosition.bottom}px`,
          left: `${buttonPosition.left}px`,
        }}
        title={
          completedToursCount > 0
            ? `Ver tours (${completedToursCount} completos)`
            : "Fazer tour do sistema"
        }
      >
        {completedToursCount > 0 ? (
          <div className="relative">
            <HelpCircle size={isMobile ? 20 : 24} />
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {completedToursCount}
            </span>
          </div>
        ) : (
          <HelpCircle size={isMobile ? 20 : 24} />
        )}
      </button>

      {/* Dialog */}
      {showDialog && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[9997]"
            onClick={() => setShowDialog(false)}
          />

          {/* Modal */}
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-[9998] w-full max-w-md mx-4"
            style={{ maxHeight: "90vh" }}
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b">
              <div className="flex items-center gap-3 mb-2">
                <HelpCircle className="text-blue-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">
                  Tours do Sistema
                </h2>
              </div>
              <p className="text-sm text-gray-600">
                {isFirstTimeUser
                  ? "Bem-vindo! Faça os tours para conhecer o sistema."
                  : `Você completou ${completedToursCount} de ${allTours.length} tours disponíveis.`}
              </p>
            </div>

            {/* Content */}
            <div
              className="p-6 overflow-auto"
              style={{ maxHeight: "calc(90vh - 200px)" }}
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Status dos Tours:
              </h3>

              <ul className="space-y-2">
                {allTours.map((tour) => {
                  const isCompleted = completedTours.includes(tour);
                  const isCurrent = tour === tourKey;

                  return (
                    <li
                      key={tour}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isCurrent
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="text-green-600" size={20} />
                        ) : (
                          <Circle className="text-gray-400" size={20} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">
                            {tourNames[tour] || tour}
                          </span>
                          {isCurrent && (
                            <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded-full">
                              atual
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Botão de toggle */}
                      {onToggleTour && (
                        <button
                          onClick={() => handleToggleTour(tour)}
                          className={`flex-shrink-0 p-1.5 rounded transition-colors ${
                            isCompleted
                              ? "text-green-600 hover:bg-green-100"
                              : "text-gray-400 hover:bg-gray-200"
                          }`}
                          title={
                            isCompleted
                              ? "Marcar como não concluído"
                              : "Marcar como concluído"
                          }
                        >
                          {isCompleted ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      )}

                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          isCompleted
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {isCompleted ? "Completo" : "Pendente"}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  💡 <strong>Dica:</strong> Use os botões de olho para
                  marcar/desmarcar tours como completos. Os tours são
                  independentes - você pode fazer apenas os que interessam!
                </p>
              </div>
            </div>

            {/* Actions */}
            <div
              className={`p-6 pt-4 border-t flex gap-3 ${
                isMobile ? "flex-col" : "flex-row justify-end"
              }`}
            >
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Fechar
              </button>

              {completedToursCount > 0 && (
                <button
                  onClick={() => {
                    onRestartAllTours?.();
                    setShowDialog(false);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-orange-600 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <RotateCcw size={16} />
                  Refazer Todos
                </button>
              )}

              {onRestartTour && (
                <button
                  onClick={() => {
                    onRestartTour();
                    setShowDialog(false);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <RefreshCw size={16} />
                  {tourKey && completedTours.includes(tourKey)
                    ? `Refazer Atual`
                    : `Iniciar Atual`}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
