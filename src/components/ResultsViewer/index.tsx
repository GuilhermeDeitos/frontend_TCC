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

interface ResultsViewerProps {
  dados: DadosConsulta[];
}

export function ResultsViewer({ dados }: ResultsViewerProps) {
  const [tipoVisualizacao, setTipoVisualizacao] =
    useState<TipoVisualizacao>("tabela");
  const [tipoGrafico, setTipoGrafico] = useState<TipoGrafico>("barras");
  const [campoComparacao, setCampoComparacao] =
    useState<CampoComparacao>("valor_pago");
  const [tipoComparacao, setTipoComparacao] =
    useState<TipoComparacao>("universidades");
  const [anoSelecionado, setAnoSelecionado] = useState<string>("todos");

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
            }`}
          >
            Tabela
          </button>
          <button
            onClick={() => setTipoVisualizacao("grafico")}
            className={`px-4 py-2 rounded-lg font-medium ${
              tipoVisualizacao === "grafico"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
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

      {/* Informações de correção monetária */}
      {dados.length > 0 &&
        (dados[0]._correcao_aplicada || dados[0].correcao_aplicada) && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-md font-semibold text-blue-800">
              Informações de Correção Monetária
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm">
              <div>
                <span className="font-medium">Fator de Correção:</span>{" "}
                {(
                  dados[0]._correcao_aplicada?.fator_correcao ||
                  dados[0].correcao_aplicada?.fator_correcao ||
                  dados[0].fator_correcao ||
                  0
                ).toFixed(4)}
              </div>
              <div>
                <span className="font-medium">IPCA Período Base:</span>{" "}
                {(
                  dados[0]._correcao_aplicada?.ipca_referencia ||
                  dados[0].correcao_aplicada?.ipca_referencia ||
                  dados[0].ipca_base ||
                  0
                ).toFixed(2)}
              </div>
              <div>
                <span className="font-medium">Período Referência:</span>{" "}
                {dados[0]._correcao_aplicada?.periodo_referencia ||
                  dados[0].correcao_aplicada?.periodo_referencia ||
                  dados[0].periodo_base ||
                  "-"}
              </div>
            </div>
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
