import { useState } from "react";
import { ExportDialog } from "../ExportDialog";
import type { DadosConsulta } from "@features/consulta/types/consulta";

interface DownloadOptionsProps {
  dados: DadosConsulta[];
  filteredDados: DadosConsulta[];
  hasActiveFilters: boolean;
}

export function DownloadOptions({ dados, filteredDados, hasActiveFilters }: DownloadOptionsProps) {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setExportDialogOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Exportar
        {hasActiveFilters && (
          <span className="ml-1 px-2 py-0.5 bg-green-700 rounded-full text-xs">
            {filteredDados.length}
          </span>
        )}
      </button>

      <ExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        dados={dados}
        filteredDados={filteredDados}
        hasActiveFilters={hasActiveFilters}
        tableName="universidades"
      />
    </>
  );
}