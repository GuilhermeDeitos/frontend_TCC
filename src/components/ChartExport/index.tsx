import { useState, useRef, useEffect } from "react";
import { toPng, toJpeg, toSvg } from "html-to-image";
import { motion } from "framer-motion";

interface ChartExportProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
}

export function ChartExport({ targetRef, fileName = "grafico" }: ChartExportProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const handleExport = async (format: "png" | "jpg" | "svg") => {
    if (!targetRef.current) return;
    
    try {
      let dataUrl: string;
      let extension: string;
      
      // Aplicar um fundo branco para exportação
      const originalBackgroundColor = targetRef.current.style.backgroundColor;
      targetRef.current.style.backgroundColor = "#ffffff";
      
      switch (format) {
        case "png":
          dataUrl = await toPng(targetRef.current, { quality: 0.95 });
          extension = "png";
          break;
        case "jpg":
          dataUrl = await toJpeg(targetRef.current, { quality: 0.95 });
          extension = "jpg";
          break;
        case "svg":
          dataUrl = await toSvg(targetRef.current);
          extension = "svg";
          break;
      }
      
      // Restaurar o background original
      targetRef.current.style.backgroundColor = originalBackgroundColor;
      
      // Criar link de download
      const link = document.createElement("a");
      link.download = `${fileName}.${extension}`;
      link.href = dataUrl;
      link.click();
      
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Erro ao exportar gráfico:", error);
    }
  };
  
  // Fechar o menu quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" data-tour="chart-export">
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        title="Exportar gráfico"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Exportar
      </motion.button>
      
      {isMenuOpen && (
        <motion.div 
          ref={menuRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-10 mt-2 right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => handleExport("png")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Exportar como PNG
            </button>
            <button
              onClick={() => handleExport("jpg")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Exportar como JPG
            </button>
            <button
              onClick={() => handleExport("svg")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Exportar como SVG
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}