import { useState, useMemo, useEffect, useRef } from "react";
import type {
  DadosConsulta,
  TipoVisualizacao,
  TipoGrafico,
  DadoGrafico,
  CampoComparacao,
  TipoComparacao,
} from "../../types/consulta";
import { Table } from "../Table";
import { ChartSelector } from "../ChartSelector";
import { ChartDisplay } from "../ChartDisplay";
import { DownloadOptions } from "../DownloadOptions";
import { ComparacaoSelector } from "../ComparacaoSelector";

interface ResultsViewerProps {
  dados: DadosConsulta[];
  parametrosConsulta?: {
    anoInicial: number;
    anoFinal: number;
  };
}
interface FatorCorrecaoAno {
  ano: number;
  fator_correcao: number;
  ipca_periodo?: number;
  ipca_referencia?: number;
  periodo_referencia?: string;
  tipo_correcao?: string;
}
export function ResultsViewer({
  dados,
  parametrosConsulta,
}: ResultsViewerProps) {
  const [tipoVisualizacao, setTipoVisualizacao] =
    useState<TipoVisualizacao>("tabela");
  const [tipoGrafico, setTipoGrafico] = useState<TipoGrafico>("barras");
  const [campoComparacao, setCampoComparacao] =
    useState<CampoComparacao>("valor_pago");
  const [tipoComparacao, setTipoComparacao] =
    useState<TipoComparacao>("universidades");
  const [anoSelecionado, setAnoSelecionado] = useState<string>("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Fechar modal ao clicar fora
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
      setModalAberto(false);
    }
  };

  // Fechar modal com tecla ESC
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalAberto) {
        setModalAberto(false);
      }
    };

    if (modalAberto) {
      document.addEventListener('keydown', handleEscKey);
      // Prevenir rolagem do body quando modal está aberto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [modalAberto]);

  // Verificar anos faltantes na consulta
  const anosAusentes = useMemo(() => {
    if (!parametrosConsulta) return [];

    // Extrair anos presentes nos dados (excluindo linhas de Total)
    const anosPresentes = new Set(
      dados
        .filter((item) => !item.universidade.includes("Total"))
        .map((item) => item.ano)
    );

    // Verificar quais anos solicitados estão ausentes
    const anosAusentes = [];
    for (
      let ano = parametrosConsulta.anoInicial;
      ano <= parametrosConsulta.anoFinal;
      ano++
    ) {
      if (!anosPresentes.has(ano)) {
        anosAusentes.push(ano);
      }
    }

    return anosAusentes;
  }, [dados, parametrosConsulta]);

  // Extrair fatores de correção por ano
  const fatoresCorrecaoPorAno = useMemo(() => {
    if (!dados.length) return [];

    // Coletar registros não-Total para cada ano
    const dadosPorAno = new Map<number, DadosConsulta[]>();

    dados.forEach((item) => {
      if (!item.universidade.includes("Total")) {
        const ano = item.ano;
        if (!dadosPorAno.has(ano)) {
          dadosPorAno.set(ano, []);
        }
        dadosPorAno.get(ano)?.push(item);
      }
    });

    // Extrair fator de correção de um registro representativo de cada ano
    const fatores: FatorCorrecaoAno[] = [];

    dadosPorAno.forEach((registrosAno, ano) => {
      const registroReferencia = registrosAno[0]; // Pegar primeiro registro do ano

      if (registroReferencia) {
        // Buscar dados de correção nos metadados ou diretamente
        const correcaoAplicada =
          registroReferencia._correcao_aplicada ||
          registroReferencia.correcao_aplicada;

        if (correcaoAplicada) {
          fatores.push({
            ano,
            fator_correcao: correcaoAplicada.fator_correcao,
            ipca_periodo: correcaoAplicada.ipca_periodo,
            ipca_referencia: correcaoAplicada.ipca_referencia,
            periodo_referencia: correcaoAplicada.periodo_referencia,
            tipo_correcao: correcaoAplicada.tipo_correcao,
          });
        } else if (registroReferencia.fator_correcao) {
          // Fallback para campos diretos (menos confiáveis)
          fatores.push({
            ano,
            fator_correcao: registroReferencia.fator_correcao,
            ipca_referencia: registroReferencia.ipca_base,
            periodo_referencia: registroReferencia.periodo_base,
          });
        }
      }
    });

    // Ordenar por ano (decrescente)
    return fatores.sort((a, b) => b.ano - a.ano);
  }, [dados]);

  // Extrair informações básicas de correção monetária para referência no botão
  const infoCorrecaoBasica = useMemo(() => {
    if (!fatoresCorrecaoPorAno.length) return null;

    // Pegar o período de referência e tipo de correção (deve ser o mesmo para todos os anos)
    const primeiroFator = fatoresCorrecaoPorAno[0];

    return {
      periodo_referencia: primeiroFator.periodo_referencia || "-",
      tipo_correcao: primeiroFator.tipo_correcao || "mensal",
      total_anos: fatoresCorrecaoPorAno.length,
    };
  }, [fatoresCorrecaoPorAno]);

  // Componente Modal para detalhes de correção monetária
  const ModalDetalhesCorrecao = () => {
    if (!modalAberto) return null;

    return (
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-hidden"
        onClick={handleBackdropClick}
      >
        <div 
          ref={modalContentRef}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabeçalho do modal */}
          <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-white sticky top-0 z-10">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Detalhes da Correção Monetária
            </h3>
            <button
              onClick={() => setModalAberto(false)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              aria-label="Fechar"
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

          {/* Corpo do modal (área com scroll) */}
          <div className="p-6 overflow-y-auto flex-grow">
            <div className="mb-4 bg-blue-50 rounded-lg p-4">
              <h4 className="text-md font-medium text-blue-800 mb-2">
                Informações Gerais
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Período de Referência:</span>{" "}
                  {infoCorrecaoBasica?.periodo_referencia}
                </div>
                <div>
                  <span className="font-medium">Tipo de Correção:</span>{" "}
                  {infoCorrecaoBasica?.tipo_correcao === "anual"
                    ? "IPCA Anual (Média)"
                    : "IPCA Mensal"}
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-3">
                Os valores foram corrigidos para{" "}
                {infoCorrecaoBasica?.periodo_referencia} usando{" "}
                {infoCorrecaoBasica?.tipo_correcao === "anual"
                  ? "médias anuais"
                  : "valores mensais"}{" "}
                do IPCA.
              </p>
            </div>

            <h4 className="text-md font-medium text-gray-800 mb-2">
              Fatores de Correção por Ano
            </h4>

            {/* Tabela de fatores */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ano
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Fator de Correção
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      IPCA do Período
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      IPCA Referência
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fatoresCorrecaoPorAno.map((fator) => (
                    <tr key={fator.ano} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {fator.ano}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                        {fator.fator_correcao.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {fator.ipca_periodo
                          ? fator.ipca_periodo.toFixed(4)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {fator.ipca_referencia
                          ? fator.ipca_referencia.toFixed(4)
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
              <h4 className="text-md font-medium text-amber-800 mb-2 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
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
                Como interpretar
              </h4>
              <p className="text-amber-800 mb-2">
                O fator de correção representa o multiplicador aplicado aos
                valores originais para atualizá-los monetariamente.
              </p>
              <ul className="list-disc list-inside text-amber-700 space-y-1">
                <li>
                  Um fator maior que 1 indica que houve inflação no período.
                </li>
                <li>
                  Quanto mais antigo o ano, maior tende a ser o fator de
                  correção.
                </li>
                <li>
                  Exemplo: um valor de R$ 1.000,00 em 2010 com fator 3,5
                  equivale a R$ 3.500,00 em{" "}
                  {infoCorrecaoBasica?.periodo_referencia}.
                </li>
              </ul>
            </div>
          </div>

          {/* Rodapé do modal (fixo) */}
          <div className="flex justify-end p-4 border-t border-gray-300 bg-white sticky bottom-0 z-10">
            <button
              onClick={() => setModalAberto(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Extrair lista de anos disponíveis dos dados
  const anosDisponiveis = useMemo(() => {
    if (!dados.length) return [];
    const anos = [...new Set(dados.map((item) => item.ano.toString()))];
    return anos.sort((a, b) => a.localeCompare(b));
  }, [dados]);

  // Preparar dados para gráficos baseado no tipo de comparação
  const prepararDadosGrafico = (): DadoGrafico[] => {
    // Remover registros com "Total" no universidade para evitar duplicação de valores
    const dadosFiltrados = dados.filter(
      (item) => !item.universidade.includes("Total")
    );

    if (tipoComparacao === "universidades") {
      // Comparação entre universidades para o mesmo campo
      const dadosAgrupados = dadosFiltrados.reduce((acc, item) => {
        // Filtrar por ano específico se necessário
        if (
          anoSelecionado !== "todos" &&
          item.ano.toString() !== anoSelecionado
        ) {
          return acc;
        }

        const universidade = extrairNomeUniversidade(item.universidade);
        if (!acc[universidade]) {
          acc[universidade] = 0;
        }
        // Usar o campo selecionado para comparação
        acc[universidade] += item[campoComparacao] || 0;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(dadosAgrupados)
        .map(([universidade, valor]) => ({
          universidade,
          valor: Number(valor.toFixed(2)),
        }))
        .sort((a, b) => b.valor - a.valor);
    } else if (tipoComparacao === "anos") {
      // Comparação do mesmo campo entre diferentes anos
      const dadosAgrupados = dadosFiltrados.reduce((acc, item) => {
        const ano = item.ano.toString();
        if (!acc[ano]) {
          acc[ano] = 0;
        }
        // Usar o campo selecionado para comparação
        acc[ano] += item[campoComparacao] || 0;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(dadosAgrupados)
        .map(([ano, valor]) => ({
          universidade: `Ano ${ano}`, // Usando o mesmo campo para manter compatibilidade
          valor: Number(valor.toFixed(2)),
        }))
        .sort((a, b) => a.universidade.localeCompare(b.universidade));
    } else if (tipoComparacao === "evolucao_anual") {
      // Evolução anual agrupada por universidade
      const dadosPorUniversidadeAno = dadosFiltrados.reduce((acc, item) => {
        // Filtrar por ano específico se selecionado
        if (
          anoSelecionado !== "todos" &&
          item.ano.toString() !== anoSelecionado
        ) {
          return acc;
        }

        const universidade = extrairNomeUniversidade(item.universidade);
        const ano = item.ano.toString();
        const chave = `${universidade}-${ano}`;

        if (!acc[chave]) {
          acc[chave] = {
            universidade,
            ano,
            valor: 0,
          };
        }

        // Usar o campo selecionado para comparação
        acc[chave].valor += item[campoComparacao] || 0;

        return acc;
      }, {} as Record<string, { universidade: string; ano: string; valor: number }>);

      // Converter para array
      const resultado = Object.values(dadosPorUniversidadeAno)
        .map((item) => ({
          universidade: `${item.universidade} (${item.ano})`,
          valor: Number(item.valor.toFixed(2)),
        }))
        .sort((a, b) => a.universidade.localeCompare(b.universidade));

      return resultado;
    }

    return [];
  };

  // Função para extrair apenas o nome da universidade
  // Função para extrair apenas o nome da universidade
  const extrairNomeUniversidade = (universidadeCompleta: string): string => {
    // Remover espaços extras
    let resultado = universidadeCompleta.trim();

    // Verificar se contém o padrão de divisão por "/"
    if (resultado.includes("/")) {
      // Obter parte após a barra
      resultado = resultado.split("/")[1].trim();
    }

    // Verificar se contém o padrão de divisão por "-"
    if (resultado.includes(" - ")) {
      // Obter parte após o hífen
      resultado = resultado.split(" - ")[1].trim();
    }

    // Se for uma das siglas conhecidas das universidades, use-a
    const siglas = [
      "UEL",
      "UEM",
      "UEPG",
      "UNIOESTE",
      "UNICENTRO",
      "UNESPAR",
      "UENP",
    ];
    for (const sigla of siglas) {
      if (resultado.includes(sigla)) {
        return sigla;
      }
    }

    return resultado;
  };

  // Colunas da tabela com todos os campos
  const getTableColumns = () => {
    return [
      "Universidade",
      "Ano",
      "Função",
      "Grupo Natureza",
      "Origem Recursos",
      "Orçamento LOA (R$)",
      "Total Orçamentário Até Mês (R$)",
      "Total Orçamentário No Mês (R$)",
      "Disp. Orçamentária Até Mês (R$)",
      "Disp. Orçamentária No Mês (R$)",
      "Empenhado Até Mês (R$)",
      "Empenhado No Mês (R$)",
      "Liquidado Até Mês (R$)",
      "Liquidado No Mês (R$)",
      "Pago Até Mês (R$)",
      "Pago No Mês (R$)",
    ];
  };

  // Definir o mapeamento de colunas para propriedades
  const columnKeyMap = {
    Universidade: "universidade",
    Ano: "ano",
    Função: "funcao",
    "Grupo Natureza": "grupo_natureza",
    "Origem Recursos": "origem_recursos",
    "Orçamento LOA (R$)": "orcamento_loa",
    "Total Orçamentário Até Mês (R$)": "total_orcamentario_ate_mes",
    "Total Orçamentário No Mês (R$)": "total_orcamentario_no_mes",
    "Disp. Orçamentária Até Mês (R$)": "disponibilidade_orcamentaria_ate_mes",
    "Disp. Orçamentária No Mês (R$)": "disponibilidade_orcamentaria_no_mes",
    "Empenhado Até Mês (R$)": "empenhado_ate_mes",
    "Empenhado No Mês (R$)": "empenhado_no_mes",
    "Liquidado Até Mês (R$)": "liquidado_ate_mes",
    "Liquidado No Mês (R$)": "liquidado_no_mes",
    "Pago Até Mês (R$)": "pago_ate_mes",
    "Pago No Mês (R$)": "pago_no_mes",
  };

  // Mapear os dados para a tabela
  const mapDataForTable = () => {
    return dados.map((item, index) => {
      // Extrair apenas o nome da universidade
      const universidadeDisplay = extrairNomeUniversidade(item.universidade);

      return {
        id: item.id || index + 1,
        universidade: universidadeDisplay,
        ano: item.ano.toString(),
        funcao: item.funcao || "-",
        grupo_natureza: item.grupo_natureza || "-",
        origem_recursos: item.origem_recursos || "-",
        orcamento_loa: formatCurrency(item.orcamento_inicial_loa || 0),
        total_orcamentario_ate_mes: formatCurrency(
          item.total_orcamentario_ate_mes || 0
        ),
        total_orcamentario_no_mes: formatCurrency(
          item.total_orcamentario_no_mes || 0
        ),
        disponibilidade_orcamentaria_ate_mes: formatCurrency(
          item.disponibilidade_orcamentaria_ate_mes || 0
        ),
        disponibilidade_orcamentaria_no_mes: formatCurrency(
          item.disponibilidade_orcamentaria_no_mes || 0
        ),
        empenhado_ate_mes: formatCurrency(item.empenhado_ate_mes || 0),
        empenhado_no_mes: formatCurrency(item.empenhado_no_mes || 0),
        liquidado_ate_mes: formatCurrency(item.liquidado_ate_mes || 0),
        liquidado_no_mes: formatCurrency(item.liquidado_no_mes || 0),
        pago_ate_mes: formatCurrency(item.pago_ate_mes || 0),
        pago_no_mes: formatCurrency(item.pago_no_mes || 0),
      };
    });
  };

  // Função auxiliar para formatação de valores monetários
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Controles de Visualização */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setTipoVisualizacao("tabela")}
            className={`px-4 py-2 rounded-lg font-medium ${
              tipoVisualizacao === "tabela"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } cursor-pointer`}
          >
            Tabela
          </button>
          <button
            onClick={() => setTipoVisualizacao("grafico")}
            className={`px-4 py-2 rounded-lg font-medium ${
              tipoVisualizacao === "grafico"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } cursor-pointer`}
          >
            Gráfico
          </button>
        </div>

        {/* Opções de Download */}
        <DownloadOptions dados={dados} />
      </div>

      {/* Visualização */}
      {tipoVisualizacao === "tabela" ? (
        <div className="overflow-x-auto">
          <Table
            items={mapDataForTable()}
            columns={getTableColumns()}
            keyMap={columnKeyMap}
            itemsPerPage={10}
            tableType="comparacao"
          />
        </div>
      ) : (
        <div>
          {/* Opções de comparação para gráficos */}
          <ComparacaoSelector
            tipoComparacao={tipoComparacao}
            setTipoComparacao={setTipoComparacao}
            campoSelecionado={campoComparacao}
            setCampoSelecionado={setCampoComparacao}
          />

          {/* Seletor de ano para evolução anual */}
          {tipoComparacao === "evolucao_anual" && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Filtrar por Ano:
              </label>
              <select
                value={anoSelecionado}
                onChange={(e) => setAnoSelecionado(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos os Anos</option>
                {anosDisponiveis.map((ano) => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
              <p className="text-xs text-blue-600 mt-1">
                {anoSelecionado === "todos"
                  ? "Mostrando dados de todos os anos"
                  : `Mostrando apenas dados do ano ${anoSelecionado}`}
              </p>
            </div>
          )}
          {/* Tipo de gráfico */}
          <ChartSelector tipoGrafico={tipoGrafico} onChange={setTipoGrafico} />

          {/* Título do gráfico */}
          <h3 className="text-center text-lg font-medium text-gray-800 mb-2">
            {getCampoLabel(campoComparacao)} -{" "}
            {getTipoComparacaoLabel(tipoComparacao)}
            {tipoComparacao === "evolucao_anual" &&
              anoSelecionado !== "todos" &&
              ` (Ano ${anoSelecionado})`}
          </h3>

          {/* Exibição do gráfico */}
          <ChartDisplay
            dados={prepararDadosGrafico()}
            tipoGrafico={tipoGrafico}
          />
        </div>
      )}

      {/* Novo rodapé com informações de correção monetária */}
      {dados.length > 0 && infoCorrecaoBasica && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
          <div className="text-sm">
            <span className="font-medium text-blue-800">Valores corrigidos para:</span>{" "}
            <span className="text-blue-700">{infoCorrecaoBasica.periodo_referencia}</span>
          </div>
          
          <button
            onClick={() => setModalAberto(true)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center gap-1 cursor-pointer" 
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Detalhes da Correção ({infoCorrecaoBasica.total_anos} anos)
          </button>
        </div>
      )}
      
      {/* Modal de detalhes de correção */}
      <ModalDetalhesCorrecao />
      {/* Aviso de anos ausentes */}
      {anosAusentes.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
          <h3 className="text-md font-semibold text-yellow-800 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
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
            Atenção: Dados incompletos
          </h3>
          <p className="text-sm text-yellow-700 mt-1">
            Não foram encontrados dados para os seguintes anos:{" "}
            <strong>{anosAusentes.join(", ")}</strong>.
          </p>
          <p className="text-sm text-yellow-700 mt-2">
            Recomendações:
            <ul className="list-disc pl-5 mt-1">
              <li>Refaça a consulta para tentar obter os dados novamente</li>
              <li>
                Se o problema persistir, tente consultar esses anos
                individualmente
              </li>
              <li>
                Verifique se existem dados disponíveis para esses anos no Portal
                da Transparência
              </li>
            </ul>
          </p>
        </div>
      )}
    </div>
  );
}

// Funções auxiliares para labels
function getCampoLabel(campo: CampoComparacao): string {
  const labels: Record<CampoComparacao, string> = {
    orcamento_inicial_loa: "Orçamento Inicial (LOA)",
    valor_empenhado: "Valor Empenhado",
    valor_liquidado: "Valor Liquidado",
    valor_pago: "Valor Pago",
    empenhado_no_mes: "Empenhado no Mês",
    liquidado_no_mes: "Liquidado no Mês",
    pago_no_mes: "Pago no Mês",
    total_orcamentario_ate_mes: "Total Orçamentário Até Mês",
    total_orcamentario_no_mes: "Total Orçamentário No Mês",
    disponibilidade_orcamentaria_ate_mes: "Disp. Orçamentária Até Mês",
    disponibilidade_orcamentaria_no_mes: "Disp. Orçamentária No Mês",
    empenhado_ate_mes: "Empenhado Até Mês",
    liquidado_ate_mes: "Liquidado Até Mês",
    pago_ate_mes: "Pago Até Mês",
  };
  return labels[campo] || campo;
}

function getTipoComparacaoLabel(tipo: TipoComparacao): string {
  const labels: Record<TipoComparacao, string> = {
    universidades: "Comparação entre Universidades",
    anos: "Comparação entre Anos",
    evolucao_anual: "Evolução Anual por Universidade",
  };
  return labels[tipo] || tipo;
}
