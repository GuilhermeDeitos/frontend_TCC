/*
  Aqui teremos o rodapé com algumas informações como:
  - Informações
  - Transparencia sobre os dados
  - Links uteis
*/

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
                © 2025-2026 SAD-UEPR. Todos os direitos reservados.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-blue-300 mb-4">Transparência dos Dados</h3>
            <div className="space-y-3 text-sm sm:text-base">
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Fontes de Dados:</h4>
                <ul className="space-y-1 text-gray-300">
                  <li><a target="_blank" href="https://www.transparencia.pr.gov.br/pte/home">Portal da Transparência do Paraná</a></li>
                  <li><a target="_blank" href="https://www.inep.gov.br/">Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP)</a></li>
                  <li><a target="_blank" href="https://www.ipea.gov.br/">Instituto de Pesquisa Econômica Aplicada (IPEA)</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-blue-300 mb-4">Links Úteis</h3>
            <div className="space-y-3 text-sm sm:text-base">
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://github.com/GuilhermeDeitos/PyScraper_PortalDaTransparencia" 
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center"
                    target="_blank"
                  >
                    Código-Fonte no GitHub
                  </a>
                </li>
                <li>
                  <a 
                    href="/api/docs" 
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center"
                    target="_blank"

                  >
                    Documentação da API (Swagger)
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:guilherme.alves@exemplo.com" 
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center"
                  >
                    Contato e Feedback
                  </a>
                </li>
                <li>
                  <a 
                    href="/sobre" 
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center"
                  >
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