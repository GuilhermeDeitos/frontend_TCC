import { useEffect, useState, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollIndicatorProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

export function ScrollIndicator({ containerRef }: ScrollIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isScrollable = scrollHeight > clientHeight;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      
      //Só mostra se for scrollável E não estiver no final
      setShowIndicator(isScrollable && !isAtBottom);
    };

    //Verificar inicialmente
    checkScroll();
    
    //Adicionar listeners
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    //Observar mudanças no conteúdo (quando colunas são selecionadas/deselecionadas)
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none"
          style={{
            position: "sticky", //Mudado de absolute para sticky
            bottom: 0,
            left: 0,
            right: 0,
            height: "80px",
            background: "linear-gradient(to top, rgb(255, 255, 255), rgba(255, 255, 255, 0.9), transparent)",
            zIndex: 10,
          }}
        >
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
            <motion.svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
            <motion.span
              className="text-xs font-medium text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              Role para ver mais
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}