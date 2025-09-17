import { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { BlueTitleCard } from "../../components/BlueTitleCard";
import { Form } from "../../components/Form";
import { SelectField } from "../../components/Select";
import { InputGroup } from "../../components/InputGroup";
import { Table } from "../../components/Table";
import api from "../../utils/api";
import Swal from "sweetalert2";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface DadosConsulta {
  id: number;
  ano: number;
  mes?: number;
  universidade: string;
  valor_empenhado: number;
  valor_liquidado: number;
  valor_pago: number;
  valor_empenhado_corrigido?: number;
  valor_liquidado_corrigido?: number;
  valor_pago_corrigido?: number;
  funcao?: string;
  grupo_natureza?: string;
  origem_recursos?: string;
  ipca_base?: number;
  periodo_base?: string;
  fator_correcao?: number;
}

const meses = [
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

export function ConsultaPage() {
  const [formData, setFormData] = useState({
    tipoCorrecao: "",
    ipcaReferencia: "",
    mesInicial: "",
    anoInicial: "",
    mesFinal: "",
    anoFinal: ""
  });

  const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(""); // Adicionar este estado

  const [dadosConsulta, setDadosConsulta] = useState<DadosConsulta[]>([]);
  const [listaIPCA, setListaIPCA] = useState<{ value: string; label: string }[]>([]);
  const [listaIPCAAnual, setListaIPCAAnual] = useState<{ value: string; label: string }[]>([]);
  const [tipoVisualizacao, setTipoVisualizacao] = useState<'tabela' | 'grafico'>('tabela');
  const [tipoGrafico, setTipoGrafico] = useState<'barras' | 'linhas' | 'pizza' | 'area'>('barras');

  // Buscar lista de IPCA disponíveis
  useEffect(() => {
    // Buscar IPCA mensal
    api.get("/ipca")
      .then((response) => {
        const opcoes = Object.entries(response.data.data).map(([key, value]) => ({
          value: key,
          label: `${key} - ${Number(value).toFixed(4)}`
        }));
        setListaIPCA(opcoes.reverse()); // Mais recentes primeiro
      })
      .catch((error) => {
        console.error("Erro ao buscar IPCAs:", error);
      });
  }, []);

  // Buscar médias anuais quando o tipo de correção mudar
  useEffect(() => {
    if (formData.tipoCorrecao === "anual") {
      // Buscar TODOS os anos disponíveis de IPCA (não limitado a 2002-2023)
      api.get("/ipca")
        .then((response) => {
          // Extrair anos únicos dos dados do IPCA
          const anosUnicos = new Set<string>();
          Object.keys(response.data.data).forEach(key => {
            const ano = key.split('/')[1];
            anosUnicos.add(ano);
          });
          
          const anos = Array.from(anosUnicos).sort();
          
          // Construir a query string manualmente para arrays
          const queryString = anos.map(ano => `anos=${ano}`).join('&');
          
          return api.get(`/ipca/medias-anuais?${queryString}`);
        })
        .then((response) => {
          const opcoesAnuais = Object.entries(response.data)
            .filter(([_, data]: any) => !data.erro)
            .map(([ano, data]: any) => ({
              value: ano,
              label: `${ano} - Média: ${data.media_ipca.toFixed(4)}`
            }))
            .sort((a, b) => b.value.localeCompare(a.value)); // Ordenar decrescente
          setListaIPCAAnual(opcoesAnuais);
        })
        .catch((error) => {
          console.error("Erro ao buscar médias anuais:", error);
        });
    }
  }, [formData.tipoCorrecao]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Se mudou o tipo de correção, limpar a referência IPCA
    if (name === "tipoCorrecao" && value !== formData.tipoCorrecao) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ipcaReferencia: "" // Limpar seleção anterior
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };



const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.tipoCorrecao || !formData.ipcaReferencia || 
        !formData.mesInicial || !formData.anoInicial || 
        !formData.mesFinal || !formData.anoFinal) {
      Swal.fire({
        icon: "error",
        title: "Atenção",
        text: "Por favor, preencha todos os campos."
      });
      return;
    }

    const anoInicialNum = parseInt(formData.anoInicial);
    const anoFinalNum = parseInt(formData.anoFinal);
    const mesInicialNum = parseInt(formData.mesInicial);
    const mesFinalNum = parseInt(formData.mesFinal);

    // Validação: ano final não pode ser menor que ano inicial
    if (anoFinalNum < anoInicialNum) {
      Swal.fire({
        icon: "error",
        title: "Atenção",
        text: "O ano final não pode ser anterior ao ano inicial."
      });
      return;
    }

    // Validação: se mesmo ano, mês final não pode ser menor que mês inicial
    if (anoInicialNum === anoFinalNum && mesFinalNum < mesInicialNum) {
      Swal.fire({
        icon: "error",
        title: "Atenção",
        text: "O mês final não pode ser anterior ao mês inicial no mesmo ano."
      });
      return;
    }

    // Validação: período deve estar entre 2002 e 2023 para dados de transparência
    if (anoInicialNum < 2002 || anoFinalNum > 2023) {
      Swal.fire({
        icon: "error",
        title: "Atenção",
        text: "O período de consulta deve estar entre 2002 e 2023."
      });
      return;
    }

    setIsLoading(true);
    setDadosConsulta([]);
    setLoadingMessage("Iniciando consulta..."); // Adicionar mensagem de loading

    try {
      // Preparar parâmetros da consulta
      const parametros = {
        data_inicio: `${formData.mesInicial}/${formData.anoInicial}`,
        data_fim: `${formData.mesFinal}/${formData.anoFinal}`,
        tipo_correcao: formData.tipoCorrecao,
        ipca_referencia: formData.ipcaReferencia
      };
      
      // Usar fetch com streaming SSE
      const response = await fetch(`${api.defaults.baseURL}/transparencia/consultar-streaming`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parametros)
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let dadosAcumulados: DadosConsulta[] = [];
      let buffer = '';
      let eventBuffer = ''; // Buffer específico para eventos SSE

      if (reader) {
        // Processar stream
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decodificar chunk
          buffer += decoder.decode(value, { stream: true });
          
          // Processar linhas completas
          const lines = buffer.split('\n');
          
          // Manter última linha (possivelmente incompleta) no buffer principal
          buffer = lines[lines.length - 1];
          
          // Processar cada linha
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            
            if (line === '' && eventBuffer) {
              // Linha vazia indica fim de um evento SSE
              // Processar o evento acumulado
              if (eventBuffer.startsWith('data: ')) {
                try {
                  const jsonStr = eventBuffer.substring(6);
                  const chunk = JSON.parse(jsonStr);
                  
                  if (chunk.status === "parcial") {
                    // Atualizar mensagem de progresso
                    setLoadingMessage(`Processando ano ${chunk.ano_processado}...`);
                    
                    // Processar dados parciais
                    const novosDados = chunk.dados.map((item: any, index: number) => {
                      // Extrair valores monetários dos dados
                      let valorPago = 0;
                      let valorEmpenhado = 0;
                      let valorLiquidado = 0;
                      
                      // Tentar extrair valor pago
                      if (item.PAGO_NO_MES) {
                        valorPago = parseFloat(item.PAGO_NO_MES.replace(/\./g, '').replace(',', '.')) || 0;
                      } else if (item.PAGO_ATE_MES) {
                        valorPago = parseFloat(item.PAGO_ATE_MES.replace(/\./g, '').replace(',', '.')) || 0;
                      }
                      
                      // Tentar extrair valor empenhado
                      if (item.EMPENHADO_NO_MES) {
                        valorEmpenhado = parseFloat(item.EMPENHADO_NO_MES.replace(/\./g, '').replace(',', '.')) || 0;
                      } else if (item.EMPENHADO_ATE_MES) {
                        valorEmpenhado = parseFloat(item.EMPENHADO_ATE_MES.replace(/\./g, '').replace(',', '.')) || 0;
                      }
                      
                      // Tentar extrair valor liquidado
                      if (item.LIQUIDADO_NO_MES) {
                        valorLiquidado = parseFloat(item.LIQUIDADO_NO_MES.replace(/\./g, '').replace(',', '.')) || 0;
                      } else if (item.LIQUIDADO_ATE_MES) {
                        valorLiquidado = parseFloat(item.LIQUIDADO_ATE_MES.replace(/\./g, '').replace(',', '.')) || 0;
                      }
                      
                      // Extrair metadados de correção se existirem
                      const correcao = item._correcao_aplicada || {};
                      
                      return {
                        id: dadosAcumulados.length + index + 1,
                        ano: item._ano_validado || chunk.ano_processado,
                        mes: item.MES || item.mes || 12,
                        universidade: item.UNIDADE_ORCAMENTARIA || item.universidade || 'Não informado',
                        valor_empenhado: valorEmpenhado,
                        valor_liquidado: valorLiquidado,
                        valor_pago: valorPago,
                        funcao: item.FUNCAO,
                        grupo_natureza: item.GRUPO_NATUREZA_DESPESA,
                        origem_recursos: item.ORIGEM_RECURSOS,
                        ipca_base: correcao.ipca_referencia || chunk.ipca_referencia,
                        periodo_base: correcao.periodo_referencia || chunk.periodo_base_ipca,
                        fator_correcao: correcao.fator_correcao
                      };
                    });
                    
                    dadosAcumulados = [...dadosAcumulados, ...novosDados];
                    setDadosConsulta([...dadosAcumulados]);
                    
                    // Mostrar progresso
                    console.log(`Processado ano ${chunk.ano_processado}: ${chunk.total_registros_ano} registros`);
                    
                  } else if (chunk.status === "completo") {
                    setIsLoading(false);
                    setLoadingMessage("");
                    
                    // Se houver dados não processados, mostrar aviso
                    if (chunk.total_nao_processados > 0) {
                      console.warn(`${chunk.total_nao_processados} registros não foram processados`);
                      console.log("Dados não processados:", chunk.dados_nao_processados);
                    }
                    
                    Swal.fire({
                      icon: "success",
                      title: "Sucesso",
                      html: `
                        <p>Dados consultados com sucesso!</p>
                        <p><strong>Total de registros:</strong> ${chunk.total_registros}</p>
                        ${chunk.total_nao_processados > 0 ? 
                          `<p><strong>Registros não processados:</strong> ${chunk.total_nao_processados}</p>` : 
                          ''}
                        <p><strong>IPCA de referência:</strong> ${chunk.periodo_base_ipca}</p>
                        <p><strong>Tipo de correção:</strong> ${chunk.tipo_correcao}</p>
                      `
                    });
                    
                  } else if (chunk.status === "erro") {
                    setIsLoading(false);
                    setLoadingMessage("");
                    
                    Swal.fire({
                      icon: "error",
                      title: "Erro",
                      text: chunk.erro || "Erro ao consultar dados"
                    });
                  }
                } catch (e) {
                  console.error("Erro ao processar evento SSE:", e);
                  console.error("JSON problemático:", jsonStr);
                }
              }
              // Limpar buffer do evento
              eventBuffer = '';
            } else if (line) {
              // Acumular linha no buffer do evento
              if (eventBuffer) {
                eventBuffer += '\n' + line;
              } else {
                eventBuffer = line;
              }
            }
          }
        }
        
        // Processar qualquer evento remanescente no buffer
        if (eventBuffer && eventBuffer.startsWith('data: ')) {
          try {
            const jsonStr = eventBuffer.substring(6);
            const chunk = JSON.parse(jsonStr);
            console.log("Processando buffer final:", chunk);
          } catch (e) {
            console.error("Erro ao processar buffer final:", e);
          }
        }
      }
      
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: error.message || "Erro ao consultar dados. Por favor, tente novamente."
      });
      console.error("Erro na consulta:", error);
      setIsLoading(false);
      setLoadingMessage("");
    }
  };


  // Funções de Download
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Financiamento das Universidades', 14, 15);
    
    const tableData = dadosConsulta.map(item => [
      item.universidade,
      `${item.mes}/${item.ano}`,
      item.valor_pago.toFixed(2)
    ]);

    (doc as any).autoTable({
      head: [['Universidade', 'Período', 'Valor Pago (R$)']],
      body: tableData,
      startY: 25
    });

    doc.save('relatorio-universidades.pdf');
  };

  const downloadCSV = () => {
    const headers = ['Universidade', 'Ano', 'Mês', 'Valor Empenhado', 'Valor Liquidado', 'Valor Pago'];
    const rows = dadosConsulta.map(item => [
      item.universidade,
      item.ano,
      item.mes || '',
      item.valor_empenhado,
      item.valor_liquidado,
      item.valor_pago
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'dados-universidades.csv';
    link.click();
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosConsulta);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
    XLSX.writeFile(workbook, "dados-universidades.xlsx");
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(dadosConsulta, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'dados-universidades.json';
    link.click();
  };

  // Preparar dados para gráficos
  const prepararDadosGrafico = () => {
    // Agrupar por universidade
    const dadosAgrupados = dadosConsulta.reduce((acc, item) => {
      if (!acc[item.universidade]) {
        acc[item.universidade] = 0;
      }
      acc[item.universidade] += item.valor_pago;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dadosAgrupados).map(([universidade, valor]) => ({
      universidade,
      valor: Number(valor.toFixed(2))
    }));
  };

  const renderGrafico = () => {
    const dados = prepararDadosGrafico();

    switch (tipoGrafico) {
      case 'barras':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="universidade" />
              <YAxis />
              <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
              <Bar dataKey="valor" fill="#8884d8" name="Valor Total (R$)" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'linhas':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="universidade" />
              <YAxis />
              <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
              <Line type="monotone" dataKey="valor" stroke="#8884d8" name="Valor Total (R$)" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pizza':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={dados}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ universidade, percent }) => `${universidade}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
              >
                {dados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={dados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="universidade" />
              <YAxis />
              <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
              <Area type="monotone" dataKey="valor" stroke="#8884d8" fill="#8884d8" name="Valor Total (R$)" />
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };



  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BlueTitleCard
        title="Consulta de Financiamento"
        subtitle="Consulte os dados de financiamento das universidades estaduais do Paraná"
      />

      <div className="flex-grow bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Formulário de Consulta */}
          <Form
            title="Parâmetros da Consulta"
            subtitle={
              <>
                Configure os filtros para buscar os dados desejados.<br/>
                <span className="text-sm text-gray-500">Período de dados disponível: 2002 a 2023</span>
              </>
            }
            onSubmit={handleSubmit}
            submitButtonText="Consultar Dados"
            isLoading={isLoading}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                id="tipoCorrecao"
                name="tipoCorrecao"
                label="Tipo de Correção"
                required
                value={formData.tipoCorrecao}
                onChange={handleChange}
                options={[
                  { value: "mensal", label: "IPCA Mensal" },
                  { value: "anual", label: "IPCA Anual (Média)" }
                ]}
              />

              <SelectField
                id="ipcaReferencia"
                name="ipcaReferencia"
                label="IPCA de Referência"
                required
                value={formData.ipcaReferencia}
                onChange={handleChange}
                options={formData.tipoCorrecao === "anual" ? listaIPCAAnual : listaIPCA}
                placeholder={formData.tipoCorrecao === "anual" 
                  ? "Selecione o ano de referência" 
                  : "Selecione o período de referência"
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup>
                <SelectField
                  id="mesInicial"
                  name="mesInicial"
                  label="Mês Inicial"
                  required
                  value={formData.mesInicial}
                  onChange={handleChange}
                  options={meses}
                />
                <SelectField
                  id="anoInicial"
                  name="anoInicial"
                  label="Ano Inicial"
                  required
                  value={formData.anoInicial}
                  onChange={handleChange}
                  options={Array.from({ length: 22 }, (_, i) => {
                    const year = 2002 + i;
                    return { value: year.toString(), label: year.toString() };
                  })}
                />
              </InputGroup>

              <InputGroup>
                <SelectField
                  id="mesFinal"
                  name="mesFinal"
                  label="Mês Final"
                  required
                  value={formData.mesFinal}
                  onChange={handleChange}
                  options={meses}
                />
                <SelectField
                  id="anoFinal"
                  name="anoFinal"
                  label="Ano Final"
                  required
                  value={formData.anoFinal}
                  onChange={handleChange}
                  options={Array.from({ length: 22 }, (_, i) => {
                    const year = 2002 + i;
                    return { value: year.toString(), label: year.toString() };
                  })}
                />
              </InputGroup>
            </div>
          </Form>

          {/* Loading */}
          {isLoading && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {loadingMessage || "Consultando dados..."}
                </h3>
                <p className="text-gray-600">Isso pode levar alguns minutos para períodos extensos</p>
              </div>
            </div>
          )}

          {/* Resultados */}
          {!isLoading && dadosConsulta.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Controles de Visualização */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setTipoVisualizacao('tabela')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      tipoVisualizacao === 'tabela' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Tabela
                  </button>
                  <button
                    onClick={() => setTipoVisualizacao('grafico')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      tipoVisualizacao === 'grafico' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Gráfico
                  </button>
                </div>

                {/* Opções de Download */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={downloadPDF}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                  >
                    PDF
                  </button>
                  <button
                    onClick={downloadCSV}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                  >
                    CSV
                  </button>
                  <button
                    onClick={downloadExcel}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Excel
                  </button>
                  <button
                    onClick={downloadJSON}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                  >
                    JSON
                  </button>
                </div>
              </div>

              {/* Visualização */}
              {tipoVisualizacao === 'tabela' ? (
                <Table 
                  items={dadosConsulta.map(item => ({
                    id: item.id,
                    universidade: item.universidade,
                    data: item.mes ? `${item.mes}/${item.ano}` : item.ano.toString(),
                    valor: item.valor_pago.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  }))}
                  columns={["Universidade", "Período", "Valor Pago (R$)"]}
                  itemsPerPage={20}
                />
              ) : (
                <div>
                  {/* Seletor de Tipo de Gráfico */}
                  <div className="flex gap-2 mb-4 justify-center">
                    <button
                      onClick={() => setTipoGrafico('barras')}
                      className={`px-3 py-1 rounded text-sm ${
                        tipoGrafico === 'barras' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Barras
                    </button>
                    <button
                      onClick={() => setTipoGrafico('linhas')}
                      className={`px-3 py-1 rounded text-sm ${
                        tipoGrafico === 'linhas' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Linhas
                    </button>
                    <button
                      onClick={() => setTipoGrafico('pizza')}
                      className={`px-3 py-1 rounded text-sm ${
                        tipoGrafico === 'pizza' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Pizza
                    </button>
                    <button
                      onClick={() => setTipoGrafico('area')}
                      className={`px-3 py-1 rounded text-sm ${
                        tipoGrafico === 'area' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Área
                    </button>
                  </div>
                  {renderGrafico()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}