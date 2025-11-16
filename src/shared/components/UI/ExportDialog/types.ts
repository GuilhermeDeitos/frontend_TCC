export type ExportFormat = "pdf" | "xlsx" | "csv" | "json";

export interface ColumnOption {
  id: string;
  label: string;
  selected: boolean;
}