import {
  memo,
  lazy,
  Suspense,
  useMemo,
  useCallback,
  startTransition,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { DadosConsulta } from "../../types/consulta";
import type { ChartContextType } from "../../types/chart";

// Imports estáticos (leves)
import { DownloadOptions } from "../../components/DownloadOptions";
import { ComparacaoSelector } from "../../components/ComparacaoSelector";
import { CompactFilterPanel } from "../../components/CompactFilterPanel";
import { FilterSummary } from "../../components/FilterSummary";
import { TableControls } from "../../components/ResultsViewer/TableControls";

// Lazy imports (componentes pesados)
const Table = lazy(() =>
  import("../../components/Table").then((m) => ({ default: m.Table }))
);
const ChartDisplay = lazy(() =>
  import("../../components/ChartDisplay").then((m) => ({
    default: m.ChartDisplay,
  }))
);
const ChartSelector = lazy(() =>
  import("../../components/ChartSelector").then((m) => ({
    default: m.ChartSelector,
  }))
);
const CorrecaoModal = lazy(() =>
  import("../../components/CorrecaoModal").then((m) => ({
    default: m.CorrecaoModal,
  }))
);

// Hooks customizados
import { useDataFilters } from "../../hooks/useDataFilter";
import { useResultsViewerState } from "../../hooks/useResultsViewerState";
import { useChartDataProcessor } from "../../hooks/useChartDataProcessor";
import { useTableDataProcessor } from "../../hooks/useTableDataProcessor";
import { useCorrecaoMetadata } from "../../hooks/useCorrecaoMetadata";

interface ResultsViewerProps {
  dados: DadosConsulta[];
  parametrosConsulta?: {
    anoInicial: number;
    anoFinal: number;
  };
  onVisualizacaoChange?: (tipo: "tabela" | "grafico") => void;
}

// Componente de loading
const LoadingFallback = memo(() => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
));
LoadingFallback.displayName = "LoadingFallback";

