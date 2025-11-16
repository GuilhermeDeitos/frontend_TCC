import BackgroundImage from '../../../assets/background.svg';
import { Card } from '../UI/Card'

export function MainPanel(){
  return (
    <div>
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-100 flex items-center">
        <img src={BackgroundImage} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
        
        <div className="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
        <div 
          className="relative z-10 p-4 sm:p-6 md:p-8 w-full max-w-4xl mx-auto text-justify"
          data-tour="main-description"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Bem-vindo ao SAD-UEPR</h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-white">
            O <b>SAD-UEPR</b> (Sistema de Apoio à Decisão das Universidades Estaduais do Paraná) é uma ferramenta de visualização de dados dedicada a centralizar, tratar e apresentar as informações financeiras das sete instituições de ensino superior do estado.
          </p>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-white">
            Chega de planilhas confusas e dados espalhados. O SAD-UEPR centraliza as informações financeiras das universidades para que você possa focar no que importa: gerar análises e tomar decisões estratégicas com dados claros e acessíveis
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center mt-6 sm:mt-6 md:mt-8 gap-4 sm:gap-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div data-tour="calculadora-card">
          <Card
            title="Calculadora de Correção Monetária (IPCA)"
            description="Deseja saber o valor atualizado de um montante do passado? Insira o valor, a data inicial e a data final para calcular a correção com base na variação oficial do IPCA. Uma ferramenta essencial para análises financeiras precisas."
            buttonText="Acessar Serviço"
            link="/calculadora-ipca"
          />
        </div>
        
        <div data-tour="series-card">
          <Card
            title="Série Histórica do IPCA"
            description="Explore a base de dados completa do Índice Nacional de Preços ao Consumidor Amplo (IPCA). Verifique o valor do índice para qualquer mês e ano, permitindo análises detalhadas e validação de cálculos financeiros."
            buttonText="Acessar Serviço"
            link="/series-ipca"
          />
        </div>
        
        <div data-tour="consulta-card">
          <Card
            title="Consulta ao Financiamento das Universidades"
            description="Realize buscas no período de 2002 a 2023 e acesse os dados de despesas das sete Universidades Estaduais do Paraná de forma centralizada. Todos os valores monetários são automaticamente corrigidos pelo IPCA."
            buttonText="Acessar Serviço"
            link="/consulta"
          />
        </div>
      </div>
    </div>
  )
}