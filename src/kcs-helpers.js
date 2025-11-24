/**
 * KCS Helpers - Funções utilitárias para processamento KCS
 */

/**
 * Formata um título segundo padrão KCS
 * @param {string} titulo - Título bruto
 * @param {string} modulo - Módulo identificado
 * @param {string} acao - Ação principal (Como [ação])
 * @returns {string} Título formatado
 */
function formatarTitulo(titulo, modulo = '', acao = '') {
  // Remove "Linx Microvix -" se já existir
  titulo = titulo.replace(/^Linx\s+Microvix\s*-\s*/i, '');
  
  // Remove pontuação final
  titulo = titulo.replace(/[.!?]+$/, '');
  
  // Se temos módulo e ação, usa o padrão
  if (modulo && acao) {
    return `Linx Microvix - ${modulo} - Como ${acao}`;
  }
  
  // Se temos só o título, adiciona prefixo
  if (!titulo.startsWith('Linx Microvix')) {
    return `Linx Microvix - ${titulo}`;
  }
  
  return titulo;
}

/**
 * Detecta o módulo a partir do conteúdo
 * @param {string} conteudo - Conteúdo do artigo
 * @returns {string} Módulo detectado
 */
function detectarModulo(conteudo) {
  const moduloPadroes = {
    'Faturamento': /faturamento|nota\s+fiscal|nf|emissão|imposto|icms|pis|cofins/i,
    'Estoque': /estoque|almoxarifado|quantidade|movimentação|entrada|saída/i,
    'Fiscal': /fiscal|imposto|sped|ecf|cte|mdf/i,
    'Empresa': /empresa|filial|matriz|cnpj|razão\s+social/i,
    'Vendas': /venda|cliente|pedido|fatura|comissão|desconto/i,
    'Compras': /compra|fornecedor|requisição|cotação|empenho/i,
    'Contábil': /contábil|contabilidade|lançamento|diário|razão/i,
    'RH': /recursos?\s+humanos?|folha|pagamento|funcionário|departamento/i,
    'PDV': /pdv|ponto\s+de\s+venda|caixa|venda\s+no\s+balcão|operador/i,
    'ERP': /erp|sistema|módulo|integração|base\s+de\s+dados/i
  };

  for (const [modulo, padrao] of Object.entries(moduloPadroes)) {
    if (padrao.test(conteudo)) {
      return modulo;
    }
  }

  return 'Geral';
}

/**
 * Gera tags automaticamente a partir do conteúdo
 * @param {string} conteudo - Conteúdo do artigo
 * @param {string} titulo - Título do artigo (opcional)
 * @param {number} maxTags - Máximo de tags (padrão: 6)
 * @returns {string[]} Array de tags
 */
function gerarTags(conteudo, titulo = '', maxTags = 6) {
  const tags = new Set();
  
  // Palavras-chave por frequência
  const palavras = conteudo.toLowerCase().split(/\s+/);
  const frequencia = {};
  
  palavras.forEach(palavra => {
    // Filtra palavras pequenas e stop words
    if (palavra.length > 4 && !isStopWord(palavra)) {
      frequencia[palavra] = (frequencia[palavra] || 0) + 1;
    }
  });
  
  // Ordena por frequência
  const sortedPalavras = Object.entries(frequencia)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTags)
    .map(([palavra]) => palavra);
  
  sortedPalavras.forEach(p => tags.add(p));
  
  // Adiciona palavras do título
  if (titulo) {
    titulo.toLowerCase().split(/\s+/).forEach(palavra => {
      if (palavra.length > 4 && !isStopWord(palavra) && tags.size < maxTags) {
        tags.add(palavra.replace(/[^a-zá-ú0-9]/gi, ''));
      }
    });
  }
  
  return Array.from(tags).slice(0, maxTags);
}

/**
 * Verifica se uma palavra é stop word (artigo, preposição, etc)
 * @param {string} palavra - Palavra a verificar
 * @returns {boolean}
 */
