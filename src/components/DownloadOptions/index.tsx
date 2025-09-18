// filepath: d:\Projetos\TCC\frontend\frontend\src\components\DownloadOptions\index.tsx
import { useState } from "react";
import type{ DadosConsulta } from "../../types/consulta";
import { ExportDialog } from "../ExportDialog";

interface DownloadOptionsProps {
  dados: DadosConsulta[];
}

export function DownloadOptions({ dados }: DownloadOptionsProps) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  
  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setIsExportDialogOpen(true)}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar
        </button>
      </div>
      
      <ExportDialog
        open={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        dados={dados}
        tableName="universidades"
      />
    </>
  );
}