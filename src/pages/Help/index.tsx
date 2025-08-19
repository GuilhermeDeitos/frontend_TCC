import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header"
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function HelpPage(){
  const [openItem, setOpenItem] = useState<number | null>(null);

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
    }
  ];

  const categories = [...new Set(faqData.map(item => item.category))];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Central de Ajuda</h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            Encontre aqui respostas para as dúvidas mais comuns sobre o portal, os dados e as funcionalidades oferecidas.
          </p>
        </div>
      </div>

      <div className="flex-grow bg-gray-50 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
            <div key={categoryIndex} className="mb-8">
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
                    return (
                      <div key={itemIndex} className="bg-white rounded-lg shadow-md">
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

          <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
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
    </div>
  );
}