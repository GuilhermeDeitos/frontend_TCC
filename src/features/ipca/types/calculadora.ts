export interface FormData {
  valor: string;
  mesInicial: string;
  anoInicial: string;
  mesFinal: string;
  anoFinal: string;
}

export interface Resultado {
  indice_ipca_final: number;
  indice_ipca_inicial: number;
  valor_corrigido: number;
  valor_inicial: number;
}

export const MESES = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];