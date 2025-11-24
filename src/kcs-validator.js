/**
 * KCS Validator - Valida e normaliza dados KCS
 * Garante que o JSON retornado da IA respeita a estrutura esperada
 */

// Módulos válidos na Linx Microvix
const VALID_MODULES = [
  'Faturamento',
  'Estoque',
  'Fiscal',
  'Empresa',
  'Suprimentos',
  'Segurança',
  'Postos',
  'Farma',
  'Automotivo',
  'Vendas',
  'Compras',
  'Contábil',
  'RH',
  'PDV',
  'ERP',
  'Geral'
];

/**
 * Valida se um objeto KCS está bem formado
 * @param {Object} kcsData - Dados KCS a validar
 * @returns {Object} { valid: boolean, errors: string[], warnings: string[], data: Object }
 */
function validateKCS(kcsData) {
  const errors = [];
  const warnings = [];
  let data = { ...kcsData };

  // Validar estrutura básica
  if (!kcsData || typeof kcsData !== 'object') {
    return {
      valid: false,
      errors: ['Dados KCS devem ser um objeto'],
      warnings: [],
      data: {}
    };
  }

  // Validar TITLE (obrigatório)
  if (!data.title || typeof data.title !== 'string') {
    errors.push('Campo "title" é obrigatório e deve ser string');
  } else {
    // Valida formato do título
    if (!data.title.includes('Linx Microvix')) {
      warnings.push('Título deveria começar com "Linx Microvix"');
      data.title = `Linx Microvix - ${data.title}`;
    }
    if (data.title.length > 200) {
      errors.push('Título muito longo (máx 200 caracteres)');
      data.title = data.title.substring(0, 200);
    }
    if (data.title.endsWith('.')) {
      warnings.push('Título não deve terminar com ponto');
      data.title = data.title.slice(0, -1);
    }
  }

  // Validar MODULE (obrigatório)
  if (!data.module || typeof data.module !== 'string') {
    errors.push('Campo "module" é obrigatório e deve ser string');
  } else {
    // Normaliza módulo
    const normalizedModule = VALID_MODULES.find(m => 
      m.toLowerCase() === data.module.toLowerCase()
    );
    if (normalizedModule) {
      data.module = normalizedModule;
    } else {
      warnings.push(`Módulo "${data.module}" não está na lista padrão. Módulos válidos: ${VALID_MODULES.join(', ')}`);
    }
    if (data.module.length > 50) {
      errors.push('Módulo muito longo (máx 50 caracteres)');
      data.module = data.module.substring(0, 50);
    }
  }

  // Validar DESCRIPTION (obrigatório)
  if (!data.description || typeof data.description !== 'string') {
    errors.push('Campo "description" é obrigatório e deve ser string');
  } else {
    if (!data.description.toLowerCase().startsWith('para ')) {
      warnings.push('Descrição deveria começar com "Para..."');
      data.description = `Para ${data.description}`;
    }
    if (data.description.length < 10) {
      errors.push('Descrição muito curta (mín 10 caracteres)');
    }
    if (data.description.length > 500) {
      errors.push('Descrição muito longa (máx 500 caracteres)');
      data.description = data.description.substring(0, 500);
    }
  }

  // Validar CAUSE (opcional)
  if (data.cause && typeof data.cause !== 'string') {
    errors.push('Campo "cause" deve ser string');
  } else if (data.cause) {
    if (data.cause.length > 500) {
      warnings.push('Causa muito longa, truncando para 500 caracteres');
      data.cause = data.cause.substring(0, 500);
    }
  } else {
    data.cause = '';
  }

  // Validar SOLUTION (obrigatório - array de strings)
  if (!Array.isArray(data.solution)) {
    errors.push('Campo "solution" é obrigatório e deve ser array');
    data.solution = [];
  } else {
    if (data.solution.length === 0) {
      errors.push('Array "solution" não pode estar vazio');
    }
    // Filtra strings vazias e valida cada passo
    data.solution = data.solution
      .filter(step => typeof step === 'string' && step.trim().length > 0)
      .map((step, idx) => {
        if (step.length > 1000) {
          warnings.push(`Passo ${idx + 1} muito longo, truncando`);
          return step.substring(0, 1000);
        }
        return step.trim();
      });
    
    if (data.solution.length === 0) {
      errors.push('Nenhum passo válido na solution');
    }
  }

  // Validar LINKS (opcional - array de URLs)
  if (!Array.isArray(data.links)) {
    data.links = [];
  } else {
    data.links = data.links
      .filter(link => typeof link === 'string' && isValidUrl(link))
      .slice(0, 5); // Máximo 5 links
    
    if (data.links.length < data.links.length) {
      warnings.push('Algumas URLs foram removidas por não serem válidas');
    }
  }

  // Validar TAGS (opcional - array de strings, máx 6)
  if (!Array.isArray(data.tags)) {
    data.tags = [];
  } else {
    data.tags = data.tags
      .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
      .map(tag => tag.trim().toLowerCase())
      .slice(0, 6); // Máximo 6 tags
    
    if (data.tags.length > 6) {
      warnings.push('Limitado a 6 tags');
    }
  }

  const valid = errors.length === 0;

  return { valid, errors, warnings, data };
}

