export interface DadosConsulta {
  id?: number;
  ano: number;
  mes?: number;
  universidade: string;
  valor_empenhado: number;
  valor_liquidado: number;
  valor_pago: number;
  funcao?: string;
  grupo_natureza?: string;
  origem_recursos?: string;
  
  // Campos do IPCA
  ipca_base?: number;
  periodo_base?: string;
  fator_correcao?: number;
  
  // Novos campos do Portal da Transparência
  orcamento_inicial_loa?: number;
  total_orcamentario_ate_mes?: number;
  total_orcamentario_no_mes?: number;
  disponibilidade_orcamentaria_ate_mes?: number;
  disponibilidade_orcamentaria_no_mes?: number;
  empenhado_ate_mes?: number;
  empenhado_no_mes?: number;
  liquidado_ate_mes?: number;
  liquidado_no_mes?: number;
  pago_ate_mes?: number;
  pago_no_mes?: number;
  
  // Campo com metadados de correção
  _correcao_aplicada?: {
    fator_correcao: number;
    ipca_periodo: number;
    ipca_referencia: number;
    periodo_referencia: string;
    tipo_correcao: string;
  };
  
  // Campo de compatibilidade (é usado em alguns lugares como _correcao_aplicada)
  correcao_aplicada?: {
    fator_correcao: number;
    ipca_periodo: number;
    ipca_referencia: number;
    periodo_referencia: string;
    tipo_correcao: string;
  };
  
  // Para indexação dinâmica em funções
  [key: string]: any;
}

export interface FormData {
  tipoCorrecao: string;
  ipcaReferencia: string;
  mesInicial: string;
  anoInicial: string;
  mesFinal: string;
  anoFinal: string;
}

export interface ConsultaParams {
  data_inicio: string;
  data_fim: string;
  tipo_correcao: string;
  ipca_referencia: string;
}

export type TipoGrafico = 'barras' | 'linhas' | 'pizza' | 'area' | 'radar';
export type TipoVisualizacao = 'tabela' | 'grafico';

// Expandindo as opções de campos para comparação
export type CampoComparacao = 
  'orcamento_inicial_loa' | 
  'valor_empenhado' | 
  'valor_liquidado' | 
  'valor_pago' | 
  'empenhado_no_mes' | 
  'liquidado_no_mes' | 
  'pago_no_mes' |
  'total_orcamentario_ate_mes' |
  'total_orcamentario_no_mes' |
  'disponibilidade_orcamentaria_ate_mes' |
  'disponibilidade_orcamentaria_no_mes' |
  'empenhado_ate_mes' |
  'liquidado_ate_mes' |
  'pago_ate_mes';

export type TipoComparacao = 'universidades' | 'anos' | 'evolucao_anual';

export interface DadoGrafico {
  universidade: string;
  valor: number;
}