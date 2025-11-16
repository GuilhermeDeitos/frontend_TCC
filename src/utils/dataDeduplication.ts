import type { DadosConsulta } from "../types/consulta";

/**
 * Cria uma chave única para identificar um registro de forma consistente
 */
export function criarChaveUnica(dado: DadosConsulta): string {
  // Usar múltiplos campos para garantir unicidade
  const universidade = dado.universidade || dado.UNIDADE_ORCAMENTARIA || "";
  const funcao = dado.funcao || dado.FUNCAO || "";
  const ano = dado.ano || dado.ANO || dado._ano_validado || "";
  const mes = dado.mes || dado.MES || "";
  const grupoNatureza = dado.grupo_natureza || dado.GRUPO_NATUREZA || "";
  const origemRecursos = dado.origem_recursos || dado.ORIGEM_RECURSOS || "";
  
  // Valores monetários (usar múltiplos para maior precisão)
  const valorPago = dado.valor_pago || dado.VALOR_PAGO || dado.pago_ate_mes || 0;
  const empenhado = dado.empenhado_ate_mes || 0;
  const liquidado = dado.liquidado_ate_mes || 0;

  return `${universidade}|${funcao}|${ano}|${mes}|${grupoNatureza}|${origemRecursos}|${valorPago}|${empenhado}|${liquidado}`;
}

/**
 * Remove dados duplicados de um array
 */
export function removerDuplicatas(dados: DadosConsulta[]): DadosConsulta[] {
  if (!dados || dados.length === 0) {
    return [];
  }

  console.log(`🔍 Verificando duplicatas em ${dados.length} registros...`);

  const chavesUnicas = new Map<string, DadosConsulta>();
  let duplicatasRemovidas = 0;

  dados.forEach((dado) => {
    const chave = criarChaveUnica(dado);
    
    if (!chavesUnicas.has(chave)) {
      chavesUnicas.set(chave, dado);
    } else {
      duplicatasRemovidas++;
      console.log(`⚠️ Duplicata detectada:`, {
        universidade: dado.universidade,
        ano: dado.ano,
        chave: chave.substring(0, 50) + '...'
      });
    }
  });

  const dadosUnicos = Array.from(chavesUnicas.values());

  if (duplicatasRemovidas > 0) {
    console.log(`✅ Removidas ${duplicatasRemovidas} duplicatas. ${dadosUnicos.length} registros únicos.`);
  } else {
    console.log(`✅ Nenhuma duplicata encontrada.`);
  }

  return dadosUnicos;
}

/**
 * Remove duplicatas comparando dois arrays
 */
export function removerDuplicatasEntreDoisArrays(
  dadosNovos: DadosConsulta[],
  dadosExistentes: DadosConsulta[]
): DadosConsulta[] {
  if (!dadosNovos || dadosNovos.length === 0) {
    return [];
  }

  if (!dadosExistentes || dadosExistentes.length === 0) {
    return removerDuplicatas(dadosNovos);
  }

  console.log(
    `🔍 Verificando ${dadosNovos.length} novos registros contra ${dadosExistentes.length} existentes...`
  );

  // Criar Set com chaves dos dados existentes
  const chavesExistentes = new Set(
    dadosExistentes.map((dado) => criarChaveUnica(dado))
  );

  // Filtrar apenas dados novos
  const dadosFiltrados = dadosNovos.filter((dado) => {
    const chave = criarChaveUnica(dado);
    return !chavesExistentes.has(chave);
  });

  const duplicatasRemovidas = dadosNovos.length - dadosFiltrados.length;

  if (duplicatasRemovidas > 0) {
    console.log(
      `✅ Removidas ${duplicatasRemovidas} duplicatas. ${dadosFiltrados.length} registros novos únicos.`
    );
  }

  // Remover duplicatas internas no resultado
  return removerDuplicatas(dadosFiltrados);
}

/**
 * Validar e limpar dados antes de adicionar
 */
export function validarELimparDados(dados: DadosConsulta[]): DadosConsulta[] {
  if (!dados || dados.length === 0) {
    return [];
  }

  console.log(`🔍 Validando ${dados.length} registros...`);

  // Filtrar registros inválidos
  const dadosValidos = dados.filter((dado) => {
    // Validar campos essenciais
    const temUniversidade = !!(dado.universidade || dado.UNIDADE_ORCAMENTARIA);
    const temAno = !!(dado.ano || dado.ANO || dado._ano_validado);
    
    if (!temUniversidade || !temAno) {
      console.warn('⚠️ Registro inválido (faltam campos essenciais):', dado);
      return false;
    }

    return true;
  });

  const registrosInvalidos = dados.length - dadosValidos.length;

  if (registrosInvalidos > 0) {
    console.log(`⚠️ Removidos ${registrosInvalidos} registros inválidos.`);
  }

  // Remover duplicatas dos dados válidos
  return removerDuplicatas(dadosValidos);
}