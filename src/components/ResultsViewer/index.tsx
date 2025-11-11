import { useState, useMemo } from "react";
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
import { CorrecaoModal } from "../CorrecaoModal";
import { ResultsFilterPanel } from "./FilterPanel";
import { TableControls } from "./TableControls";
import type { ChartContextType } from "../../types/chart";

interface ResultsViewerProps {
  dados: DadosConsulta[];
  parametrosConsulta?: {
    anoInicial: number;
    anoFinal: number;
  };
  onVisualizacaoChange?: (tipo: "tabela" | "grafico") => void;
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
  onVisualizacaoChange,
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

  // Novos estados para filtros e controles de tabela
  const [filterType, setFilterType] = useState<string>("all");
  const [filterValue, setFilterValue] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selectedUniversidadesEvolucao, setSelectedUniversidadesEvolucao] =
    useState<string[]>([]);

  const [isCompactMode, setIsCompactMode] = useState<boolean>(false);

  // Handler melhorado para mudança de visualização
  const handleVisualizacaoChange = (tipo: TipoVisualizacao) => {
    setTipoVisualizacao(tipo);
    if (onVisualizacaoChange) {
      onVisualizacaoChange(tipo);
    }
  };

  const handleAbrirModalCorrecao = () => {
    setModalAberto(true);
  };

  // Verificar anos faltantes na consulta
  const anosAusentes = useMemo(() => {
    if (!parametrosConsulta) return [];

    const anosPresentes = new Set(
      dados
        .filter((item) => !item.universidade.includes("Total"))
        .map((item) => item.ano)
    );

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

    const fatores: FatorCorrecaoAno[] = [];

    dadosPorAno.forEach((registrosAno, ano) => {
      const registroReferencia = registrosAno[0];

      if (registroReferencia) {
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
          fatores.push({
            ano,
            fator_correcao: registroReferencia.fator_correcao,
            ipca_referencia: registroReferencia.ipca_base,
            periodo_referencia: registroReferencia.periodo_base,
          });
        }
      }
    });

    return fatores.sort((a, b) => b.ano - a.ano);
  }, [dados]);

  const infoCorrecaoBasica = useMemo(() => {
    if (!fatoresCorrecaoPorAno.length) return null;

    const primeiroFator = fatoresCorrecaoPorAno[0];

    return {
      periodo_referencia: primeiroFator.periodo_referencia || "-",
      tipo_correcao: primeiroFator.tipo_correcao || "mensal",
      total_anos: fatoresCorrecaoPorAno.length,
    };
  }, [fatoresCorrecaoPorAno]);

  // Extrair lista de anos disponíveis
  const anosDisponiveis = useMemo(() => {
    if (!dados.length) return [];
    const anos = [...new Set(dados.map((item) => item.ano.toString()))];
    return anos.sort((a, b) => a.localeCompare(b));
  }, [dados]);

  // Opções de filtro baseadas no tipo selecionado
  const filterOptions = useMemo(() => {
    if (filterType === "all" || filterType === "year") return [];

    const values = new Set<string>();
    dados.forEach((item) => {
      if (!item.universidade.includes("Total")) {
        const fieldValue = item[filterType as keyof DadosConsulta];
        if (fieldValue) {
          values.add(String(fieldValue));
        }
      }
    });

    return Array.from(values)
      .sort()
      .map((value) => ({ value, label: value }));
  }, [dados, filterType]);

  // Filtrar dados da tabela
  const filteredDados = useMemo(() => {
    if (filterType === "all" || !filterValue) return dados;

    return dados.filter((item) => {
      if (filterType === "year") {
        return item.ano.toString() === filterValue;
      }

      const fieldValue = item[filterType as keyof DadosConsulta];
      return String(fieldValue) === filterValue;
    });
  }, [dados, filterType, filterValue]);

  // Preparar dados para gráficos
  const prepararDadosGrafico = (): DadoGrafico[] => {
    const dadosFiltrados = dados.filter(
      (item) => !item.universidade.includes("Total")
    );

    if (tipoComparacao === "universidades") {
      const dadosAgrupados = dadosFiltrados.reduce((acc, item) => {
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
      const dadosAgrupados = dadosFiltrados.reduce((acc, item) => {
        const ano = item.ano.toString();
        if (!acc[ano]) {
          acc[ano] = 0;
        }
        acc[ano] += item[campoComparacao] || 0;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(dadosAgrupados)
        .map(([ano, valor]) => ({
          universidade: `Ano ${ano}`,
          valor: Number(valor.toFixed(2)),
        }))
        .sort((a, b) => a.universidade.localeCompare(b.universidade));
    } else if (tipoComparacao === "evolucao_anual") {
      const dadosPorUniversidadeAno = dadosFiltrados.reduce((acc, item) => {
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

        acc[chave].valor += item[campoComparacao] || 0;

        return acc;
      }, {} as Record<string, { universidade: string; ano: string; valor: number }>);

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

  const extrairNomeUniversidade = (universidadeCompleta: string): string => {
    let resultado = universidadeCompleta.trim();

    if (resultado.includes("/")) {
      resultado = resultado.split("/")[1].trim();
    }

    if (resultado.includes(" - ")) {
      resultado = resultado.split(" - ")[1].trim();
    }

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

  const mapDataForTable = () => {
    return filteredDados.map((item, index) => {
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

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const chartContext = useMemo((): ChartContextType => {
    if (tipoComparacao === "anos") return "temporal";
    if (tipoComparacao === "evolucao_anual") return "evolution";
    return "comparison";
  }, [tipoComparacao]);

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-6"
      data-tour="results-viewer"
    >
      {/* Controles de Visualização */}
      <div
        className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"
        data-tour="view-toggle"
      >
        <div className="flex gap-2">
          <button
            onClick={() => handleVisualizacaoChange("tabela")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tipoVisualizacao === "tabela"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Tabela
          </button>
          <button
            onClick={() => handleVisualizacaoChange("grafico")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tipoVisualizacao === "grafico"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Gráfico
          </button>
        </div>

        <div data-tour="export-options">
          <DownloadOptions dados={dados} />
        </div>
      </div>

      {/* Visualização */}
      {tipoVisualizacao === "tabela" ? (
        <>
          {/* Filtro externo */}
          <ResultsFilterPanel
            filterType={filterType}
            filterValue={filterValue}
            onFilterTypeChange={setFilterType}
            onFilterValueChange={setFilterValue}
            filterOptions={filterOptions}
            availableYears={anosDisponiveis}
          />

          {/* Controles da tabela */}
          <TableControls
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            isCompact={isCompactMode}
            onCompactToggle={() => setIsCompactMode(!isCompactMode)}
            totalItems={filteredDados.length}
          />

          {/* Tabela */}
          <div className="overflow-x-auto" data-tour="table-view">
            <Table
              items={mapDataForTable()}
              columns={getTableColumns()}
              keyMap={columnKeyMap}
              itemsPerPage={itemsPerPage}
              tableType="comparacao"
              hideFilters={true}
              isCompact={isCompactMode}
            />
          </div>
        </>
      ) : (
        <div data-tour="chart-area">
          <div data-tour="comparison-selector">
            <ComparacaoSelector
              tipoComparacao={tipoComparacao}
              setTipoComparacao={setTipoComparacao}
              campoSelecionado={campoComparacao}
              setCampoSelecionado={setCampoComparacao}
            />
          </div>

          {tipoComparacao === "evolucao_anual" && (
            <div
              className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md"
              data-tour="year-filter"
            >
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
            </div>
          )}

          <div data-tour="chart-type">
            <ChartSelector
              tipoGrafico={tipoGrafico}
              onChange={setTipoGrafico}
            />
          </div>

          <h3 className="text-center text-lg font-medium text-gray-800 mb-2">
            {getCampoLabel(campoComparacao)} -{" "}
            {getTipoComparacaoLabel(tipoComparacao)}
            {tipoComparacao === "evolucao_anual" &&
              anoSelecionado !== "todos" &&
              ` (Ano ${anoSelecionado})`}
          </h3>

          <div data-tour="chart-display">
            <ChartDisplay
              dados={prepararDadosGrafico()}
              tipoGrafico={tipoGrafico}
              chartContext={chartContext}
              onUniversidadeSelect={setSelectedUniversidadesEvolucao}
              selectedUniversidades={selectedUniversidadesEvolucao}
            />
          </div>
        </div>
      )}

      {/* Rodapé com informações de correção */}
      {dados.length > 0 && infoCorrecaoBasica && (
        <div
          className="mt-6 p-4 bg-blue-50 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3"
          data-tour="correcao-footer"
        >
          <div className="text-sm">
            <span className="font-medium text-blue-800">
              Valores corrigidos para:
            </span>{" "}
            <span className="text-blue-700">
              {infoCorrecaoBasica.periodo_referencia}
            </span>
          </div>

          <button
            onClick={handleAbrirModalCorrecao}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center gap-1 cursor-pointer transition-colors"
          >
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
            Detalhes da Correção ({infoCorrecaoBasica.total_anos} anos)
          </button>
        </div>
      )}

      <CorrecaoModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        fatoresCorrecao={fatoresCorrecaoPorAno}
        infoBasica={infoCorrecaoBasica}
      />

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
        </div>
      )}
    </div>
  );
}

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
