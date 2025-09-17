import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header"

export function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Sobre o SAD-UEPR</h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            Sistema de Apoio à Decisão das Universidades Estaduais do Paraná
          </p>
        </div>
      </div>

      <div className="flex-grow bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">O Projeto</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="mb-4">
                O <strong>SAD-UEPR</strong> é um portal de visualização de dados criado para centralizar, analisar e apresentar as informações sobre o financiamento das Universidades Estaduais do Paraná no período de 2002 a 2023.
              </p>
              <p>
                Este sistema nasceu como um Trabalho de Conclusão de Curso (TCC) do curso de Bacharelado em Ciência da Computação da Universidade Estadual do Oeste do Paraná (UNIOESTE), Campus de Cascavel.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">O Problema: Dados Dispersos e Análises Complexas</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="mb-4">
                O financiamento da educação superior pública no Brasil é um desafio complexo. Para pesquisadores, gestores e para a sociedade, analisar a evolução desses investimentos é dificultado por dois grandes obstáculos:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <h3 className="font-bold text-red-800 mb-2">1. Fragmentação dos Dados</h3>
                  <p className="text-red-700 text-sm">
                    As informações financeiras estão dispersas em diferentes portais governamentais, exigindo um esforço manual, repetitivo e sujeito a erros para serem coletadas e consolidadas.
                  </p>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <h3 className="font-bold text-yellow-800 mb-2">2. Falta de Correção Monetária</h3>
                  <p className="text-yellow-700 text-sm">
                    Os valores apresentados em fontes oficiais raramente consideram o efeito da inflação ao longo do tempo, tornando enganosa a comparação de orçamentos entre diferentes anos.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Nossa Missão</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="mb-6">O SAD-UEPR foi desenvolvido com os seguintes objetivos principais:</p>
              
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Centralizar e Organizar</h3>
                    <p className="text-gray-700">Coletar e tratar sistematicamente os dados financeiros relativos às sete Universidades Estaduais de Ensino Superior (IEES) do Paraná.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Permitir Análises Precisas</h3>
                    <p className="text-gray-700">Aplicar a correção monetária automática a todos os valores financeiros utilizando o IPCA, possibilitando comparações históricas justas e precisas.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Promover a Transparência</h3>
                    <p className="text-gray-700">Disponibilizar os dados de forma estruturada e acessível através de uma interface de usuário intuitiva e interativa.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Apoiar Decisões Estratégicas</h3>
                    <p className="text-gray-700">Servir como ferramenta de apoio para gestores e pesquisadores na formulação de políticas públicas e tomada de decisões estratégicas.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Como o Sistema Funciona?</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="mb-6">Para atingir seus objetivos, o SAD-UEPR emprega uma arquitetura moderna e robusta:</p>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
                    Coleta Automatizada (<i>Web Scraping</i>)
                  </h3>
                  <p className="text-gray-700">
                    Um robô de software (<i>crawler</i>), desenvolvido em Python com a biblioteca <strong>Selenium</strong>, navega automaticamente pelo Portal da Transparência do Paraná para extrair os dados brutos de despesas.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-600">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
                    Processamento e Correção
                  </h3>
                  <p className="text-gray-700">
                    Os dados extraídos são limpos e organizados com a biblioteca <strong>Pandas</strong>. Em seguida, todos os valores monetários são corrigidos pelo IPCA, cujos índices são obtidos diretamente da base de dados do IPEA.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-purple-600">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">3</span>
                    Disponibilização via API
                  </h3>
                  <p className="text-gray-700">
                    As informações tratadas e corrigidas são expostas por meio de duas APIs REST, construídas com <strong>FastAPI</strong>. Uma API é responsável pelo processo de <i>scraping</i> e a outra pelo tratamento e disponibilização dos dados já corrigidos pelo IPCA.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Sobre o Autor e Orientadores</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p>
                  Este projeto foi idealizado e desenvolvido por <strong>Guilherme Augusto Deitos Alves</strong> como requisito para a obtenção do grau de Bacharel em Ciência da Computação pela UNIOESTE, sob orientação da <strong>Profª. Adriana Postal</strong> e co-orientação do <strong>Prof. Luiz Fernando Reis</strong>.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Explore o Sistema</h2>
            <p className="mb-6">Conheça as ferramentas disponíveis e comece a analisar os dados das universidades estaduais do Paraná.</p>
            <a href="/" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Voltar ao Início
            </a>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}