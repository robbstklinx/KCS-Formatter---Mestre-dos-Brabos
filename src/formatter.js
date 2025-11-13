// formatter.js
function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function generateTags(text){
  if(!text) return '';
  const banned = new Set(['como','para','realizar','o','a','os','as','no','na','de','do','da','um','uma','e','em','que','se']);
  const words = (text.toLowerCase().match(/[a-zà-ú0-9]+/g)||[]).filter(w=>w.length>3 && !banned.has(w));
  const uniq = [...new Set(words)];
  const pairs=[]; for(let i=0;i<uniq.length-1;i++) pairs.push(`${uniq[i]}-${uniq[i+1]}`);
  const tags = uniq.slice(0,4).concat(pairs.slice(0,2));
  return tags.slice(0,6).join('; ');
}

function extractQuestionPhrase(text){
  const m = text.match(/como\s+([^\?\.\n]+)/i);
  if(m) return m[1].trim();
  return (text.split(/\n/)[0]||'').trim();
}

function detectModule(text){
  const modules=['Faturamento','Empresa','Suprimentos','Segurança','Estoque','Fiscal','Postos','Farma','Automotivo'];
  for(const c of modules) if(new RegExp('\\b'+c+'\\b','i').test(text)) return c;
  return '';
}

function buildTitle(moduleName, questionPhrase){
  const base='Linx Microvix';
  const mod = moduleName? (' - ' + moduleName) : '';
  let q = (questionPhrase||'').toString().replace(/^\s*como\s*/i,'');
  // Remove pontuação final (?, !, .)
  q = q.replace(/[?!.]+$/, '').trim();
  const qCap = q.charAt(0).toUpperCase() + q.slice(1);
  return `${base}${mod} - Como ${qCap}`;
}

function buildDescription(questionPhrase, moduleName){
  const q = (questionPhrase||'').toString().replace(/^\s*como\s*/i,'').trim();
  if(!q) {
    if(moduleName) return `Para realizar o procedimento no módulo ${moduleName}, realize os passos a seguir:`;
    return 'Descrição automática';
  }
  return `Para ${q}, realize os passos a seguir:`;
}

function normalizeStepsText(raw){
  if(!raw) return '';
  const lines = raw.split(/\n+/);
  const out = [];
  let stepCounter = 1;
  let lastIndent = 0;

  for(let i=0; i<lines.length; i++){
    const ln = lines[i];
    // Calcular indentação (espaços ou tabs)
    const leadingWhitespace = ln.match(/^(\s*)/)[0];
    const indentLevel = (leadingWhitespace.match(/\t/g)||[]).length + 
                        Math.floor((leadingWhitespace.match(/ /g)||[]).length / 2);
    
    const trimmed = ln.trim();
    if(!trimmed) continue;

    // Remover bullets/dashes
    const cleaned = trimmed.replace(/^[-–•]\s+/, '');
    
    // Se tem indentação ou é um bullet, é um subpasso
    if(indentLevel > lastIndent || /^[-–•]/.test(trimmed)){
      const subStepNum = out.length + 1;
      out.push(`  ${stepCounter}.${subStepNum}. ${cleaned};`);
    } else {
      // Reset se voltou para nível 0
      if(indentLevel <= lastIndent && lastIndent > 0) {
        stepCounter++;
      }
      out.push(`${stepCounter}. ${cleaned};`);
      lastIndent = indentLevel;
    }
  }

  // Ajustar última linha (ponto em vez de ponto e vírgula)
  if(out.length > 0) {
    out[out.length-1] = out[out.length-1].replace(/;$/, '.');
  }
  
  return out.join('\n');
}