// Constantes
const TABLE_COLUMNS = [
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

const COLUMN_KEY_MAP = {
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

export const ResultsViewer = memo(function ResultsViewer({
  dados,
  parametrosConsulta,
  onVisualizacaoChange,
}: ResultsViewerProps) {
  // Função de extração de nome de universidade (memoizada)
  const extrairNomeUniversidade = useCallback(
    (universidadeCompleta: string): string => {
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
    },
    []
  );

  // Estado do ResultsViewer
  const {
    tipoVisualizacao,
    tipoGrafico,
    campoComparacao,
    tipoComparacao,
    anoSelecionado,
    modalAberto,
    itemsPerPage,
    selectedUniversidadesEvolucao,
    isCompactMode,
    setTipoGrafico,
    setCampoComparacao,
    setTipoComparacao,
    setAnoSelecionado,
    setItemsPerPage,
    setSelectedUniversidadesEvolucao,
    setIsCompactMode,
    handleVisualizacaoChange,
    handleAbrirModalCorrecao,
    handleFecharModalCorrecao,
  } = useResultsViewerState(onVisualizacaoChange);

  // Filtros de dados
  const {
    filters,
    filteredData,
    availableYears,
    availableFilterOptions,
    activeFiltersCount,
    handleAddFilter,
    handleRemoveFilter,
    handleFilterChange,
  } = useDataFilters({
    dados,
    extractUniversityName: extrairNomeUniversidade,
  });

  // Processar dados de tabela
  const { dadosTabela } = useTableDataProcessor({
    dados: filteredData,
    extrairNomeUniversidade,
  });

  // Processar dados de gráfico
  const dadosGrafico = useChartDataProcessor({
    dados: filteredData,
    campoComparacao,
    tipoComparacao,
    anoSelecionado,
    extrairNomeUniversidade,
  });

  // Metadados de correção
  const { fatoresCorrecaoPorAno, infoCorrecaoBasica } =
    useCorrecaoMetadata(dados);

  // Anos disponíveis para filtro
  const anosDisponiveis = useMemo(() => {
    if (!dados.length) return [];
    const anos = [...new Set(dados.map((item) => item.ano.toString()))];
    return anos.sort();
  }, [dados]);

  // Anos ausentes
  const anosAusentes = useMemo(() => {
    if (!parametrosConsulta) return [];

    const anosPresentes = new Set(
      dados
        .filter((item) => !item.universidade.includes("Total"))
        .map((item) => item.ano)
    );

    const ausentes = [];
    for (
      let ano = parametrosConsulta.anoInicial;
      ano <= parametrosConsulta.anoFinal;
      ano++
    ) {
      if (!anosPresentes.has(ano)) {
        ausentes.push(ano);
      }
    }

    return ausentes;
  }, [dados, parametrosConsulta]);

  // Contexto do gráfico
  const chartContext = useMemo((): ChartContextType => {
    if (tipoComparacao === "anos") return "temporal";
    if (tipoComparacao === "evolucao_anual") return "evolution";
    return "comparison";
  }, [tipoComparacao]);

  // Handler de mudança de visualização com transição
  const handleVisualizacaoChangeWithTransition = useCallback(
    (tipo: "tabela" | "grafico") => {
      startTransition(() => {
        handleVisualizacaoChange(tipo);
      });
    },
    [handleVisualizacaoChange]
  );

  const isEvolutionMode = tipoComparacao === "evolucao_anual";

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
            onClick={() => handleVisualizacaoChangeWithTransition("tabela")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tipoVisualizacao === "tabela"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Tabela
          </button>
          <button
            onClick={() => handleVisualizacaoChangeWithTransition("grafico")}
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
          <DownloadOptions
            dados={dados}
            filteredDados={filteredData}
            hasActiveFilters={filters.filter((f) => f.value).length > 0}
          />
        </div>
      </div>

      {/* Visualização */}
      <AnimatePresence mode="wait">
        {tipoVisualizacao === "tabela" ? (
          <motion.div
            key="tabela"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CompactFilterPanel
              filters={filters}
              onAddFilter={handleAddFilter}
              onRemoveFilter={handleRemoveFilter}
              onFilterChange={handleFilterChange}
              availableYears={availableYears}
              availableOptions={availableFilterOptions}
              variant="full"
            />

            <FilterSummary
              totalRecords={dados.length}
              filteredRecords={filteredData.length}
              activeFiltersCount={activeFiltersCount}
            />

            <TableControls
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              isCompact={isCompactMode}
              onCompactToggle={() => setIsCompactMode(!isCompactMode)}
              totalItems={filteredData.length}
            />

            <div className="overflow-x-auto" data-tour="table-view">
              <Suspense fallback={<LoadingFallback />}>
                <Table
                  items={dadosTabela}
                  columns={TABLE_COLUMNS}
                  keyMap={COLUMN_KEY_MAP}
                  itemsPerPage={itemsPerPage}
                  tableType="comparacao"
                  hideFilters={true}
                  isCompact={isCompactMode}
                />
              </Suspense>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grafico"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            data-tour="chart-area"
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <CompactFilterPanel
                filters={filters}
                onAddFilter={handleAddFilter}
                onRemoveFilter={handleRemoveFilter}
                onFilterChange={handleFilterChange}
                availableYears={availableYears}
                availableOptions={availableFilterOptions}
                variant="compact"
              />

              {activeFiltersCount > 0 && (
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <span>Visualizando</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 font-bold rounded">
                    {dadosGrafico.length}
                  </span>
                  <span>registros</span>
                </div>
              )}
            </div>

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

            <Suspense fallback={<LoadingFallback />}>
              <div data-tour="chart-type">
                <ChartSelector
                  tipoGrafico={tipoGrafico}
                  onTipoGraficoChange={setTipoGrafico}
                  isEvolutionMode={isEvolutionMode}
                />{" "}
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
                  dados={dadosGrafico}
                  tipoGrafico={tipoGrafico}
                  chartContext={chartContext}
                  onUniversidadeSelect={setSelectedUniversidadesEvolucao}
                  selectedUniversidades={selectedUniversidadesEvolucao}
                />
              </div>
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Modal de correção */}
      <Suspense fallback={null}>
        <CorrecaoModal
          isOpen={modalAberto}
          onClose={handleFecharModalCorrecao}
          fatoresCorrecao={fatoresCorrecaoPorAno}
          infoBasica={infoCorrecaoBasica}
        />
      </Suspense>

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
        </div>
      )}
    </div>
  );
});

ResultsViewer.displayName = "ResultsViewer";

// Funções auxiliares
function getCampoLabel(campo: string): string {
  const labels: Record<string, string> = {
    orcamento_inicial_loa: "Orçamento Inicial (LOA)",
    empenhado_ate_mes: "Empenhado Até Mês",
    liquidado_ate_mes: "Liquidado Até Mês",
    pago_ate_mes: "Pago Até Mês",
    empenhado_no_mes: "Empenhado no Mês",
    liquidado_no_mes: "Liquidado no Mês",
    pago_no_mes: "Pago no Mês",
    total_orcamentario_ate_mes: "Total Orçamentário Até Mês",
    total_orcamentario_no_mes: "Total Orçamentário No Mês",
    disponibilidade_orcamentaria_ate_mes: "Disp. Orçamentária Até Mês",
    disponibilidade_orcamentaria_no_mes: "Disp. Orçamentária No Mês",
  };
  return labels[campo] || campo;
}

function getTipoComparacaoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    universidades: "Comparação entre Universidades",
    anos: "Comparação entre Anos",
    evolucao_anual: "Evolução Anual por Universidade",
  };
  return labels[tipo] || tipo;
}