function isStopWord(palavra) {
  const stopWords = new Set([
    'a', 'o', 'e', 'é', 'de', 'do', 'da', 'em', 'um', 'uma', 'para', 'com',
    'sem', 'por', 'ou', 'que', 'se', 'mais', 'como', 'já', 'vai', 'vou',
    'tenho', 'tem', 'está', 'estão', 'ser', 'são', 'foi', 'fomos', 'somos',
    'este', 'esse', 'aquele', 'onde', 'quando', 'qual', 'quais', 'como',
    'linx', 'microvix', 'sistema', 'módulo', 'artigo', 'página'
  ]);
  return stopWords.has(palavra.toLowerCase());
}

/**
 * Normaliza a descrição KCS
 * @param {string} descricao - Descrição bruta
 * @returns {string} Descrição normalizada
 */
function normalizarDescricao(descricao) {
  // Remove quebras de linha e múltiplos espaços
  descricao = descricao.replace(/\s+/g, ' ').trim();
  
  // Garante que começa com "Para"
  if (!descricao.toLowerCase().startsWith('para ')) {
    descricao = `Para ${descricao}`;
  }
  
  // Remove ponto final (se houver)
  if (descricao.endsWith('.')) {
    descricao = descricao.slice(0, -1);
  }
  
  return descricao;
}

/**
 * Extrai URLs do conteúdo
 * @param {string} conteudo - Conteúdo a processar
 * @returns {string[]} Array de URLs encontradas
 */
function extrairUrls(conteudo) {
  const urlRegex = /https?:\/\/[^\s]+/gi;
  const urls = conteudo.match(urlRegex) || [];
  
  // Remove duplicatas e URLs inválidas
  return [...new Set(urls)].filter(url => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }).slice(0, 5); // Máximo 5 URLs
}

/**
 * Mede a qualidade do conteúdo (0-100)
 * @param {string} conteudo - Conteúdo a medir
 * @returns {Object} { score: number, feedback: string[] }
 */
function medirQualidadeConteudo(conteudo) {
  const feedback = [];
  let score = 50; // Score base
  
  if (!conteudo) {
    return { score: 0, feedback: ['Conteúdo vazio'] };
  }
  
  const comprimento = conteudo.length;
  const linhas = conteudo.split('\n').length;
  const palavras = conteudo.split(/\s+/).length;
  
  // Comprimento mínimo (200 caracteres)
  if (comprimento >= 200) {
    score += 10;
  } else {
    feedback.push('Conteúdo muito curto');
  }
  
  // Estrutura (linhas bem distribuídas)
  if (linhas >= 5) {
    score += 10;
  } else {
    feedback.push('Conteúdo pouco estruturado (poucos parágrafos)');
  }
  
  // Diversidade de vocabulário
  const palavrasUnicas = new Set(conteudo.toLowerCase().split(/\s+/)).size;
  if (palavrasUnicas / palavras > 0.6) {
    score += 15;
  } else {
    feedback.push('Vocabulário repetitivo');
  }
  
  // Presença de listas/estrutura
  if (/^\d+\.|^[-*•]/m.test(conteudo)) {
    score += 15;
  } else {
    feedback.push('Sem estrutura de passos/listas');
  }
  
  // Presença de URLs
  if (/https?:\/\//.test(conteudo)) {
    score += 10;
  }
  
  return {
    score: Math.min(100, score),
    feedback,
    metrics: { comprimento, linhas, palavras, palavrasUnicas }
  };
}

/**
 * Sumariza conteúdo para a descrição KCS
 * @param {string} conteudo - Conteúdo a sumarizar
 * @param {number} maxChars - Máximo de caracteres
 * @returns {string} Resumo
 */
function sumarizarConteudo(conteudo, maxChars = 150) {
  // Pega primeira frase ou parágrafo
  const primeiraFrase = conteudo.split(/[.!?]\s+/)[0];
  
  if (primeiraFrase.length > maxChars) {
    return primeiraFrase.substring(0, maxChars).trim() + '...';
  }
  
  return primeiraFrase;
}

module.exports = {
  formatarTitulo,
  detectarModulo,
  gerarTags,
  normalizarDescricao,
  extrairUrls,
  medirQualidadeConteudo,
  sumarizarConteudo,
  isStopWord
};