/**
 * Verifica se uma string é uma URL válida
 * @param {string} url - URL a validar
 * @returns {boolean}
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Tenta corrigir automaticamente um JSON KCS
 * @param {string|Object} kcsData - String JSON ou Object
 * @returns {Object} { success: boolean, data: Object, errors: string[] }
 */
function fixKCSJson(kcsData) {
  try {
    // Se for string, parse para objeto
    let data = typeof kcsData === 'string' ? JSON.parse(kcsData) : kcsData;
    
    const validation = validateKCS(data);
    
    if (validation.valid) {
      return { success: true, data: validation.data, errors: [] };
    }
    
    return {
      success: false,
      data: validation.data,
      errors: validation.errors,
      warnings: validation.warnings
    };
  } catch (err) {
    return {
      success: false,
      data: {},
      errors: [`Erro ao processar JSON: ${err.message}`]
    };
  }
}

/**
 * Converte um JSON KCS para formato de exibição amigável
 * @param {Object} kcsData - Dados KCS
 * @returns {string} Texto formatado
 */
function formatKCSForDisplay(kcsData) {
  if (!kcsData) return '';

  let output = '';
  
  if (kcsData.title) {
    output += `📋 TÍTULO\n${kcsData.title}\n\n`;
  }
  
  if (kcsData.module) {
    output += `📦 MÓDULO\n${kcsData.module}\n\n`;
  }
  
  if (kcsData.description) {
    output += `📝 DESCRIÇÃO\n${kcsData.description}\n\n`;
  }
  
  if (kcsData.cause) {
    output += `⚠️ CAUSA\n${kcsData.cause}\n\n`;
  }
  
  if (kcsData.solution && Array.isArray(kcsData.solution) && kcsData.solution.length > 0) {
    output += `✅ SOLUÇÃO\n`;
    kcsData.solution.forEach((step, idx) => {
      output += `${idx + 1}. ${step}\n`;
    });
    output += '\n';
  }
  
  if (kcsData.links && Array.isArray(kcsData.links) && kcsData.links.length > 0) {
    output += `🔗 LINKS\n`;
    kcsData.links.forEach(link => {
      output += `• ${link}\n`;
    });
    output += '\n';
  }
  
  if (kcsData.tags && Array.isArray(kcsData.tags) && kcsData.tags.length > 0) {
    output += `#️⃣ TAGS\n`;
    output += kcsData.tags.map(tag => `#${tag}`).join(', ');
    output += '\n';
  }
  
  return output;
}

module.exports = {
  validateKCS,
  fixKCSJson,
  formatKCSForDisplay,
  isValidUrl,
  VALID_MODULES
};
