import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type { DadosConsulta } from "../../types/consulta";
import type{ ColumnOption } from "./types";

interface ExportConfig {
  dados: DadosConsulta[];
  columns: ColumnOption[];
  filename: string;
  includeTitle: boolean;
  customTitle: string;
  includeSubtitle: boolean;
  customSubtitle: string;
  includeDate: boolean;
  orientation: "portrait" | "landscape";
  jsonFormat: "pretty" | "compact";
}

const formatarNumero = (valor: any): string => {
  if (valor === undefined || valor === null) return "";
  if (typeof valor === "number") {
    return valor.toString().replace(".", ",");
  }
  return String(valor);
};

const prepareData = (dados: DadosConsulta[], columns: ColumnOption[]) => {
  const selectedColumns = columns.filter((col) => col.selected);

  if (selectedColumns.length === 0) {
    throw new Error("Nenhuma coluna selecionada para exportação.");
  }

  const headers = selectedColumns.map((col) => col.label);

  const rows = dados.map((item: any) =>
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

export async function exportPDF(config: ExportConfig) {
  const { dados, columns, filename, includeTitle, customTitle, includeSubtitle, customSubtitle, includeDate, orientation } = config;
  
  const { headers, rows } = prepareData(dados, columns);

  const doc = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  });

  let y = 15;

  if (includeTitle && customTitle.trim()) {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(customTitle.trim(), 14, y);
    y += 10;
  }

  if (includeSubtitle && customSubtitle.trim()) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(customSubtitle.trim(), 14, y);
    y += 8;
  }

  if (includeDate) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`Exportado em: ${new Date().toLocaleString("pt-BR")}`, 14, y);
    y += 10;
  }

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: y,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: {
      fillColor: [66, 139, 202],
      fontSize: 9,
      fontStyle: "bold",
      halign: "center",
      textColor: [255, 255, 255],
    },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  doc.save(`${filename}.pdf`);
}

export async function exportExcel(config: ExportConfig) {
  const { dados, columns, filename, includeTitle, customTitle, includeSubtitle, customSubtitle, includeDate } = config;
  
  const { selectedColumns } = prepareData(dados, columns);

  const excelData = dados.map((item: any) => {
    const row: Record<string, any> = {};
    selectedColumns.forEach((col) => {
      row[col.label] = item[col.id];
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

  const monetaryFields = [
    "orcamento_inicial_loa", "total_orcamentario_ate_mes", "total_orcamentario_no_mes",
    "disponibilidade_orcamentaria_ate_mes", "disponibilidade_orcamentaria_no_mes",
    "empenhado_ate_mes", "empenhado_no_mes", "liquidado_ate_mes", "liquidado_no_mes",
    "pago_ate_mes", "pago_no_mes", "valor_empenhado", "valor_liquidado", "valor_pago",
  ];

  const monetaryColumns: number[] = [];
  selectedColumns.forEach((col, index) => {
    if (monetaryFields.includes(col.id)) {
      monetaryColumns.push(index);
    }
  });

  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    monetaryColumns.forEach((colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex });
      const cell = worksheet[cellAddress];
      if (cell && typeof cell.v === "number") {
        cell.z = "R$ #,##0.00";
        cell.t = "n";
      }
    });
  }

  worksheet["!cols"] = selectedColumns.map((col) => ({
    wch: monetaryFields.includes(col.id) ? 20 : Math.max(col.label.length + 2, 15),
  }));

  const workbook = XLSX.utils.book_new();

  if (includeTitle || includeSubtitle || includeDate) {
    const sheetData: any[] = [];
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
    const metaSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, metaSheet, "Informações");
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export async function exportCSV(config: ExportConfig) {
  const { dados, columns, filename, includeTitle, customTitle, includeSubtitle, customSubtitle, includeDate } = config;
  
  const { headers, rows } = prepareData(dados, columns);

  let csvContent = "";

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
    csvContent += "#\n";
  }

  csvContent += headers.join(",") + "\n";
  csvContent += rows
    .map((row) =>
      row
        .map((cell) => {
          const escaped = String(cell).replace(/"/g, '""');
          return /[,"\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

export async function exportJSON(config: ExportConfig) {
  const { dados, columns, filename, includeTitle, customTitle, includeSubtitle, customSubtitle, includeDate, jsonFormat } = config;
  
  const { selectedColumns } = prepareData(dados, columns);

  const exportObject: any = {};

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
      exportObject.metadata.exportedAtFormatted = new Date().toLocaleString("pt-BR");
    }
    exportObject.metadata.totalRecords = dados.length;
  }

  exportObject.data = dados.map((item: any) => {
    const row: Record<string, any> = {};
    selectedColumns.forEach((col) => {
      row[col.id] = item[col.id];
    });
    return row;
  });

  const jsonContent = jsonFormat === "pretty" ? JSON.stringify(exportObject, null, 2) : JSON.stringify(exportObject);

  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.json`;
  link.click();
}