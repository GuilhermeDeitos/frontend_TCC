export interface SerieIPCA {
  id: number;
  data: string;
  valor: number;
}

export type FilterType = "all" | "year" | "month";

export interface FilterState {
  type: FilterType;
  year: string;
  month: string;
}