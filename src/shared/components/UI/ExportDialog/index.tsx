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
  filteredDados: DadosConsulta[];
  hasActiveFilters: boolean;
  tableName?: string;
}

export function ExportDialog({
  open,
  onClose,
  dados,
  filteredDados,
  hasActiveFilters,
  tableName = "universidades",
}: ExportDialogProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [exportDataType, setExportDataType] = useState<"filtered" | "all">(
    hasActiveFilters ? "filtered" : "all"
  );  
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
    if (hasActiveFilters) {
      setExportDataType("filtered");
    }
  }, [hasActiveFilters]);

  const dataToExport = exportDataType === "filtered" ? filteredDados : dados;

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

      if (!dataToExport.length || !columns.some((col) => col.selected)) {
        return;
      }

      const config = {
        dados: dataToExport,
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

  const canExport = dataToExport.length > 0 && columns.some((col) => col.selected);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        {/* Cabeçalho FIXO - Responsivo */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 sm:p-6 border-b border-gray-200 bg-white sticky top-0 z-10 rounded-t-lg">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                Exportar Dados
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                Configure as opções
              </p>
            </div>
          </div>

          {/* Seletor de Dados - Compacto */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {hasActiveFilters && (
              <div className="flex items-center gap-2 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 flex-1 sm:flex-none">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                    {exportDataType === "all" ? "Todos" : "Filtrados"}:
                  </span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                    exportDataType === "filtered" 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {dataToExport.length.toLocaleString('pt-BR')}
                  </span>
                </div>

                <button
                  onClick={() => setExportDataType(prev => prev === "filtered" ? "all" : "filtered")}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex-shrink-0 ${
                    exportDataType === "filtered" ? "bg-blue-600" : "bg-gray-400"
                  }`}
                  title={exportDataType === "filtered" 
                    ? "Clique para exportar todos os dados" 
                    : "Clique para exportar apenas dados filtrados"
                  }
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      exportDataType === "filtered" ? "translate-x-5 sm:translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              disabled={exporting}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Corpo COM SCROLL */}
        <div ref={scrollContainerRef} className="p-3 sm:p-6 overflow-y-auto flex-grow relative">
          {/* Info sutil quando há filtros ativos */}
          {hasActiveFilters && (
            <div className="mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2 text-xs sm:text-sm">
              <svg
                className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-blue-800">
                {exportDataType === "filtered" ? (
                  <>
                    Exportando <strong>{filteredDados.length}</strong> registros filtrados 
                    <span className="hidden sm:inline"> ({dados.length - filteredDados.length} ocultos)</span>
                  </>
                ) : (
                  <>
                    Exportando <strong>todos</strong> os {dados.length} registros
                  </>
                )}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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

          <ScrollIndicator containerRef={scrollContainerRef} />
        </div>

        {/* Rodapé FIXO - Responsivo */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3 sm:p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0 z-10 rounded-b-lg">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!canExport && (
              <div className="bg-amber-100 text-amber-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 w-full sm:w-auto justify-center">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="truncate">{dataToExport.length === 0 ? "Não há dados" : "Selecione colunas"}</span>
              </div>
            )}

            {canExport && (
              <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 w-full sm:w-auto">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="truncate">
                  <span className="text-blue-600 font-bold">{dataToExport.length}</span> registros
                  {hasActiveFilters && exportDataType === "filtered" && (
                    <span className="text-gray-500 hidden sm:inline"> (filtrados)</span>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              disabled={exporting}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              Cancelar
            </button>

            <button
              onClick={handleExport}
              disabled={!canExport || exporting}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all text-xs sm:text-sm ${
                !canExport || exporting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {exporting ? (
                <>
                  <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="hidden sm:inline">Exportando...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Exportar {format.toUpperCase()}</span>
                  <span className="sm:hidden">{format.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}