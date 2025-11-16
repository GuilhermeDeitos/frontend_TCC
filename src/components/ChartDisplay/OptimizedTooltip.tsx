import { memo, useState, useEffect, useRef } from "react";

interface TooltipData {
  active?: boolean;
  payload?: Array<{
    value: number;
    name?: string;
    payload?: {
      universidade?: string;
      name?: string;
    };
  }>;
}

const TOOLTIP_DELAY = 50; // ms - delay reduzido para melhor UX

export const OptimizedTooltip = memo(function OptimizedTooltip({ active, payload }: TooltipData) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [cachedData, setCachedData] = useState<any>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (active && payload && payload.length > 0) {
      // Cachear dados imediatamente
      const data = payload[0];
      setCachedData(data);

      // Mostrar com pequeno delay
      timeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, TOOLTIP_DELAY);
    } else {
      // Esconder imediatamente quando sair
      setShowTooltip(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [active, payload]);

  // Não renderizar nada se não houver dados
  if (!showTooltip || !cachedData) {
    return null;
  }

  const value = cachedData.value;
  const label = cachedData.payload?.universidade || cachedData.payload?.name || cachedData.name;

  return (
    <div 
      className="bg-white p-3 shadow-xl rounded-lg border-2 border-blue-200 pointer-events-none"
      style={{
        // Garantir que o tooltip apareça acima de tudo
        zIndex: 9999,
      }}
    >
      <p className="font-semibold text-gray-800 text-sm mb-1">{label}</p>
      <p className="text-blue-600 font-bold text-base">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value)}
      </p>
    </div>
  );
});

OptimizedTooltip.displayName = "OptimizedTooltip";