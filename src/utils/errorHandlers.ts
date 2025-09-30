/**
 * Extrai uma mensagem de erro legível para o usuário a partir de objetos de erro
 */
export function extrairMensagemErro(error: any): string {
  let errorMessage = "Erro ao consultar dados. Tente novamente.";
  
  // Se não houver erro, retorna mensagem padrão
  if (!error) return errorMessage;

  // Obter a mensagem de erro como string
  const errorStr = error.message || String(error);
  
  // Verificar tipos específicos de erro
  if (errorStr.includes("500")) {
    if (errorStr.includes("check_connected")) {
      errorMessage = "Erro de configuração na API. Entre em contato com o suporte.";
    } else {
      errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
    }
  } else if (
    errorStr.includes("Network Error") || 
    errorStr.includes("Failed to fetch") ||
    errorStr.includes("load failed")
  ) {
    errorMessage = "Servidor fora do ar. Verifique sua conexão.";
  } else if (errorStr.includes("timeout")) {
    errorMessage = "Tempo de espera esgotado. A consulta pode ser muito grande.";
  }

  return errorMessage;
}