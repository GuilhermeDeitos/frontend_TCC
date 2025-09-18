import type { CampoComparacao, TipoComparacao } from "../../types/consulta";

interface ComparacaoSelectorProps {
  tipoComparacao: TipoComparacao;
  setTipoComparacao: (tipo: TipoComparacao) => void;
  campoSelecionado: CampoComparacao;
  setCampoSelecionado: (campo: CampoComparacao) => void;
}

export function ComparacaoSelector({ 
  tipoComparacao, 
  setTipoComparacao, 
  campoSelecionado, 
  setCampoSelecionado 
}: ComparacaoSelectorProps) {
  // Lista ampliada de opções para comparação
  const opcoesComparacao = [
    { value: 'orcamento_inicial_loa', label: 'Orçamento Inicial (LOA)' },
    { value: 'valor_empenhado', label: 'Valor Empenhado' },
    { value: 'valor_liquidado', label: 'Valor Liquidado' },
    { value: 'valor_pago', label: 'Valor Pago' },
    { value: 'total_orcamentario_ate_mes', label: 'Total Orçamentário Até Mês' },
    { value: 'total_orcamentario_no_mes', label: 'Total Orçamentário No Mês' },
    { value: 'disponibilidade_orcamentaria_ate_mes', label: 'Disp. Orçamentária Até Mês' },
    { value: 'disponibilidade_orcamentaria_no_mes', label: 'Disp. Orçamentária No Mês' },
    { value: 'empenhado_ate_mes', label: 'Empenhado Até Mês' },
    { value: 'empenhado_no_mes', label: 'Empenhado no Mês' },
    { value: 'liquidado_ate_mes', label: 'Liquidado Até Mês' },
    { value: 'liquidado_no_mes', label: 'Liquidado no Mês' },
    { value: 'pago_ate_mes', label: 'Pago Até Mês' },
    { value: 'pago_no_mes', label: 'Pago no Mês' }
  ];

  // Agrupar opções para facilitar a seleção
  const gruposOpcoes = [
    {
      titulo: "Valores Principais",
      opcoes: opcoesComparacao.slice(0, 4)
    },
    {
      titulo: "Valores Orçamentários",
      opcoes: opcoesComparacao.slice(4, 8)
    },
    {
      titulo: "Valores Mensais e Acumulados",
      opcoes: opcoesComparacao.slice(8)
    }
  ];

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Opções de Comparação</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Comparação
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setTipoComparacao('universidades')}
              className={`px-3 py-1.5 rounded text-sm flex-1 ${
                tipoComparacao === 'universidades' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Entre Universidades
            </button>
            <button
              onClick={() => setTipoComparacao('anos')}
              className={`px-3 py-1.5 rounded text-sm flex-1 ${
                tipoComparacao === 'anos' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Entre Anos
            </button>
            <button
              onClick={() => setTipoComparacao('evolucao_anual')}
              className={`px-3 py-1.5 rounded text-sm flex-1 ${
                tipoComparacao === 'evolucao_anual' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Evolução Anual
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Campo para Comparação
          </label>
          <select
            value={campoSelecionado}
            onChange={(e) => setCampoSelecionado(e.target.value as CampoComparacao)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {gruposOpcoes.map(grupo => (
              <optgroup key={grupo.titulo} label={grupo.titulo}>
                {grupo.opcoes.map(opcao => (
                  <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}