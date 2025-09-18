import React, { useState, useEffect } from "react";
import { DadosConsulta } from "../../types/consulta";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  dados: DadosConsulta[];
  tableName?: string;
}

type ExportFormat = "pdf" | "xlsx" | "csv" | "json";

interface ColumnOption {
  id: keyof DadosConsulta;
  label: string;
  selected: boolean;
}

export function ExportDialog({
  open,
  onClose,
  dados,
  tableName = "universidades",
}: ExportDialogProps) {
  // Estados para configurações de exportação
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

  // Estado para colunas selecionáveis
  const [columns, setColumns] = useState<ColumnOption[]>([]);

  // Resetar o formulário quando o modal é aberto
  useEffect(() => {
    if (open) {
      setFormat("xlsx");
      setFilename(tableName);
      setIncludeTitle(true);
      setIncludeSubtitle(true);
      setIncludeDate(true);
      setCustomTitle("Relatório de Financiamento das Universidades");
      setCustomSubtitle("Dados extraídos do sistema");
      setOrientation("landscape");
      setJsonFormat("pretty");

      // Inicializar colunas disponíveis com base nos dados
      if (dados.length > 0) {
        const sampleData = dados[0];
        const availableColumns: ColumnOption[] = [
          { id: "universidade", label: "Universidade", selected: true },
          { id: "ano", label: "Ano", selected: true },
          { id: "mes", label: "Mês", selected: true },
          { id: "funcao", label: "Função", selected: true },
          { id: "grupo_natureza", label: "Grupo Natureza", selected: true },
          { id: "origem_recursos", label: "Origem Recursos", selected: true },
          {
            id: "orcamento_inicial_loa",
            label: "Orçamento Inicial LOA",
            selected: true,
          },
          {
            id: "total_orcamentario_ate_mes",
            label: "Total Orçamentário Até Mês",
            selected: true,
          },
          {
            id: "total_orcamentario_no_mes",
            label: "Total Orçamentário No Mês",
            selected: true,
          },
          {
            id: "disponibilidade_orcamentaria_ate_mes",
            label: "Disponibilidade Orçamentária Até Mês",
            selected: true,
          },
          {
            id: "disponibilidade_orcamentaria_no_mes",
            label: "Disponibilidade Orçamentária No Mês",
            selected: true,
          },
          {
            id: "empenhado_ate_mes",
            label: "Empenhado Até Mês",
            selected: true,
          },
          { id: "empenhado_no_mes", label: "Empenhado No Mês", selected: true },
          {
            id: "liquidado_ate_mes",
            label: "Liquidado Até Mês",
            selected: true,
          },
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
    }
  }, [open, tableName]);

  // Funções para manipular colunas
  const toggleColumn = (columnId: keyof DadosConsulta) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId ? { ...col, selected: !col.selected } : col
      )
    );
  };

  const selectAllColumns = () => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({ ...col, selected: true }))
    );
  };

  const unselectAllColumns = () => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({ ...col, selected: false }))
    );
  };

  // Função para formatar números
  const formatarNumero = (valor: any): string => {
    if (valor === undefined || valor === null) return "";
    if (typeof valor === "number") {
      return valor.toString().replace(".", ",");
    }
    return String(valor);
  };

  // Função auxiliar para formatação de valores monetários
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Preparar dados com as colunas selecionadas
  const prepareData = () => {
    const selectedColumns = columns.filter((col) => col.selected);

    // Se não há colunas selecionadas, retornar erro
    if (selectedColumns.length === 0) {
      throw new Error("Nenhuma coluna selecionada para exportação.");
    }

    // Criar cabeçalhos
    const headers = selectedColumns.map((col) => col.label);

    // Criar linhas de dados
    const rows = dados.map((item) =>
      selectedColumns.map((col) => {
        const value = item[col.id];

        if (typeof value === "number") {
          return formatarNumero(value);
        }

        return value ? String(value) : "";
      })
    );

    return { headers, rows, selectedColumns };
  };

  // Funções de exportação
  const exportPDF = () => {
    try {
      const { headers, rows } = prepareData();

      // Criar documento PDF
      const doc = new jsPDF({
        orientation: orientation,
        unit: "mm",
        format: "a4",
      });

      // Adicionar título
      let y = 15;

      if (includeTitle && customTitle.trim()) {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(customTitle.trim(), 14, y);
        y += 10;
      }

      // Adicionar subtítulo
      if (includeSubtitle && customSubtitle.trim()) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(customSubtitle.trim(), 14, y);
        y += 8;
      }

      // Adicionar data
      if (includeDate) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(`Exportado em: ${new Date().toLocaleString("pt-BR")}`, 14, y);
        y += 10;
      }

      // Usar autoTable para criar a tabela
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: y,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [66, 139, 202],
          fontSize: 9,
          fontStyle: "bold",
          halign: "center",
          textColor: [255, 255, 255],
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
      });

      const finalFilename = `${filename.trim() || tableName}.pdf`;
      doc.save(finalFilename);

      return true;
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      throw error;
    }
  };

  const exportExcel = () => {
    try {
      const { selectedColumns } = prepareData();

      // Criar dados para Excel com formatação adequada
      const excelData = dados.map((item) => {
        const row: Record<string, any> = {};

        selectedColumns.forEach((col) => {
          row[col.label] = item[col.id];
        });

        return row;
      });

      // Criar planilha
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();

      // Adicionar metadados
      let sheetData = [];

      if (includeTitle && customTitle.trim()) {
        sheetData.push([customTitle.trim()]);
        sheetData.push([]);
      }

      if (includeSubtitle && customSubtitle.trim()) {
        sheetData.push([customSubtitle.trim()]);
        sheetData.push([]);
      }

      if (includeDate) {
        sheetData.push([`Exportado em: ${new Date().toLocaleString("pt-BR")}`]);
        sheetData.push([]);
      }

      // Se temos metadados, criar uma segunda planilha para eles
      if (sheetData.length > 0) {
        const metaSheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, metaSheet, "Informações");
      }

      // Adicionar planilha de dados
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

      const finalFilename = `${filename.trim() || tableName}.xlsx`;
      XLSX.writeFile(workbook, finalFilename);

      return true;
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      throw error;
    }
  };

  const exportCSV = () => {
    try {
      const { headers, rows } = prepareData();

      // Criar conteúdo CSV
      let csvContent = "";

      // Adicionar metadados como comentários
      if (includeTitle && customTitle.trim()) {
        csvContent += `# ${customTitle.trim()}\n`;
      }

      if (includeSubtitle && customSubtitle.trim()) {
        csvContent += `# ${customSubtitle.trim()}\n`;
      }

      if (includeDate) {
        csvContent += `# Exportado em: ${new Date().toLocaleString("pt-BR")}\n`;
      }

      if (csvContent) {
        csvContent += "#\n"; // Separador para os dados
      }

      // Adicionar cabeçalhos
      csvContent += headers.join(",") + "\n";

      // Adicionar linhas de dados
      csvContent += rows
        .map((row) =>
          row
            .map((cell) => {
              // Escapar aspas e adicionar aspas se contiver vírgulas ou quebras de linha
              const escaped = String(cell).replace(/"/g, '""');
              return /[,"\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
            })
            .join(",")
        )
        .join("\n");

      // Criar blob e download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const finalFilename = `${filename.trim() || tableName}.csv`;
      link.download = finalFilename;
      link.click();

      return true;
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      throw error;
    }
  };

  const exportJSON = () => {
    try {
      const { selectedColumns } = prepareData();

      // Criar objeto para exportação
      const exportObject: any = {};

      // Adicionar metadados
      if (includeTitle || includeSubtitle || includeDate) {
        exportObject.metadata = {};

        if (includeTitle && customTitle.trim()) {
          exportObject.metadata.title = customTitle.trim();
        }

        if (includeSubtitle && customSubtitle.trim()) {
          exportObject.metadata.subtitle = customSubtitle.trim();
        }

        if (includeDate) {
          exportObject.metadata.exportedAt = new Date().toISOString();
          exportObject.metadata.exportedAtFormatted = new Date().toLocaleString(
            "pt-BR"
          );
        }

        exportObject.metadata.totalRecords = dados.length;
      }

      // Adicionar dados
      exportObject.data = dados.map((item) => {
        const row: Record<string, any> = {};

        selectedColumns.forEach((col) => {
          row[col.id] = item[col.id];
        });

        return row;
      });

      // Converter para JSON com formatação conforme opção
      const jsonContent =
        jsonFormat === "pretty"
          ? JSON.stringify(exportObject, null, 2)
          : JSON.stringify(exportObject);

      // Criar blob e download
      const blob = new Blob([jsonContent], {
        type: "application/json;charset=utf-8;",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const finalFilename = `${filename.trim() || tableName}.json`;
      link.download = finalFilename;
      link.click();

      return true;
    } catch (error) {
      console.error("Erro ao exportar JSON:", error);
      throw error;
    }
  };

  // Função principal de exportação
  const handleExport = async () => {
    try {
      setExporting(true);

      // Verificar se há dados para exportar
      if (!dados.length) {
        alert("Não há dados para exportar.");
        return;
      }

      // Verificar se tem pelo menos uma coluna selecionada
      if (!columns.some((col) => col.selected)) {
        alert("Selecione pelo menos uma coluna para exportar.");
        return;
      }

      // Exportar de acordo com o formato selecionado
      switch (format) {
        case "pdf":
          await exportPDF();
          break;
        case "xlsx":
          await exportExcel();
          break;
        case "csv":
          await exportCSV();
          break;
        case "json":
          await exportJSON();
          break;
      }

      // Fechar modal após sucesso
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      alert(
        `Erro ao exportar: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    } finally {
      setExporting(false);
    }
  };

  // Calcular extensão final do arquivo
  const getFileExtension = () => {
    switch (format) {
      case "pdf":
        return ".pdf";
      case "xlsx":
        return ".xlsx";
      case "csv":
        return ".csv";
      case "json":
        return ".json";
      default:
        return "";
    }
  };

  // Configurações para ícones dos formatos
  const formatIcons = {
    xlsx: (
      <svg
        className="w-7 h-7 text-green-700"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M21.17 3.25H2.83c-.46 0-.83.37-.83.83v15.83c0 .46.37.84.83.84h18.34c.46 0 .83-.37.83-.84V4.08c0-.46-.37-.83-.83-.83zm-.83 16.67H3.67V4.92h16.67v15z" />
        <path d="M9.25 10.83h2.5v2.5h-2.5zM12.58 10.83h2.5v2.5h-2.5zM9.25 14.17h2.5v2.5h-2.5zM12.58 14.17h2.5v2.5h-2.5zM9.25 7.5h2.5V10h-2.5zM12.58 7.5h2.5V10h-2.5z" />
      </svg>
    ),
    pdf: (
      <svg
        className="w-7 h-7 text-red-600"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm12 6V9c0-.55-.45-1-1-1h-2v5h2c.55 0 1-.45 1-1zm-2-3h1v3h-1V9zm4 2h1v-1h-1V9h1V8h-2v5h1v-1zm-8 0h1c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1H9v5h1v-2z" />
      </svg>
    ),
    csv: (
      <svg
        className="w-7 h-7 text-emerald-600"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
        <path d="M10.3 11.1c-.5 0-1 .2-1.3.5-.3.3-.5.8-.5 1.4 0 .5.2 1 .5 1.3.3.3.8.5 1.3.5.4 0 .8-.1 1.1-.4.1-.1.2-.3.3-.5H13c-.1.5-.4 1-.8 1.3-.4.3-.9.5-1.5.5-.8 0-1.5-.3-2-.8s-.8-1.2-.8-2.1.3-1.6.8-2.1c.5-.5 1.2-.8 2-.8.6 0 1.1.2 1.5.5.4.3.7.8.8 1.3h-1.3c-.1-.3-.3-.5-.5-.6-.2-.1-.5-.2-.7-.2zm7.2 3.8h-1.3l-1.2-2.1-1.2 2.1h-1.3l1.8-3-1.7-2.9h1.3l1.1 2 1.1-2h1.3l-1.7 2.9 1.8 3zM6.8 14.9h.9v-5.9h-.9v2.6h-1.3V9h-.9v5.9h.9v-2.7h1.3v2.7z" />
      </svg>
    ),
    json: (
      <svg
        className="w-7 h-7 text-purple-700"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M4 21V9l8-6 8 6v12h-6v-7h-4v7z" />
        <path d="M12 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zM14.83 15c-.36 0-.7.18-.92.55l-.46.79c-.23.37-.58.55-.92.55-.55 0-1-.45-1-1v-4.07c.56-.46 1.38-1.07 1.38-2.32 0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5c0 .73.42 1.36 1.12 1.87v4.52c0 1.11.89 2 2 2 .7 0 1.38-.36 1.75-1.05l.46-.79c.23-.37.58-.55.92-.55h.58c.5 0 .92.37.98.87l.26 2.04c.07.59.57 1.04 1.17 1.04.69 0 1.21-.67 1.11-1.35l-.6-3.56c-.15-.89-.92-1.56-1.83-1.56h-2z" />
      </svg>
    ),
  };

  const formatDescriptions = {
    xlsx: "Planilha do Excel com formatação e estilos",
    pdf: "Documento PDF formatado, ideal para impressão",
    csv: "Arquivo de texto simples, compatível com diversos sistemas",
    json: "Formato estruturado para APIs e desenvolvimento",
  };

  // Se o modal não está aberto, não renderizar
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
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
            <h2 className="text-lg font-semibold">Exportar Dados</h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={exporting}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Corpo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Seleção de formato */}
          <div className="bg-gray-50 rounded-lg p-2">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Formato de Exportação
            </h3>

            <div className="space-y-2">
              {(["xlsx", "pdf", "csv", "json"] as ExportFormat[]).map((fmt) => (
                <div
                  key={fmt}
                  className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${
                    format === fmt
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => setFormat(fmt)}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`format-${fmt}`}
                      name="format"
                      checked={format === fmt}
                      onChange={() => setFormat(fmt)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`format-${fmt}`}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="shrink-0">{formatIcons[fmt]}</div>
                      <div>
                        <p className="font-medium">{fmt.toUpperCase()}</p>
                        <p className="text-sm text-gray-600">
                          {formatDescriptions[fmt]}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Colunas para exportação */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  Colunas para Exportação
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={selectAllColumns}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Selecionar tudo
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={unselectAllColumns}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              <div className="max-h-lvh overflow-y-auto border border-gray-300 rounded-md p-2 bg-white">
                <div className="grid grid-cols-2 gap-1">
                  {columns.map((col) => (
                    <div key={col.id as string} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`col-${col.id}`}
                        checked={col.selected}
                        onChange={() => toggleColumn(col.id)}
                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded-full focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`col-${col.id}`}
                        className="text-sm cursor-pointer truncate"
                        title={col.label}
                      >
                        {col.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Configurações */}
          <div className="bg-gray-50 rounded-lg p-2">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Configurações
            </h3>

            <div className="space-y-4">
              {/* Nome do arquivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do arquivo
                </label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={tableName}
                />
                <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                  Arquivo final:
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {filename.trim() || tableName}
                    {getFileExtension()}
                  </span>
                </p>
              </div>

              {/* Configurações de conteúdo */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700">
                  Conteúdo do documento
                </h4>

                {/* Título */}
                <div>
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id="include-title"
                      checked={includeTitle}
                      onChange={(e) => setIncludeTitle(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="include-title" className="text-sm">
                      Incluir título
                    </label>
                  </div>

                  {includeTitle && (
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite um título para o documento"
                    />
                  )}
                </div>

                {/* Subtítulo */}
                <div>
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id="include-subtitle"
                      checked={includeSubtitle}
                      onChange={(e) => setIncludeSubtitle(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="include-subtitle" className="text-sm">
                      Incluir subtítulo
                    </label>
                  </div>

                  {includeSubtitle && (
                    <input
                      type="text"
                      value={customSubtitle}
                      onChange={(e) => setCustomSubtitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite um subtítulo para o documento"
                    />
                  )}
                </div>

                {/* Data */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="include-date"
                    checked={includeDate}
                    onChange={(e) => setIncludeDate(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="include-date" className="text-sm">
                    Incluir data e hora da exportação
                  </label>
                </div>
              </div>

              {/* Configurações específicas */}
              {format === "pdf" && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">
                    Configurações do PDF
                  </h4>

                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        checked={orientation === "portrait"}
                        onChange={() => setOrientation("portrait")}
                        className="mr-1"
                      />
                      <span className="text-sm">Retrato</span>
                    </label>

                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        checked={orientation === "landscape"}
                        onChange={() => setOrientation("landscape")}
                        className="mr-1"
                      />
                      <span className="text-sm">Paisagem</span>
                    </label>
                  </div>

                  {/* Aviso sobre limitações do PDF */}
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-3 flex gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">
                        Atenção ao exportar PDF
                      </p>
                      <p>
                        Exportações em PDF com muitas colunas selecionadas podem
                        apresentar problemas de quebra de layout. Para melhor
                        visualização, recomendamos:
                      </p>
                      <ul className="list-disc ml-4 mt-1">
                        <li>Selecionar apenas as colunas mais importantes</li>
                        <li>Utilizar orientação paisagem</li>
                        <li>
                          Considerar outro formato (como XLSX) para exportar
                          muitos campos
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {format === "json" && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">
                    Configurações do JSON
                  </h4>

                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        checked={jsonFormat === "pretty"}
                        onChange={() => setJsonFormat("pretty")}
                        className="mr-1"
                      />
                      <span className="text-sm">Formatado (legível)</span>
                    </label>

                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        checked={jsonFormat === "compact"}
                        onChange={() => setJsonFormat("compact")}
                        className="mr-1"
                      />
                      <span className="text-sm">Compacto (menor tamanho)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex justify-between items-center p-4 border-t border-gray-300 bg-gray-50">
          <div>
            {dados.length === 0 && (
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded text-sm">
                Não há dados para exportar
              </div>
            )}

            {dados.length > 0 && !columns.some((col) => col.selected) && (
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded text-sm">
                Selecione pelo menos uma coluna
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={exporting}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              Cancelar
            </button>

            <button
              onClick={handleExport}
              disabled={
                exporting ||
                !dados.length ||
                !columns.some((col) => col.selected)
              }
              className={`
                px-4 py-2 text-white rounded-md flex items-center gap-2
                ${
                  exporting ||
                  !dados.length ||
                  !columns.some((col) => col.selected)
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              {exporting ? (
                <span>Exportando...</span>
              ) : (
                <>
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
