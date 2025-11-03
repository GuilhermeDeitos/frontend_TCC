import React, { useEffect, useState, useCallback, useRef } from "react";
import { X, ChevronRight, ChevronLeft, SkipForward, Users } from "lucide-react";

interface TourGuideProps {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepData?: {
    id: string;
    target: string;
    title: string;
    content: string;
    placement?: "top" | "bottom" | "left" | "right";
  };
  extraButtons?: React.ReactNode;
  sectionInfo?: {
    current: string;
    total: number;
    index: number;
  };
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onClose: () => void;
  onCancel?: () => void;
  onSkipAll?: () => void;
}

export function TourGuide({
  isActive,
  currentStep,
  totalSteps,
  currentStepData,
  extraButtons,
  sectionInfo,
  onNext,
  onPrev,
  onSkip,
  onClose,
  onCancel,
  onSkipAll,
}: TourGuideProps) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });
  const [elementNotFound, setElementNotFound] = useState(false);

  const [isDialogReady, setIsDialogReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousStep, setPreviousStep] = useState(-1);
  const [overlayKey, setOverlayKey] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const isFinalizationButton = useCallback((selector: string) => {
    return (
      selector.includes("submit-button") ||
      selector.includes("finalizar") ||
      selector.includes("checkout")
    );
  }, []);

  const handleSkipAll = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (onSkipAll) {
        onSkipAll();
      } else {
        onSkip();
      }
    }, 100);
  }, [onSkipAll, onSkip]);

  const hasBottomNavigation = useCallback(() => {
    return !!document.querySelector('[data-tour="bottom-navigation"]');
  }, []);

  const updatePosition = useCallback(async () => {
    if (!currentStepData?.target) {
      setElementNotFound(true);
      setIsDialogReady(true);
      return;
    }

    const stepChanged = previousStep !== currentStep;
    if (stepChanged) {
      setIsTransitioning(true);
      setPreviousStep(currentStep);
      setOverlayKey((prev) => prev + 1);
    }

    if (currentStepData.target === "body") {
      setTargetElement(document.body);
      setTargetRect(null);
      setElementNotFound(false);

      const isMobile = window.innerWidth < 768;
      const dialogWidth = isMobile
        ? Math.min(window.innerWidth - 32, 350)
        : 400;
      const dialogHeight = isMobile ? 320 : 380;

      const centerTop = (window.innerHeight - dialogHeight) / 2;
      const centerLeft = window.innerWidth / 2;

      const minTop = 20;
      const maxTop = window.innerHeight - dialogHeight - 20;
      const finalTop = Math.max(minTop, Math.min(centerTop, maxTop));

      setDialogPosition({
        top: finalTop,
        left: centerLeft,
      });

      setTimeout(
        () => {
          setIsDialogReady(true);
          setIsTransitioning(false);
        },
        stepChanged ? 100 : 30
      );
      return;
    }

    const findElementWithRetry = async (
      selectors: string[],
      maxRetries = 3
    ): Promise<HTMLElement | null> => {
      for (let retry = 0; retry < maxRetries; retry++) {
        for (const selector of selectors) {
          const element = document.querySelector(selector) as HTMLElement;
          if (element) return element;
        }

        if (retry < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
      return null;
    };

    const selectors = currentStepData.target.split(",").map((s) => s.trim());
    const element = await findElementWithRetry(selectors);

    if (element) {
      setTargetElement(element);
      setElementNotFound(false);

      const rect = element.getBoundingClientRect();
      setTargetRect(rect);

      let placement = currentStepData.placement || "bottom";

      const isMobile = window.innerWidth < 768;
      const dialogWidth = isMobile
        ? Math.min(window.innerWidth - 32, 350)
        : 400;
      const dialogHeight = isMobile ? 280 : 320;

      const bottomNavHeight = isMobile && hasBottomNavigation() ? 80 : 0;
      const availableHeight = window.innerHeight - bottomNavHeight;

      let top = 0;
      let left = 0;

      const isFinalizationBtn = isFinalizationButton(currentStepData.target);

      switch (placement) {
        case "top":
          top = rect.top - dialogHeight - 30;
          left = rect.left + rect.width / 2;

          if (isFinalizationBtn) {
            top = Math.max(20, rect.top - dialogHeight - 50);
          }
          break;
        case "bottom":
          top = rect.bottom + 20;
          left = rect.left + rect.width / 2;
          if (isFinalizationBtn && isMobile) {
            top = rect.top - dialogHeight - 20;
            placement = "top";
          }
          break;
        case "left":
          top = rect.top + rect.height / 2 - dialogHeight / 2;
          left = rect.left - dialogWidth - 20;
          break;
        case "right":
          top = rect.top + rect.height / 2 - dialogHeight / 2;
          left = rect.right + 20;
          break;
      }

      const margin = 16;

      if (left + dialogWidth / 2 > window.innerWidth - margin) {
        left = window.innerWidth - dialogWidth / 2 - margin;
      }
      if (left - dialogWidth / 2 < margin) {
        left = dialogWidth / 2 + margin;
      }

      if (placement === "top") {
        if (top < margin) {
          top = rect.bottom + 20;
          if (top + dialogHeight > availableHeight - margin) {
            top = (availableHeight - dialogHeight) / 2;
          }
        }
      } else {
        if (top + dialogHeight > availableHeight - margin) {
          if (isFinalizationBtn) {
            top = rect.top - dialogHeight - 20;
          } else {
            top = availableHeight - dialogHeight - margin;
          }
        }
        if (top < margin) {
          top = margin;
        }
      }

      setDialogPosition({ top, left });

      const elementTop = window.pageYOffset + rect.top;
      let scrollTarget;

      if (isFinalizationBtn) {
        scrollTarget = elementTop - availableHeight / 2 + rect.height / 2;
      } else if (placement === "top") {
        scrollTarget = elementTop - dialogHeight - 100;
      } else {
        scrollTarget = elementTop - availableHeight / 3;
      }

      const currentScroll = window.pageYOffset;
      const targetScroll = Math.max(0, scrollTarget);
      const distance = Math.abs(targetScroll - currentScroll);

      if (distance > 50) {
        window.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }

      setTimeout(
        () => {
          setIsDialogReady(true);
          setIsTransitioning(false);
        },
        stepChanged ? 200 : 80
      );
    } else {
      console.warn(
        "Elemento não encontrado para o tour:",
        currentStepData.target
      );
      setElementNotFound(true);
      setTargetElement(null);
      setTargetRect(null);

      setTimeout(
        () => {
          setIsDialogReady(true);
          setIsTransitioning(false);
        },
        stepChanged ? 100 : 50
      );
    }
  }, [
    currentStepData,
    hasBottomNavigation,
    isFinalizationButton,
    currentStep,
    previousStep,
  ]);

  useEffect(() => {
    if (isActive && currentStepData) {
      const stepChanged = previousStep !== currentStep;
      if (stepChanged) {
        setIsDialogReady(false);
      }

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      animationTimeoutRef.current = setTimeout(
        () => {
          updatePosition();
        },
        stepChanged ? 50 : 20
      );

      return () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
      };
    }
  }, [isActive, currentStepData, updatePosition, currentStep, previousStep]);

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isActive && isDialogReady) {
          setTimeout(updatePosition, 50);
        }
      }, 100);
    };

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (isActive && targetElement && currentStepData?.target !== "body") {
          const rect = targetElement.getBoundingClientRect();
          setTargetRect(rect);
        }
      }, 16);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(resizeTimeout);
      clearTimeout(scrollTimeout);
    };
  }, [isActive, targetElement, updatePosition, currentStepData, isDialogReady]);

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(onNext, 100);
  }, [onNext]);

  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(onPrev, 100);
  }, [onPrev]);

  const handleSkip = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(onSkip, 100);
  }, [onSkip]);

  const handleCancel = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (onCancel) {
        onCancel();
      } else {
        onClose();
      }
    }, 100);
  }, [onCancel, onClose]);

  if (!isActive) return null;

  const isMobile = window.innerWidth < 768;
  const bottomNavHeight = isMobile && hasBottomNavigation() ? 80 : 0;

  const SpotlightOverlay = () => {
    if (currentStepData?.target === "body" || !targetRect || elementNotFound) {
      return (
        <div
          key={`overlay-simple-${overlayKey}`}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-none transition-opacity duration-300 ease-out"
          style={{
            zIndex: 9998,
            opacity: isDialogReady ? 1 : 0,
          }}
        />
      );
    }

    const padding = 8;
    const spotlightStyle = {
      top: targetRect.top - padding,
      left: targetRect.left - padding,
      width: targetRect.width + padding * 2,
      height: targetRect.height + padding * 2,
    };

    return (
      <div
        key={`overlay-spotlight-${overlayKey}`}
        className="fixed inset-0 pointer-events-none transition-opacity duration-300 ease-out"
        style={{
          zIndex: 9998,
          opacity: isDialogReady ? 1 : 0,
        }}
      >
        {/* Overlay com recorte */}
        <div
          className="absolute inset-0 bg-black/70 transition-all duration-300 ease-out"
          style={{
            clipPath: `polygon(
              0% 0%, 
              0% 100%, 
              ${spotlightStyle.left}px 100%, 
              ${spotlightStyle.left}px ${spotlightStyle.top}px, 
              ${spotlightStyle.left + spotlightStyle.width}px ${
              spotlightStyle.top
            }px, 
              ${spotlightStyle.left + spotlightStyle.width}px ${
              spotlightStyle.top + spotlightStyle.height
            }px, 
              ${spotlightStyle.left}px ${
              spotlightStyle.top + spotlightStyle.height
            }px, 
              ${spotlightStyle.left}px 100%, 
              100% 100%, 
              100% 0%
            )`,
          }}
        />

        {/* Borda destacada */}
        <div
          className="absolute border-3 border-blue-500 rounded shadow-lg animate-tour-pulse"
          style={{
            top: spotlightStyle.top,
            left: spotlightStyle.left,
            width: spotlightStyle.width,
            height: spotlightStyle.height,
          }}
        />

        <style>{`
          @keyframes tour-pulse {
            0% {
              border-color: rgb(59 130 246);
              box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.3);
              transform: scale(1);
            }
            50% {
              border-color: rgb(147 197 253);
              box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.5);
              transform: scale(1.02);
            }
            100% {
              border-color: rgb(59 130 246);
              box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.3);
              transform: scale(1);
            }
          }
          .animate-tour-pulse {
            animation: tour-pulse 2s infinite ease-in-out;
          }
        `}</style>
      </div>
    );
  };

  return (
    <>
      {isActive && currentStepData && (
        <>
          <SpotlightOverlay />

          {/* Dialog */}
          <div
            ref={dialogRef}
            className={`fixed bg-white rounded-lg shadow-2xl transition-all duration-300 ease-in-out ${
              isTransitioning ? "opacity-80" : "opacity-100"
            }`}
            style={{
              zIndex: 9999,
              top: isMobile ? "auto" : `${dialogPosition.top}px`,
              left: isMobile ? "50%" : `${dialogPosition.left}px`,
              bottom: isMobile ? bottomNavHeight : "auto",
              transform: isMobile
                ? `translateX(-50%) ${
                    isTransitioning ? "translateY(5px)" : "translateY(0)"
                  }`
                : `translate(-50%, 0) ${
                    isTransitioning ? "scale(0.99)" : "scale(1)"
                  }`,
              width: isMobile ? `calc(100vw - 32px)` : "400px",
              maxWidth: isMobile ? "calc(100vw - 32px)" : "400px",
              maxHeight: isMobile
                ? `calc(50vh - ${bottomNavHeight}px)`
                : "70vh",
              borderRadius: isMobile ? "16px 16px 0 0" : "8px",
              display: isDialogReady ? "flex" : "none",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div className="p-4 pb-2 bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center mb-2">
                <Users className="mr-2" size={24} />
                <h2 className="flex-1 text-lg font-semibold">
                  Tour do Sistema
                </h2>
                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded mr-2">
                  {currentStep + 1}/{totalSteps}
                </span>
                <button
                  onClick={handleCancel}
                  className="text-white hover:bg-white/20 rounded p-1 transition-all duration-150 hover:scale-110"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300 ease-in-out"
                  style={{
                    width: `${((currentStep + 1) / totalSteps) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div
              className="p-5 pb-2 overflow-auto"
              style={{
                maxHeight: isMobile ? "25vh" : "45vh",
                opacity: isTransitioning ? 0.8 : 1,
                transition: "opacity 0.15s ease-in-out",
              }}
            >
              {elementNotFound && currentStepData?.target !== "body" && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                  <p>Elemento não encontrado. Você pode pular este passo.</p>
                </div>
              )}

              <h3 className="text-lg font-bold text-blue-600 mb-2">
                {currentStepData?.title}
              </h3>

              <p className="text-gray-700 leading-relaxed text-sm">
                {currentStepData?.content}
              </p>

              {currentStep === 0 && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
                  <p className="text-xs text-gray-600">
                    💡 <strong>Sobre os tours:</strong> Cada seção do sistema
                    tem seu próprio tour. Você pode fazer apenas os tours que
                    interessam ou todos para conhecer completamente o sistema.
                  </p>
                </div>
              )}
            </div>


            {/* Actions */}
            <div className="p-4 pt-2 flex flex-col gap-2">
              {/* Section info - mover para cima dos botões */}
              {sectionInfo && (
                <div className="mb-2 pb-2 border-b border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="font-medium">{sectionInfo.current}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      Seção {sectionInfo.index} de {sectionInfo.total}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 items-center justify-between">
                {/* Botões de pular */}
                <div className="flex gap-1">
                  {extraButtons}

                  <button
                    onClick={handleSkip}
                    disabled={isTransitioning}
                    className="text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded text-sm transition-all disabled:opacity-50"
                  >
                    Pular
                  </button>

                  {onSkipAll && (
                    <button
                      onClick={handleSkipAll}
                      disabled={isTransitioning}
                      className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded text-xs transition-all disabled:opacity-50"
                    >
                      Pular Todos
                    </button>
                  )}
                </div>

                {/* Botões de navegação */}
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <button
                      onClick={handlePrev}
                      disabled={isTransitioning}
                      className="flex items-center gap-1 border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded text-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
                    >
                      {!isMobile && <ChevronLeft size={16} />}
                      Anterior
                    </button>
                  )}

                  <button
                    onClick={handleNext}
                    disabled={isTransitioning}
                    className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                  >
                    {currentStep === totalSteps - 1 ? "Finalizar" : "Próximo"}
                    {!isMobile && currentStep !== totalSteps - 1 && (
                      <ChevronRight size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
