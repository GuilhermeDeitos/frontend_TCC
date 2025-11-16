export interface FAQItem {
  question: string;
  answer: string;
  category: string;
  tags?: string[];
}

export const faqData: FAQItem[] = [
  // Questões Gerais
  {
    category: "Questões Gerais",
    question: "O que é o SAD-UEPR?",
    answer: "O SAD-UEPR (Sistema de Apoio à Decisão das Universidades Estaduais do Paraná) é um portal acadêmico desenvolvido como Trabalho de Conclusão de Curso em Ciência da Computação na UNIOESTE. Sua finalidade é ser uma ferramenta para visualização e análise de dados sobre o financiamento das universidades estaduais do Paraná, visando apoiar decisões estratégicas baseadas em dados confiáveis e atualizados.",
    tags: ["conceito", "objetivo", "TCC"]
  },
  {
    category: "Questões Gerais",
    question: "Qual período os dados cobrem?",
    answer: "O sistema cobre dados financeiros e acadêmicos das universidades estaduais do Paraná no período de 2002 a 2023, com atualizações periódicas conforme novos dados são disponibilizados no Portal da Transparência do Paraná.",
    tags: ["período", "escopo"]
  },
  {
    category: "Questões Gerais",
    question: "De onde vêm os dados? As fontes são confiáveis?",
    answer: "Sim, todas as informações são extraídas exclusivamente de fontes oficiais: Portal da Transparência do Paraná (dados financeiros e orçamentários), Instituto de Pesquisa Econômica Aplicada - IPEA (índices IPCA para correção monetária) e Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira - INEP (dados de matrículas e indicadores acadêmicos). Todas essas fontes são mantidas por órgãos governamentais e seguem padrões de auditoria e transparência pública.",
    tags: ["fontes", "confiabilidade", "dados oficiais"]
  },
  {
    category: "Questões Gerais",
    question: "Quais são as universidades cobertas pelo sistema?",
    answer: "O SAD-UEPR cobre as sete Universidades Estaduais de Ensino Superior do Paraná: UEL (Universidade Estadual de Londrina), UEM (Universidade Estadual de Maringá), UEPG (Universidade Estadual de Ponta Grossa), UNIOESTE (Universidade Estadual do Oeste do Paraná), UNICENTRO (Universidade Estadual do Centro-Oeste), UENP (Universidade Estadual do Norte do Paraná) e UNESPAR (Universidade Estadual do Paraná).",
    tags: ["universidades", "instituições", "Paraná"]
  },

  // Entendendo os Dados
  {
    category: "Entendendo os Dados",
    question: "O que é a correção pelo IPCA e por que ela é importante?",
    answer: "O IPCA (Índice Nacional de Preços ao Consumidor Amplo) é o índice oficial de inflação do Brasil. A correção monetária atualiza valores históricos para permitir comparações justas entre diferentes períodos. Por exemplo, R$ 1.000 em 2010 não têm o mesmo poder de compra que R$ 1.000 em 2023. O SAD-UEPR aplica automaticamente essa correção em todas as consultas, usando dados oficiais do IPEA. Isso garante que análises temporais sejam precisas e reflitam valores reais, não nominais.",
    tags: ["IPCA", "inflação", "correção monetária"]
  },
  {
    category: "Entendendo os Dados",
    question: "O que significam 'Empenhado', 'Liquidado' e 'Pago'?",
    answer: "São os três estágios da execução orçamentária pública: EMPENHADO - Primeira fase, onde o governo reserva recursos do orçamento para um gasto específico, criando um compromisso formal. LIQUIDADO - Ocorre após verificação de que o produto foi entregue ou serviço prestado conforme contratado. É o reconhecimento da dívida. PAGO - Etapa final, quando o governo efetivamente transfere os recursos financeiros, quitando a obrigação. Para análises financeiras, o valor 'Pago' representa o gasto efetivamente realizado.",
    tags: ["orçamento", "execução", "terminologia"]
  },
  {
    category: "Entendendo os Dados",
    question: "Quais campos financeiros estão disponíveis para análise?",
    answer: "O sistema disponibiliza diversos indicadores financeiros: Orçamento LOA (valor inicial da Lei Orçamentária Anual), Total Orçamentário (recursos disponíveis após ajustes), Disponibilidade Orçamentária (saldo disponível), Empenhado, Liquidado e Pago (estágios da execução), Restos a Pagar (despesas não quitadas de exercícios anteriores). Campos com sufixo 'Até Mês' mostram valores acumulados até o período consultado, enquanto 'No Mês' exibe apenas o valor do período específico. Todos os valores monetários são automaticamente corrigidos pelo IPCA.",
    tags: ["campos", "indicadores", "métricas"]
  },
  {
    category: "Entendendo os Dados",
    question: "Por que os fatores de correção variam entre anos?",
    answer: "O fator de correção representa o acúmulo da inflação entre o período original e a data de referência (dezembro de 2023). Quanto mais antigo o ano consultado, maior será o fator de correção, pois mais inflação acumulou-se no período. Por exemplo, dados de 2005 precisam de um fator maior que dados de 2020. O sistema calcula e aplica automaticamente o fator específico para cada ano. Você pode visualizar os detalhes completos clicando em 'Detalhes da Correção' nos resultados.",
    tags: ["correção", "fatores", "cálculo"]
  },
  {
    category: "Entendendo os Dados",
    question: "O que são as diferentes categorias de despesa (Função, Grupo de Natureza)?",
    answer: "A classificação orçamentária organiza as despesas em categorias: FUNÇÃO - Indica a área de atuação governamental (Educação, Saúde, Administração, etc.). Para universidades, a maioria dos recursos está em 'Educação'. GRUPO DE NATUREZA - Classifica o tipo de despesa (Pessoal e Encargos Sociais, Outras Despesas Correntes, Investimentos, etc.). ORIGEM DE RECURSOS - Identifica a fonte do financiamento (Tesouro Estadual, recursos próprios, convênios, etc.). Essas classificações permitem análises detalhadas de como os recursos são alocados e gastos.",
    tags: ["classificação", "categorias", "despesas"]
  },

  // Como Usar o Portal
  {
    category: "Como Usar o Portal",
    question: "Como realizar uma consulta de dados?",
    answer: "Na página de Consultas, selecione o período desejado (data inicial e final). O sistema automaticamente inicia a coleta dos dados. Para períodos curtos (1-2 anos), os resultados aparecem rapidamente. Para períodos mais longos, você verá uma barra de progresso indicando o andamento da coleta. Os dados são processados em paralelo para otimizar o tempo. Você pode navegar para outras páginas e voltar depois - o sistema mantém seus resultados em cache por 30 minutos.",
    tags: ["consulta", "busca", "como usar"]
  },
  {
    category: "Como Usar o Portal",
    question: "Por que consultas de múltiplos anos demoram mais?",
    answer: "O SAD-UEPR utiliza Web Scraping para coletar dados do Portal da Transparência, simulando navegação humana para preencher formulários e baixar informações. Para cada ano consultado, o sistema precisa: acessar o portal, navegar pelas páginas, preencher filtros, aguardar carregamento, fazer download dos dados e processar as informações. Embora o sistema use processamento paralelo para acelerar (coletando dados de vários anos simultaneamente), consultas de 10+ anos podem levar alguns minutos. O progresso é exibido em tempo real.",
    tags: ["performance", "web scraping", "tempo"]
  },
  {
    category: "Como Usar o Portal",
    question: "Como funciona o sistema de cache de consultas?",
    answer: "Para melhorar a experiência, o sistema mantém suas últimas consultas em cache no navegador por 30 minutos. Isso significa que se você fechar a aba ou navegar para outra página, seus resultados ainda estarão disponíveis quando voltar. O cache é limpo automaticamente após o período, mas você também pode limpá-lo manualmente usando o botão de gerenciamento de cache. Consultas idênticas realizadas dentro do período de cache são instantâneas.",
    tags: ["cache", "performance", "otimização"]
  },
  {
    category: "Como Usar o Portal",
    question: "Como usar os diferentes tipos de visualização?",
    answer: "Os resultados podem ser visualizados de três formas: TABELA - Exibição detalhada de todos os dados com recursos de ordenação (clique nos cabeçalhos), filtragem por múltiplos critérios e busca textual. Ideal para análises detalhadas. GRÁFICOS - Oferece cinco tipos de gráficos (barras, linhas, pizza, área e radar) com múltiplas opções de comparação e customização completa de cores, tamanho e estilos. ESTATÍSTICAS - Mostra automaticamente indicadores como média, mediana, desvio padrão, valores máximos e mínimos, além de insights gerados por análise dos dados.",
    tags: ["visualização", "gráficos", "tabela"]
  },
  {
    category: "Como Usar o Portal",
    question: "Quais são as opções de comparação nos gráficos?",
    answer: "O sistema oferece três modos de comparação: ENTRE UNIVERSIDADES - Compara o desempenho de diferentes instituições em um mesmo indicador. Ideal para benchmarking e análises comparativas institucionais. ENTRE ANOS - Mostra a evolução temporal de um indicador, consolidando dados de todas as universidades por período. Útil para identificar tendências históricas. EVOLUÇÃO ANUAL - Gráfico de linhas temporais mostrando a trajetória de cada universidade individualmente. Permite análise detalhada de tendências específicas de cada instituição ao longo do tempo.",
    tags: ["comparação", "análise", "gráficos"]
  },
  {
    category: "Como Usar o Portal",
    question: "Como customizar os gráficos?",
    answer: "A visualização de gráficos oferece ampla customização através do painel de controles: VISUALIZAÇÃO - Ative/desative estatísticas, insights, linha de média, grade e legenda. CORES - Escolha entre 8 paletas predefinidas (Padrão, Profissional, Vibrante, Pastel, Escuro, Oceano, Floresta, Pôr do Sol). DIMENSÕES - Ajuste a altura do gráfico de 300px a 800px ou use presets (Pequeno, Médio, Grande, Extra Grande). ESTILO - Configure espessura de linhas (1-5px) e arredondamento de barras (0-20px). ORDENAÇÃO - Organize dados por valor ou nome, em ordem crescente, decrescente ou original.",
    tags: ["customização", "personalização", "controles"]
  },
  {
    category: "Como Usar o Portal",
    question: "Como filtrar dados nos resultados?",
    answer: "O sistema oferece filtragem avançada em múltiplos níveis: Filtros por ANO (selecione anos específicos ou intervalos), UNIVERSIDADE (escolha uma ou múltiplas instituições), FUNÇÃO (foque em áreas específicas como Educação ou Administração), GRUPO DE NATUREZA (analise tipos de despesa) e ORIGEM DE RECURSOS (identifique fontes de financiamento). Os filtros podem ser combinados livremente e são aplicados em tempo real. Um resumo mostra quantos registros foram filtrados do total disponível.",
    tags: ["filtros", "busca", "seleção"]
  },
  {
    category: "Como Usar o Portal",
    question: "Como exportar os dados?",
    answer: "Use o botão 'Exportar' no canto superior direito dos resultados. Escolha entre formatos: EXCEL (.xlsx) - Ideal para análises em planilhas, mantém formatação. PDF - Para relatórios impressos com layout profissional. CSV - Dados tabulares simples, compatível com qualquer ferramenta. JSON - Formato estruturado para integração com outros sistemas. Você pode selecionar quais colunas incluir, personalizar título e subtítulo, e incluir/excluir metadados sobre correção monetária. Filtros ativos são respeitados na exportação.",
    tags: ["exportação", "download", "relatórios"]
  },
  {
    category: "Como Usar o Portal",
    question: "Como usar a calculadora de correção IPCA?",
    answer: "Acesse 'Calculadora IPCA' no menu. Insira: o VALOR ORIGINAL (quantia a ser corrigida), DATA INICIAL (quando o valor foi estabelecido) e DATA FINAL (para quando deseja corrigir). O sistema calcula automaticamente o valor atualizado usando dados oficiais do IPEA, mostrando: valor corrigido, percentual de correção acumulado e fator de correção aplicado. Útil para atualizar valores de contratos, salários, investimentos ou qualquer quantia monetária histórica.",
    tags: ["calculadora", "IPCA", "correção"]
  },
  {
    category: "Como Usar o Portal",
    question: "Como consultar séries históricas do IPCA?",
    answer: "Na página 'Séries IPCA', você pode visualizar a evolução da inflação oficial ao longo do tempo. Escolha entre visualização mensal (IPCA mês a mês) ou acumulada (inflação acumulada em 12 meses). Os dados são apresentados em gráficos interativos e tabelas detalhadas, permitindo identificar períodos de alta/baixa inflação. Essa funcionalidade é útil para contextualizar as correções monetárias aplicadas nos dados das universidades.",
    tags: ["séries", "IPCA", "histórico"]
  },
  {
    category: "Como Usar o Portal",
    question: "O que fazer quando aparecem anos ausentes nos resultados?",
    answer: "Se aparecer o aviso 'Anos Ausentes', significa que alguns anos do período solicitado não retornaram dados. Causas possíveis: indisponibilidade temporária no Portal da Transparência, mudanças na estrutura dos dados públicos ou períodos sem registros. Recomendações: 1) Refaça a consulta (pode ter sido instabilidade temporária), 2) Tente consultar os anos problemáticos individualmente, 3) Verifique no Portal da Transparência do Paraná se os dados estão disponíveis. Os dados coletados dos demais anos permanecem válidos para análise.",
    tags: ["erro", "dados ausentes", "solução"]
  },
  {
    category: "Como Usar o Portal",
    question: "Como usar o histórico de consultas?",
    answer: "O sistema mantém um histórico completo de suas últimas consultas acessível via botão 'Histórico' no canto superior direito da página de Consultas. Cada entrada do histórico mostra: período consultado, data/hora da consulta, quantidade de registros obtidos e status da correção monetária aplicada. Você pode: reexecutar consultas anteriores com um clique, comparar resultados de diferentes períodos ou limpar o histórico. O histórico é mantido no navegador e persiste entre sessões.",
    tags: ["histórico", "consultas anteriores", "gerenciamento"]
  },

  // Recursos Avançados
  {
    category: "Recursos Avançados",
    question: "Como funcionam as estatísticas automáticas?",
    answer: "Ao ativar 'Mostrar Estatísticas' nos gráficos, o sistema calcula automaticamente: MÉDIA (valor médio do conjunto), MEDIANA (valor central quando ordenados), DESVIO PADRÃO (medida de dispersão dos dados), VALORES MÁXIMO E MÍNIMO (extremos do conjunto), COEFICIENTE DE VARIAÇÃO (dispersão relativa). Essas métricas ajudam a entender a distribuição e variabilidade dos dados. Para comparações entre universidades, recomenda-se análise por indicadores relativos (ex: valor per capita).",
    tags: ["estatísticas", "análise", "métricas"]
  },
  {
    category: "Recursos Avançados",
    question: "O que são os insights gerados automaticamente?",
    answer: "Ao ativar 'Mostrar Insights', o sistema analisa os dados e gera observações relevantes como: universidade com maior/menor valor em determinado indicador, percentual que representa em relação ao total, tendências de crescimento ou queda ao longo do tempo, comparações entre períodos e identificação de outliers (valores muito discrepantes). Esses insights facilitam a interpretação rápida dos dados e ajudam a identificar pontos de atenção para análise mais profunda.",
    tags: ["insights", "análise automática", "interpretação"]
  },
  {
    category: "Recursos Avançados",
    question: "Como comparar múltiplas universidades na evolução anual?",
    answer: "No modo 'Evolução Anual', você pode: 1) Ver todas as universidades simultaneamente em um gráfico de linhas temporais, 2) Usar a aba 'Universidades' nos controles para selecionar apenas as instituições de interesse, 3) Usar os botões 'Selecionar Todas' ou 'Remover Todas' para controle rápido, 4) Escolher paletas de cores diferentes para melhor distinção visual. Cada linha representa a trajetória de uma universidade, permitindo identificar padrões, convergências e divergências ao longo do tempo.",
    tags: ["evolução", "comparação", "temporal"]
  },
  {
    category: "Recursos Avançados",
    question: "Como interpretar gráficos de radar?",
    answer: "O gráfico de radar (ou teia) é ideal para comparações multidimensionais. Cada eixo representa uma universidade, e a área formada pela conexão dos pontos mostra a distribuição do indicador selecionado entre elas. Áreas maiores indicam valores mais altos, enquanto polígonos mais simétricos sugerem distribuição mais equilibrada. Use o radar para identificar rapidamente quais universidades se destacam ou ficam abaixo da média em determinado indicador.",
    tags: ["radar", "visualização", "multidimensional"]
  },
  {
    category: "Recursos Avançados",
    question: "Como salvar configurações favoritas de gráficos?",
    answer: "Atualmente, as configurações de visualização (tipo de gráfico, paleta de cores, altura, etc.) são mantidas durante a sessão de navegação. Para análises recorrentes, recomendamos: 1) Usar o histórico de consultas para reexecutar buscas idênticas, 2) Exportar os dados com as configurações desejadas, 3) Anotar suas preferências de visualização. Uma funcionalidade de 'salvamento de presets' está planejada para versões futuras do sistema.",
    tags: ["configurações", "personalização", "preferências"]
  },

  // Para Desenvolvedores e Pesquisadores
  {
    category: "Para Desenvolvedores e Pesquisadores",
    question: "Como acessar a API do sistema?",
    answer: "O SAD-UEPR disponibiliza uma API REST completa para acesso programático aos dados. A documentação interativa está disponível em '/api/docs' (Swagger UI) com todos os endpoints, parâmetros, exemplos de requisições e respostas. Principais endpoints: GET /consultas (dados de transparência), GET /ipca (índices de correção), GET /universidades (informações institucionais). A API retorna dados em JSON, já processados e corrigidos pelo IPCA. Não é necessária autenticação para consultas públicas.",
    tags: ["API", "integração", "desenvolvimento"]
  },
  {
    category: "Para Desenvolvedores e Pesquisadores",
    question: "Quais tecnologias foram utilizadas no projeto?",
    answer: "Stack completo: BACKEND - Python 3.11+, FastAPI (framework web), SQLAlchemy (ORM), Pydantic (validação), Pandas (processamento de dados), Selenium (web scraping), PostgreSQL (banco de dados). FRONTEND - TypeScript, React 18, Tailwind CSS, Recharts (visualização), Framer Motion (animações), Vite (build tool). INFRAESTRUTURA - Docker (containerização), Nginx (proxy reverso), Redis (cache opcional). O código segue padrões modernos de Clean Architecture e está totalmente tipado.",
    tags: ["tecnologia", "stack", "arquitetura"]
  },
  {
    category: "Para Desenvolvedores e Pesquisadores",
    question: "O código-fonte está disponível?",
    answer: "Sim, o projeto é totalmente open-source sob licença MIT. O repositório no GitHub contém: código completo do backend (API + crawler), código do frontend (interface web), documentação técnica, scripts de setup e deployment, testes automatizados e exemplos de uso. Contribuições são bem-vindas via Pull Requests. O link está disponível no rodapé do site na seção 'GitHub'.",
    tags: ["código", "open source", "GitHub"]
  },
  {
    category: "Para Desenvolvedores e Pesquisadores",
    question: "Como citar o SAD-UEPR em trabalhos acadêmicos?",
    answer: "Sugestão de citação: 'Sistema de Apoio à Decisão das Universidades Estaduais do Paraná (SAD-UEPR). Desenvolvido por [Seu Nome], 2024. Trabalho de Conclusão de Curso, Ciência da Computação, UNIOESTE. Disponível em: [URL do sistema]. Acesso em: [data da consulta].' Sempre inclua: período dos dados analisados, data de referência da correção IPCA (dez/2023), menção às fontes originais (Portal da Transparência do Paraná, IPEA, INEP) e parâmetros específicos da consulta para reprodutibilidade.",
    tags: ["citação", "acadêmico", "referência"]
  },
  {
    category: "Para Desenvolvedores e Pesquisadores",
    question: "Quais métricas são recomendadas para análises comparativas?",
    answer: "Para comparações entre instituições de diferentes portes, use MÉTRICAS RELATIVAS: investimento per capita (total gasto / número de alunos), percentual do orçamento por categoria (despesa específica / total), taxa de execução orçamentária (pago / empenhado). Para SÉRIES TEMPORAIS: sempre use valores corrigidos pelo IPCA, analise taxas de crescimento real (descontada inflação), use médias móveis para suavizar variações sazonais. Para ANÁLISES MULTIVARIADAS: exporte dados em CSV/JSON e use ferramentas como R, Python (pandas, matplotlib), SPSS ou Excel avançado.",
    tags: ["análise", "métricas", "pesquisa"]
  },
  {
    category: "Para Desenvolvedores e Pesquisadores",
    question: "Como usar os dados em outras ferramentas de análise?",
    answer: "Fluxo recomendado: 1) Realize a consulta no portal com os filtros desejados, 2) Exporte em CSV ou JSON, 3) Importe em sua ferramenta de análise. PYTHON: use pandas.read_csv() ou pandas.read_json(). R: use read.csv() ou jsonlite::fromJSON(). EXCEL: abra diretamente arquivos .xlsx ou importe CSV. TABLEAU/POWER BI: conecte via arquivo ou use a API para integração direta. Os dados exportados mantêm todas as classificações e metadados de correção monetária.",
    tags: ["integração", "análise", "ferramentas"]
  },
  {
    category: "Para Desenvolvedores e Pesquisadores",
    question: "Posso incorporar visualizações em outros sites?",
    answer: "Sim, com algumas opções: 1) SCREENSHOTS - Capture as visualizações e use em apresentações/documentos, sempre citando a fonte. 2) API + PRÓPRIA INTERFACE - Use nossa API para obter dados e construa suas próprias visualizações customizadas. 3) IFRAME (futuro) - Funcionalidade de embed direto está em desenvolvimento. Para trabalhos acadêmicos, inclua sempre: fonte dos dados (Portal da Transparência PR), processamento (SAD-UEPR), data da consulta e parâmetros de correção monetária para garantir reprodutibilidade.",
    tags: ["embed", "compartilhamento", "visualização"]
  },
  {
    category: "Para Desenvolvedores e Pesquisadores",
    question: "Como contribuir com melhorias no sistema?",
    answer: "Contribuições são muito bem-vindas! Você pode: 1) REPORTAR BUGS - Abra uma issue no GitHub descrevendo o problema, 2) SUGERIR FUNCIONALIDADES - Proponha melhorias via issues, 3) CONTRIBUIR COM CÓDIGO - Faça fork do repositório, implemente melhorias e envie Pull Request, 4) MELHORAR DOCUMENTAÇÃO - Correções e adições à documentação são sempre úteis. Siga as guidelines do projeto, mantenha a cobertura de testes e use as convenções de código estabelecidas.",
    tags: ["contribuição", "desenvolvimento", "comunidade"]
  },

  // Solução de Problemas
  {
    category: "Solução de Problemas",
    question: "Por que não vejo resultados na minha consulta?",
    answer: "Verifique: 1) PERÍODO SELECIONADO - Confirme se as datas estão corretas e dentro do intervalo 2002-2023. 2) PROGRESSO DA COLETA - Aguarde a conclusão se a barra de progresso ainda estiver ativa. 3) FILTROS ATIVOS - Verifique se não há filtros muito restritivos aplicados. 4) CONEXÃO - Certifique-se de estar conectado à internet. 5) CACHE DO NAVEGADOR - Tente limpar o cache e recarregar a página (Ctrl+F5). Se o problema persistir, tente consultar anos individuais ou períodos menores.",
    tags: ["problema", "consulta vazia", "solução"]
  },
  {
    category: "Solução de Problemas",
    question: "Os gráficos não estão carregando, o que fazer?",
    answer: "Soluções: 1) RECARREGUE A PÁGINA - Pressione Ctrl+F5 para recarregar forçando atualização do cache. 2) VERIFIQUE O NAVEGADOR - Use versões atualizadas de Chrome, Firefox ou Edge. 3) DESATIVE EXTENSÕES - Bloqueadores de anúncios ou scripts podem interferir. 4) JAVASCRIPT - Certifique-se de que JavaScript está habilitado. 5) DADOS SUFICIENTES - Alguns gráficos (como pizza) requerem múltiplos pontos de dados. Se usar navegador muito antigo, considere atualizar para melhor compatibilidade.",
    tags: ["problema", "gráficos", "visualização"]
  },
  {
    category: "Solução de Problemas",
    question: "A exportação está falhando, como resolver?",
    answer: "Tente: 1) REDUZA A SELEÇÃO - Exporte menos colunas ou filtre mais dados antes de exportar. 2) FORMATO DIFERENTE - Se PDF falhar, tente CSV ou Excel. 3) PERMISSÕES - Verifique se o navegador tem permissão para downloads. 4) ESPAÇO EM DISCO - Confirme que há espaço suficiente no dispositivo. 5) POPUP BLOCKER - Desative bloqueadores de popup temporariamente. Para exportações muito grandes (>10.000 registros), considere filtrar por períodos menores ou usar a API para acesso programático.",
    tags: ["problema", "exportação", "download"]
  },
  {
    category: "Solução de Problemas",
    question: "O site está lento, é normal?",
    answer: "Alguns fatores podem afetar a velocidade: 1) CONSULTAS LONGAS - Períodos de 10+ anos naturalmente demoram mais devido ao volume de dados. 2) PRIMEIRA CONSULTA - O primeiro acesso pode ser mais lento enquanto recursos são carregados. 3) HORÁRIO - Picos de acesso ou instabilidade no Portal da Transparência podem impactar. 4) CONEXÃO - Verifique sua velocidade de internet. 5) DISPOSITIVO - Hardware mais antigo pode processar visualizações complexas mais lentamente. O sistema usa cache e processamento paralelo para otimizar performance. Se persistir muito lento, tente consultas menores ou horários alternativos.",
    tags: ["performance", "lentidão", "otimização"]
  },
  {
    category: "Solução de Problemas",
    question: "Perdi minha consulta ao fechar a aba, como recuperar?",
    answer: "Se fechou a aba há menos de 30 minutos: 1) Acesse novamente a página de Consultas, 2) O sistema automaticamente tentará restaurar a última consulta do cache, 3) Você verá uma notificação perguntando se deseja restaurar os dados. Se passou mais de 30 minutos ou limpou o cache: use o Histórico de Consultas para reexecutar. Para consultas importantes, recomendamos exportar os resultados. O sistema mantém histórico persistente de todas as consultas realizadas, acessível via botão 'Histórico'.",
    tags: ["recuperação", "cache", "dados perdidos"]
  }
];

export const faqCategories = [...new Set(faqData.map(item => item.category))];

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    "Questões Gerais": "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    "Entendendo os Dados": "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    "Como Usar o Portal": "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    "Recursos Avançados": "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    "Para Desenvolvedores e Pesquisadores": "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    "Solução de Problemas": "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
  };
  
  return icons[category] || icons["Questões Gerais"];
};