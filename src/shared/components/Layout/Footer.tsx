
export function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-blue-300 mb-4">Informações Acadêmicas</h3>
            <div className="space-y-3 text-sm sm:text-base">
              <p className="text-gray-300">
                Desenvolvido por <span className="font-semibold">Guilherme Augusto Deitos Alves</span> como Trabalho de Conclusão de Curso em Ciência da Computação na UNIOESTE, Campus de Cascavel.
              </p>
              <p className="text-gray-300">
                Sob orientação da <span className="font-semibold">Profª. Adriana Postal</span> e co-orientação do <span className="font-semibold">Prof. Luiz Fernando Reis</span>.
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">
                © {new Date().getFullYear()} SAD-UEPR. Todos os direitos reservados.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-blue-300 mb-4">Transparência dos Dados</h3>
            <div className="space-y-3 text-sm sm:text-base">
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Fontes de Dados:</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>
                    <a 
                      target="_blank" 
                      rel="noopener noreferrer"
                      href="https://www.transparencia.pr.gov.br/pte/home"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Portal da Transparência do Paraná
                    </a>
                  </li>
                  <li>
                    <a 
                      target="_blank" 
                      rel="noopener noreferrer"
                      href="https://www.inep.gov.br/"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP)
                    </a>
                  </li>
                  <li>
                    <a 
                      target="_blank" 
                      rel="noopener noreferrer"
                      href="https://www.ipea.gov.br/"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Instituto de Pesquisa Econômica Aplicada (IPEA)
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-blue-300 mb-4">Links Úteis</h3>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  Repositórios GitHub
                </h4>
                <ul className="space-y-2 ml-7">
                  <li>
                    <a 
                      href="https://github.com/GuilhermeDeitos/PyScraper_PortalDaTransparencia" 
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      API Scraper (Portal Transparência)
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://github.com/GuilhermeDeitos/apiIPCA" 
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      API IPCA (Correção Monetária)
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://github.com/GuilhermeDeitos/frontend_TCC" 
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Frontend (Interface Web)
                    </a>
                  </li>
                </ul>
              </div>
              
              <ul className="space-y-2">
                <li>
                  <a 
                    href="/api" 
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Documentação da API
                  </a>
                </li>
                <li>
                  <a 
                    href="/contato" 
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contato e Feedback
                  </a>
                </li>
                <li>
                  <a 
                    href="/sobre" 
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Sobre o Projeto
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              Sistema de Apoio à Decisão das Universidades Estaduais do Paraná (SAD-UEPR)
            </p>
            <p className="text-gray-500 text-xs text-center sm:text-right">
              Versão 1.0.0 - Projeto em desenvolvimento
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}