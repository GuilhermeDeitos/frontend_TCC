import { createColumnHelper } from "@tanstack/react-table";

const getBadgeClass = (value: any): string => {
  if (value === null || value === undefined || value === "-") return 'bg-gray-100 text-gray-800';
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : value;
  if (isNaN(numValue)) return 'bg-gray-100 text-gray-800';
  if (numValue === 0) return 'bg-blue-100 text-blue-900';
  if (numValue < 0) return 'bg-red-100 text-red-900';
  return 'bg-green-100 text-green-900';
};

const formatCurrency = (value: any) => {
  if (value === null || value === undefined) return "-";
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return value;
  return numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const CurrencyBadgeCell = (info: any) => {
  const value = info.getValue();
  const formatted = formatCurrency(value);
  return (
    <span className={`inline-flex items-center rounded-full font-medium px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm ${getBadgeClass(value)}`}>
      {formatted}
    </span>
  );
};

const columnHelper = createColumnHelper<any>();

export const columns = [
  columnHelper.accessor("universidade", {
    id: "universidade", // ID Adicionado
    header: "Universidade",
    cell: info => info.getValue() || "-",
  }),
  columnHelper.accessor("ano", {
    id: "ano", // ID Adicionado
    header: "Ano",
    cell: info => info.getValue() || "-",
  }),
  columnHelper.accessor("funcao", {
    id: "funcao", // ID Adicionado
    header: "Função",
    cell: info => info.getValue() || "-",
  }),
  columnHelper.accessor("grupo_natureza", {
    id: "grupo_natureza", // ID Adicionado
    header: "Grupo Natureza",
    cell: info => info.getValue() || "-",
  }),
  columnHelper.accessor("origem_recursos", {
    id: "origem_recursos", // ID Adicionado
    header: "Origem Recursos",
    cell: info => info.getValue() || "-",
  }),
  columnHelper.accessor("orcamento_inicial_loa", {
    id: "orcamento_inicial_loa", // ID Adicionado
    header: "Orçamento LOA (R$)",
    cell: CurrencyBadgeCell,
  }),
  columnHelper.accessor("total_orcamentario_ate_mes", {
    id: "total_orcamentario_ate_mes",
    header: "Total Orçamentário Até Mês (R$)",
    cell: CurrencyBadgeCell,
  }),
  columnHelper.accessor("total_orcamentario_no_mes", {
    id: "total_orcamentario_no_mes",
    header: "Total Orçamentário No Mês (R$)",
    cell: CurrencyBadgeCell,
  }),
  columnHelper.accessor("disponibilidade_orcamentaria_ate_mes", {
    id: "disponibilidade_orcamentaria_ate_mes",
    header: "Disp. Orçamentária Até Mês (R$)",
    cell: CurrencyBadgeCell,
  }),
  columnHelper.accessor("disponibilidade_orcamentaria_no_mes", {
    id: "disponibilidade_orcamentaria_no_mes",
    header: "Disp. Orçamentária No Mês (R$)",
    cell: CurrencyBadgeCell,
  }),
  columnHelper.accessor("empenhado_ate_mes", {
    id: "empenhado_ate_mes",
    header: "Empenhado Até Mês (R$)",
    cell: CurrencyBadgeCell,
  }),
  columnHelper.accessor("empenhado_no_mes", {
    id: "empenhado_no_mes",
    header: "Empenhado No Mês (R$)",
    cell: CurrencyBadgeCell,
  }),
  columnHelper.accessor("liquidado_ate_mes", {
    id: "liquidado_ate_mes",
    header: "Liquidado Até Mês (R$)",
    cell: CurrencyBadgeCell,
  }),
  columnHelper.accessor("liquidado_no_mes", {
    id: "liquidado_no_mes",
    header: "Liquidado No Mês (R$)",
    cell: CurrencyBadgeCell,
  }),
  columnHelper.accessor("pago_ate_mes", {
    id: "pago_ate_mes",
    header: "Pago Até Mês (R$)",
    cell: CurrencyBadgeCell,
  }),
  columnHelper.accessor("pago_no_mes", {
    id: "pago_no_mes",
    header: "Pago No Mês (R$)",
    cell: CurrencyBadgeCell,
  }),
];