import { useState, useEffect, useRef } from "react";
import type { DadosConsulta } from "../../types/consulta";
import { FormatSelector } from "./FormatSelector";
import { ColumnSelector } from "./ColumnSelector";
import { GeneralSettings } from "./GeneralSettings";
import { FormatSpecificSettings } from "./FormatSpecificSettings";
import { ScrollIndicator } from "./ScrollIndicator";
import type{ ExportFormat, ColumnOption } from "./types";
import { exportPDF, exportExcel, exportCSV, exportJSON } from "./exporters";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  dados: DadosConsulta[];
  tableName?: string;
}

export function ExportDialog({
  open,
  onClose,
  dados,
  tableName = "universidades",
}: ExportDialogProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [format, setFormat] = useState<ExportFormat>("xlsx");
  const [filename, setFilename] = useState(tableName);
  const [includeTitle, setIncludeTitle] = useState(true);
  const [includeSubtitle, setIncludeSubtitle] = useState(true);
  const [includeDate, setIncludeDate] = useState(true);
  const [customTitle, setCustomTitle] = useState(
    "Relatório de Financiamento das Universidades"
  );
  const [customSubtitle, setCustomSubtitle] = useState(
    "Dados extraídos do sistema"
  );
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "landscape"
  );
  const [jsonFormat, setJsonFormat] = useState<"pretty" | "compact">("pretty");
  const [exporting, setExporting] = useState(false);
  const [columns, setColumns] = useState<ColumnOption[]>([]);

  useEffect(() => {
    if (open && dados.length > 0) {
      const availableColumns: ColumnOption[] = [
        { id: "universidade", label: "Universidade", selected: true },
        { id: "ano", label: "Ano", selected: true },
        { id: "mes", label: "Mês", selected: true },
        { id: "funcao", label: "Função", selected: true },
        { id: "grupo_natureza", label: "Grupo Natureza", selected: true },
        { id: "origem_recursos", label: "Origem Recursos", selected: true },
        { id: "orcamento_inicial_loa", label: "Orçamento Inicial LOA", selected: true },
        { id: "total_orcamentario_ate_mes", label: "Total Orçamentário Até Mês", selected: true },
        { id: "total_orcamentario_no_mes", label: "Total Orçamentário No Mês", selected: true },
        { id: "disponibilidade_orcamentaria_ate_mes", label: "Disponibilidade Orçamentária Até Mês", selected: true },
        { id: "disponibilidade_orcamentaria_no_mes", label: "Disponibilidade Orçamentária No Mês", selected: true },
        { id: "empenhado_ate_mes", label: "Empenhado Até Mês", selected: true },
        { id: "empenhado_no_mes", label: "Empenhado No Mês", selected: true },
        { id: "liquidado_ate_mes", label: "Liquidado Até Mês", selected: true },
        { id: "liquidado_no_mes", label: "Liquidado No Mês", selected: true },
        { id: "pago_ate_mes", label: "Pago Até Mês", selected: true },
        { id: "pago_no_mes", label: "Pago No Mês", selected: true },
        { id: "valor_empenhado", label: "Valor Empenhado", selected: true },
        { id: "valor_liquidado", label: "Valor Liquidado", selected: true },
        { id: "valor_pago", label: "Valor Pago", selected: true },
        { id: "fator_correcao", label: "Fator Correção", selected: true },
      ];
      setColumns(availableColumns);
    }
  }, [open, dados]);

  const toggleColumn = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, selected: !col.selected } : col
      )
    );
  };

  const selectAllColumns = () => {
    setColumns((prev) => prev.map((col) => ({ ...col, selected: true })));
  };

  const unselectAllColumns = () => {
    setColumns((prev) => prev.map((col) => ({ ...col, selected: false })));
  };

  const handleExport = async () => {
    try {
      setExporting(true);

      if (!dados.length || !columns.some((col) => col.selected)) {
        return;
      }

      const config = {
        dados,
        columns,
        filename: filename.trim() || tableName,
        includeTitle,
        customTitle,
        includeSubtitle,
        customSubtitle,
        includeDate,
        orientation,
        jsonFormat,
      };

      switch (format) {
        case "pdf":
          await exportPDF(config);
          break;
        case "xlsx":
          await exportExcel(config);
          break;
        case "csv":
          await exportCSV(config);
          break;
        case "json":
          await exportJSON(config);
          break;
      }

      setTimeout(() => onClose(), 500);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      alert(`Erro ao exportar: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    } finally {
      setExporting(false);
    }
  };

  if (!open) return null;

  const canExport = dados.length > 0 && columns.some((col) => col.selected);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        {/* Cabeçalho FIXO */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Exportar Dados</h2>
              <p className="text-sm text-gray-500">Configure as opções de exportação</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={exporting}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corpo COM SCROLL */}
        <div ref={scrollContainerRef} className="p-6 overflow-y-auto flex-grow relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna esquerda */}
            <div className="space-y-4">
              <FormatSelector format={format} onFormatChange={setFormat} />
              <ColumnSelector
                columns={columns}
                onToggleColumn={toggleColumn}
                onSelectAll={selectAllColumns}
                onUnselectAll={unselectAllColumns}
              />
            </div>

            {/* Coluna direita */}
            <div className="space-y-4">
              <GeneralSettings
                filename={filename}
                onFilenameChange={setFilename}
                includeTitle={includeTitle}
                onIncludeTitleChange={setIncludeTitle}
                customTitle={customTitle}
                onCustomTitleChange={setCustomTitle}
                includeSubtitle={includeSubtitle}
                onIncludeSubtitleChange={setIncludeSubtitle}
                customSubtitle={customSubtitle}
                onCustomSubtitleChange={setCustomSubtitle}
                includeDate={includeDate}
                onIncludeDateChange={setIncludeDate}
                format={format}
                tableName={tableName}
              />

              <FormatSpecificSettings
                format={format}
                orientation={orientation}
                onOrientationChange={setOrientation}
                jsonFormat={jsonFormat}
                onJsonFormatChange={setJsonFormat}
              />
            </div>
          </div>

          {/* Indicador de scroll */}
          <ScrollIndicator containerRef={scrollContainerRef} />
        </div>

        {/* Rodapé FIXO */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0 z-10 rounded-b-lg">
          <div className="flex items-center gap-2">
            {!canExport && (
              <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {dados.length === 0 ? "Não há dados" : "Selecione colunas"}
              </div>
            )}

            {canExport && (
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{dados.length} registros prontos</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={exporting}
              className="px-6 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>

            <button
              onClick={handleExport}
              disabled={!canExport || exporting}
              className={`px-6 py-3 text-white rounded-lg flex items-center gap-2 font-medium transition-all ${
                !canExport || exporting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              }`}
            >
              {exporting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Exportando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Exportar {format.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}