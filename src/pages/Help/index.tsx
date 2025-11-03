import { BlueTitleCard } from "../../components/BlueTitleCard";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { TourGuide } from "../../components/TourGuide";
import { TourRestartButton } from "../../components/TourRestartButton";
import { useHelpPageTour } from "../../hooks/useHelpPageTour";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function HelpPage(){
  const [openItem, setOpenItem] = useState<number | null>(null);
  const tour = useHelpPageTour();

  const faqData: FAQItem[] = [
    // Questões Gerais
    {
      category: "Questões Gerais",
      question: "O que é o SAD-UEPR?",
      answer: "O SAD-UEPR (Sistema de Apoio à Decisão das Universidades Estaduais do Paraná) é um portal acadêmico, desenvolvido como Trabalho de Conclusão de Curso em Ciência da Computação na UNIOESTE. Sua finalidade é ser uma ferramenta para visualização e análise de dados sobre o financiamento das universidades estaduais do Paraná, visando apoiar decisões estratégicas."
    },
    {
      category: "Questões Gerais",
      question: "Qual período os dados cobrem?",
      answer: "O escopo do projeto abrange a coleta e análise de dados financeiros e acadêmicos das universidades estaduais do Paraná no período de 2002 a 2023."
    },
    {
      category: "Questões Gerais",
      question: "De onde vêm os dados? As fontes são confiáveis?",
      answer: "Sim, todas as informações são extraídas de fontes de dados públicas e oficiais para garantir a confiabilidade. As principais fontes são: Portal da Transparência do Paraná (dados financeiros), Instituto de Pesquisa Econômica Aplicada - IPEA (índices de inflação/IPCA) e Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira - INEP (dados de matrículas)."
    },
    
    // Entendendo os Dados
    {
      category: "Entendendo os Dados",
      question: "O que é a correção pelo IPCA e por que ela é importante?",
      answer: "O IPCA (Índice Nacional de Preços ao Consumidor Amplo) é o índice oficial que mede a inflação no Brasil. A correção monetária é o processo de atualizar um valor do passado para o presente, considerando a perda do poder de compra causada pela inflação. Essa correção é fundamental porque mil reais em 2015 não compram as mesmas coisas que mil reais em 2023. O SAD-UEPR aplica essa correção automaticamente para permitir comparações financeiras justas e precisas entre diferentes anos."
    },
    {
      category: "Entendendo os Dados",
      question: "O que significam os termos 'Empenhado', 'Liquidado' e 'Pago'?",
      answer: "Esses termos fazem parte da execução de despesas no setor público: Empenhado - É o primeiro estágio, onde o governo reserva uma parte do orçamento para um gasto específico, criando um compromisso de pagamento. Liquidado - Ocorre após a verificação de que o produto foi entregue ou o serviço foi prestado conforme o contrato. É o reconhecimento da dívida. Pago - É a etapa final, quando o governo efetivamente transfere o dinheiro ao fornecedor, quitando a obrigação."
    },
    {
      category: "Entendendo os Dados",
      question: "Quais são as universidades estaduais do Paraná cobertas pelo sistema?",
      answer: "O SAD-UEPR cobre as sete Universidades Estaduais de Ensino Superior (IEES) do Paraná: UEL (Universidade Estadual de Londrina), UEM (Universidade Estadual de Maringá), UEPG (Universidade Estadual de Ponta Grossa), UNIOESTE (Universidade Estadual do Oeste do Paraná), UNICENTRO (Universidade Estadual do Centro-Oeste), UENP (Universidade Estadual do Norte do Paraná) e UNESPAR (Universidade Estadual do Paraná)."
    },
    {
      category: "Entendendo os Dados",
      question: "O que significam os diferentes campos financeiros nos resultados?",
      answer: "Os resultados exibem diversos campos financeiros: 'Orçamento LOA' é o valor inicial alocado pela Lei Orçamentária Anual; 'Total Orçamentário' representa os recursos disponíveis após ajustes; 'Disponibilidade Orçamentária' é o que resta para uso; 'Empenhado', 'Liquidado' e 'Pago' são as etapas de execução do gasto. Campos com 'Até Mês' mostram valores acumulados até o período consultado, enquanto 'No Mês' exibe apenas o valor do mês específico. Todos os valores são atualizados monetariamente para permitir comparações justas."
    },
    {
      category: "Entendendo os Dados",
      question: "Por que os fatores de correção são diferentes para cada ano?",
      answer: "O fator de correção monetária varia por ano porque representa o acúmulo da inflação entre o período original e o período de referência. Por exemplo, valores de 2010 precisam de um fator maior de correção que valores de 2020, pois houve mais inflação acumulada nesse período mais longo. Para cada ano consultado, o sistema aplica automaticamente o fator específico correspondente. Você pode visualizar os detalhes desses fatores clicando no botão 'Detalhes da Correção' que aparece nos resultados da consulta."
    },

    // Como Usar o Portal
    {
      category: "Como Usar o Portal",
      question: "Como funciona a consulta de dados?",
      answer: "Você seleciona um período de interesse (data de início e fim). Para consultas que abrangem um único ano, o resultado é geralmente imediato. Para consultas de múltiplos anos, o sistema inicia um processo de coleta em segundo plano, e você poderá ver os resultados aparecendo progressivamente na tela à medida que os dados de cada ano são processados."
    },
    {
      category: "Como Usar o Portal",
      question: "Por que minha consulta de vários anos demora?",
      answer: "A coleta de dados de portais públicos é uma tarefa complexa. O SAD-UEPR utiliza uma técnica chamada Web Scraping, que automatiza um navegador para simular a navegação humana, preencher formulários e baixar os dados necessários. Para períodos longos, esse processo precisa ser repetido diversas vezes. Embora o sistema use paralelismo para acelerar a execução, uma consulta extensa pode levar alguns minutos para ser concluída."
    },
    {
      category: "Como Usar o Portal",
      question: "Como usar a calculadora de correção monetária?",
      answer: "Na calculadora de IPCA, insira o valor original, a data inicial (quando o valor foi estabelecido) e a data final (para quando deseja corrigir o valor). O sistema automaticamente calculará o valor corrigido pela inflação oficial medida pelo IPCA, mostrando também o percentual de correção acumulado no período."
    },
    {
      category: "Como Usar o Portal",
      question: "Como alternar entre diferentes visualizações dos resultados?",
      answer: "Após realizar uma consulta, você verá duas opções principais na parte superior dos resultados: 'Tabela' e 'Gráfico'. Na visualização em tabela, você pode ordenar clicando nos cabeçalhos das colunas e filtrar usando os controles acima da tabela. Na visualização em gráfico, você tem opções adicionais de customização: escolha o tipo de comparação (entre universidades, entre anos ou evolução anual), selecione qual campo financeiro deseja comparar e escolha o tipo de gráfico (barras, linhas, pizza ou área) que melhor representa sua análise."
    },
    {
      category: "Como Usar o Portal",
      question: "Como filtrar e exportar os dados da consulta?",
      answer: "Na visualização em tabela, você pode filtrar os dados por vários critérios: ano, universidade, função, grupo de natureza e origem de recursos. Isso ajuda a focar em informações específicas. Para exportar os resultados, use o botão 'Exportar' no canto superior direito da tela. Você pode escolher entre formatos como Excel, PDF, CSV ou JSON, selecionar quais colunas incluir e personalizar o título e subtítulo do relatório. Os arquivos exportados incluem automaticamente informações sobre a correção monetária aplicada."
    },
    {
      category: "Como Usar o Portal",
      question: "O que fazer quando alguns anos estão ausentes nos resultados?",
      answer: "Se você receber um aviso sobre 'Anos ausentes' nos resultados, significa que o sistema não encontrou dados para determinados anos dentro do período solicitado. Isso pode ocorrer por indisponibilidade temporária dos dados no Portal da Transparência ou por mudanças na estrutura das informações. Recomendamos: 1) Refazer a consulta para verificar se foi um problema temporário; 2) Tentar consultar os anos problemáticos individualmente; 3) Verificar no Portal da Transparência do Paraná se os dados daquele período estão disponíveis. Mesmo com alguns anos ausentes, você ainda pode analisar os dados disponíveis."
    },
    {
      category: "Como Usar o Portal",
      question: "Como interpretar as diferentes opções de comparação nos gráficos?",
      answer: "O sistema oferece três tipos principais de comparação gráfica: 1) 'Entre Universidades' - compara o desempenho das diferentes instituições para o mesmo indicador financeiro; 2) 'Entre Anos' - mostra a evolução temporal de um indicador, consolidando dados de todas as universidades por ano; 3) 'Evolução Anual' - apresenta dados detalhados por universidade e por ano, permitindo análise de tendências individuais. Essa última opção também permite filtrar por anos específicos para análises mais focadas. Cada tipo de visualização é adequado para responder diferentes perguntas analíticas."
    },

    // Para Desenvolvedores e Pesquisadores
    {
      category: "Para Desenvolvedores e Pesquisadores",
      question: "Existe uma API para acessar os dados diretamente?",
      answer: "Sim. Um dos objetivos do projeto foi construir uma API REST para disponibilizar de forma segura e estruturada todos os dados já tratados e corrigidos. Isso permite que outros sistemas, pesquisadores e desenvolvedores possam consumir essas informações de forma programática. A documentação completa da API está disponível no link 'Documentação da API' no rodapé do site."
    },
    {
      category: "Para Desenvolvedores e Pesquisadores",
      question: "Quais tecnologias foram utilizadas no projeto?",
      answer: "O sistema foi desenvolvido com um conjunto de tecnologias modernas. O backend (API) foi construído em Python com o framework FastAPI. A extração de dados (crawler) utiliza Selenium, e a manipulação dos dados é feita com Pandas. A interface do portal (frontend) foi desenvolvida com TypeScript, React e Tailwind CSS."
    },
    {
      category: "Para Desenvolvedores e Pesquisadores",
      question: "O código-fonte está disponível?",
      answer: "Sim, o projeto segue os princípios de transparência e código aberto. O código-fonte completo está disponível no GitHub, incluindo tanto o sistema de extração de dados quanto a interface web. Você pode encontrar o link no rodapé do site."
    },
    {
      category: "Para Desenvolvedores e Pesquisadores",
      question: "Quais métricas e indicadores são recomendados para análise comparativa?",
      answer: "Para análises comparativas entre universidades de diferentes portes, recomendamos considerar métricas relativas como 'investimento por aluno' ou 'percentual do orçamento destinado a diferentes funções'. Especificamente, o valor 'Pago' tende a ser mais preciso para análises orçamentárias definitivas, enquanto o 'Empenhado' é útil para entender o planejamento. Para séries temporais longas (mais de 5 anos), sempre use os valores corrigidos pelo IPCA para neutralizar o efeito da inflação. Os pesquisadores também podem baixar os dados em formato JSON ou CSV para realizar análises estatísticas mais avançadas em ferramentas como R, Python ou SPSS."
    },
    {
      category: "Para Desenvolvedores e Pesquisadores",
      question: "Posso incorporar os gráficos e visualizações em outros sites ou publicações?",
      answer: "Sim, você pode capturar as visualizações via screenshot para uso em publicações, citando o SAD-UEPR como fonte. Para integração web mais avançada, você pode utilizar nossa API para obter os dados e construir suas próprias visualizações personalizadas. Ao citar dados do sistema em trabalhos acadêmicos, recomendamos incluir a data da consulta e os parâmetros utilizados, especialmente o período de referência da correção monetária, para garantir a reprodutibilidade da análise. Todos os dados são de domínio público, mas pedimos a gentileza de atribuir a fonte original (Portal da Transparência do Paraná) e o processamento (SAD-UEPR)."
    }
  ];

  const categories = [...new Set(faqData.map(item => item.category))];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div data-tour="title-section">
        <BlueTitleCard
          title="Central de Ajuda"
          subtitle="Encontre aqui respostas para as dúvidas mais comuns sobre o portal, os dados e as funcionalidades oferecidas."
        />
      </div>

      <div className="flex-grow bg-gray-50 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div 
            className="bg-white rounded-lg shadow-md p-6 mb-8"
            data-tour="quick-navigation"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Navegação Rápida</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category, index) => (
                <a
                  key={index}
                  href={`#${category.replace(/\s+/g, '-').toLowerCase()}`}
                  className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center"
                >
                  <span className="text-blue-700 font-medium">{category}</span>
                </a>
              ))}
            </div>
          </div>

          {/* FAQ por categorias */}
          {categories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex} 
              className="mb-8"
              data-tour={
                category === "Questões Gerais" ? "category-general" :
                category === "Entendendo os Dados" ? "category-data" :
                category === "Como Usar o Portal" ? "category-usage" :
                "category-developers"
              }
            >
              <h2 
                id={category.replace(/\s+/g, '-').toLowerCase()}
                className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2"
              >
                {category}
              </h2>
              
              <div className="space-y-4">
                {faqData
                  .filter(item => item.category === category)
                  .map((item, itemIndex) => {
                    const globalIndex = faqData.indexOf(item);
                    const isFirstItem = categoryIndex === 0 && itemIndex === 0;
                    
                    return (
                      <div 
                        key={itemIndex} 
                        className="bg-white rounded-lg shadow-md"
                        data-tour={isFirstItem ? "faq-item" : undefined}
                      >
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                          <svg
                            className={`w-5 h-5 text-gray-500 transform transition-transform ${
                              openItem === globalIndex ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {openItem === globalIndex && (
                          <div className="px-6 pb-4">
                            <div className="text-gray-700 leading-relaxed border-t pt-4">
                              {item.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          <div 
            className="bg-blue-600 text-white rounded-lg p-8 text-center"
            data-tour="contact-section"
          >
            <h2 className="text-2xl font-bold mb-4">Não encontrou sua resposta?</h2>
            <p className="mb-6 text-blue-100">
              Nossa equipe está pronta para ajudar! Entre em contato conosco e responderemos sua dúvida o mais rápido possível.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/contato"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Formulário de Contato
              </a>
              <a
                href="mailto:guilherme.cascavel@gmail.com"
                className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Email Direto
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Tour Guide */}
      <TourGuide
        isActive={tour.isActive}
        currentStep={tour.currentStep}
        totalSteps={tour.totalSteps}
        currentStepData={tour.currentStepData}
        onNext={tour.nextStep}
        onPrev={tour.prevStep}
        onSkip={tour.skipTour}
        onClose={tour.closeTour}
        onCancel={tour.cancelTour}
        onSkipAll={tour.skipAllTours}
      />

      {/* Botão para reiniciar tour */}
      <TourRestartButton
        onRestartTour={tour.restartTour}
        onRestartAllTours={tour.restartAllTours}
        tourKey="helpPage"
        completedTours={tour.completedTours}
        completedToursCount={tour.completedToursCount}
        isFirstTimeUser={tour.isFirstTimeUser}
      />
    </div>
  );
}