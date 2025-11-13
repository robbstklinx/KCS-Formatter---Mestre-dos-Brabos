// ===== renderer.js =====

let quill;
let selectedArticle = null;

let modeSelect, manualCard, searchCard, editorCard, previewCard;
let quillEditor, formatBtn, clearBtn;
let searchInput, searchBtn, resultsContainer, useSelectedBtn;
let renderBtn, preview;

window.addEventListener('DOMContentLoaded', () => {
  modeSelect = document.getElementById('modeSelect');
  manualCard = document.getElementById('manualCard');
  searchCard = document.getElementById('searchCard');
  editorCard = document.getElementById('editorCard');
  previewCard = document.getElementById('previewCard');
  
  quillEditor = document.getElementById('quillEditor');
  formatBtn = document.getElementById('formatFromEditor');
  clearBtn = document.getElementById('clearEditor');
  
  searchInput = document.getElementById('searchInput');
  searchBtn = document.getElementById('searchBtn');
  resultsContainer = document.getElementById('results');
  useSelectedBtn = document.getElementById('useSelectedBtn');
  
  renderBtn = document.getElementById('renderBtn');
  preview = document.getElementById('preview');

  if (typeof Quill !== 'undefined' && quillEditor) {
    quill = new Quill('#quillEditor', {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['blockquote', 'code-block'],
          [{ 'size': ['small', 'normal', 'large', 'huge'] }]
        ]
      }
    });
    // Define tamanho padrão como 13px
    quill.root.style.fontSize = '13px';
    quill.root.style.fontFamily = '"Segoe UI", "default", system-ui, sans-serif';
  } else {
    quill = { root: quillEditor };
  }

  modeSelect.addEventListener('change', () => {
    const mode = modeSelect.value;
    if (mode === 'manual') {
      manualCard.classList.remove('hidden');
      searchCard.classList.add('hidden');
    } else {
      manualCard.classList.add('hidden');
      searchCard.classList.remove('hidden');
    }
  });

  // Função auxiliar para executar a busca
  async function executarBusca() {
    const termo = searchInput.value.trim();
    if (!termo) return alert('Digite algo para buscar.');

    resultsContainer.innerHTML = ' Buscando artigos...';
    try {
      const result = await window.electronAPI.searchShare(termo);
      if (result.error) throw new Error(result.error);

      if (!result.items || result.items.length === 0) {
        resultsContainer.innerHTML = 'Nenhum artigo encontrado.';
        return;
      }

      resultsContainer.innerHTML = '';
      result.items.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'result-item';
        const urlDisplay = item.url ? `<a href="${item.url}" target="_blank" style="color: #0ea5a0; font-size: 11px;">${item.url}</a>` : '<span style="color: #999; font-size: 11px;">Sem URL</span>';
        div.innerHTML = `<strong>${item.title}</strong><br><span class="small">${item.module || 'Sem módulo'}</span><br><div style="display: flex; gap: 8px; align-items: center; margin-top: 6px;">${urlDisplay}<button class="btn-open-window" style="background: #0ea5a0; color: #012; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer; white-space: nowrap; flex-shrink: 0;">🔗 Abrir</button></div>`;
        
        // Botão para abrir em nova janela
        const openBtn = div.querySelector('.btn-open-window');
        if (openBtn && item.url) {
          openBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            console.log('🔗 Clicou em abrir. URL:', item.url, 'Title:', item.title);
            try {
              const result = await window.electronAPI.openArticleWindow(item.url, item.title || 'Artigo');
              if (result.success) {
                console.log('✅', result.message);
              } else {
                alert('Erro: ' + result.error);
              }
            } catch (err) {
              console.error('❌ Erro ao abrir janela:', err);
              alert('Erro ao abrir janela: ' + err.message);
            }
          });
          openBtn.addEventListener('mouseenter', () => { openBtn.style.background = '#11c1bb'; });
          openBtn.addEventListener('mouseleave', () => { openBtn.style.background = '#0ea5a0'; });
        } else if (openBtn && !item.url) {
          openBtn.disabled = true;
          openBtn.style.opacity = '0.5';
          openBtn.style.cursor = 'not-allowed';
          openBtn.title = 'URL não disponível';
        }
        
        div.addEventListener('click', () => {
          document.querySelectorAll('.result-item').forEach(el => el.style.background = '');
          div.style.background = 'rgba(14,165,160,0.1)';
          selectedArticle = item;
          console.log('📌 Artigo selecionado:', item);
        });
        resultsContainer.appendChild(div);
      });
    } catch (err) {
      resultsContainer.innerHTML = `<span style="color:red">Erro: ${err.message}</span>`;
    }
  }

  searchBtn.addEventListener('click', executarBusca);

  // Suporte para tecla Enter no campo de busca
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executarBusca();
    }
  });

  // Buscar no Share Linx (base de conhecimento)
  const searchGoogleBtn = document.getElementById('searchGoogleBtn');
  if (searchGoogleBtn) {
    searchGoogleBtn.addEventListener('click', async () => {
      const termo = searchInput.value.trim();
      if (!termo) return alert('Digite algo para buscar.');

      resultsContainer.innerHTML = '🔍 Buscando na base de conhecimento do Share Linx...<br><small>Conectando ao Confluence...</small>';
      try {
        const result = await window.electronAPI.searchGoogle(termo);
        
        if (result.error && (!result.items || result.items.length === 0)) {
          let mensagem = `<strong>⚠️ Nenhum resultado encontrado</strong><br>${result.error}`;
          if (result.tips && result.tips.length > 0) {
            mensagem += '<br><small>Dicas:<br>' + result.tips.map(t => '• ' + t).join('<br>') + '</small>';
          }
          resultsContainer.innerHTML = `<div style="padding: 15px; background: #f8d7da; border-radius: 4px; color: #721c24;">
            ${mensagem}
          </div>`;
          return;
        }

        if (!result.items || result.items.length === 0) {
          resultsContainer.innerHTML = '❌ Nenhum artigo encontrado na base de conhecimento.';
          return;
        }

        // Identifica qual fonte foi usada
        const fonte = result.items[0]?.source || 'Share Linx';
        const iconeShareLinx = '�';

        resultsContainer.innerHTML = `<div style="padding: 10px; background: #d1ecf1; border-radius: 4px; margin-bottom: 10px; font-size: 12px;">
          <strong>${iconeShareLinx} Resultados da Base de Conhecimento (${result.items.length} encontrados)</strong><br>
          <small>Fonte: ${fonte}</small><br>
          <small>Clique em um resultado para usar no artigo.</small>
        </div>`;
        
        result.items.forEach((item) => {
          const div = document.createElement('div');
          div.className = 'result-item';
          const source = item.source || 'Share Linx';
          div.innerHTML = `<strong>${item.title || 'Sem título'}</strong><br>
            <span class="small">${source}</span><br>
            <small>${item.description || ''}</small><br>
            <div style="display: flex; gap: 8px; align-items: center; margin-top: 6px;">
              <a href="${item.url}" target="_blank" style="color: #0ea5a0; font-size: 11px; flex: 1; word-break: break-all;">${item.url}</a>
              <button class="btn-open-window" style="background: #0ea5a0; color: #012; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer; white-space: nowrap; flex-shrink: 0;">🔗 Abrir</button>
            </div>`;
          
          // Botão para abrir em nova janela
          const openBtn = div.querySelector('.btn-open-window');
          if (openBtn && item.url) {
            openBtn.addEventListener('click', async (e) => {
              e.stopPropagation();
              console.log('🔗 Clicou em abrir (busca KB). URL:', item.url, 'Title:', item.title);
              try {
                const result = await window.electronAPI.openArticleWindow(item.url, item.title || 'Artigo');
                if (result.success) {
                  console.log('✅', result.message);
                } else {
                  console.error('❌', result.error);
                  alert('Erro: ' + result.error);
                }
              } catch (err) {
                console.error('❌ Erro ao abrir janela:', err);
                alert('Erro ao abrir janela: ' + err.message);
              }
            });
            
            // Hover effect
            openBtn.addEventListener('mouseenter', () => {
              openBtn.style.background = '#11c1bb';
            });
            openBtn.addEventListener('mouseleave', () => {
              openBtn.style.background = '#0ea5a0';
            });
          } else if (openBtn && !item.url) {
            openBtn.disabled = true;
            openBtn.style.opacity = '0.5';
            openBtn.style.cursor = 'not-allowed';
            openBtn.title = 'URL não disponível';
          }
          
          div.addEventListener('click', () => {
            document.querySelectorAll('.result-item').forEach(el => el.style.background = '');
            div.style.background = 'rgba(14,165,160,0.1)';
            selectedArticle = item;
          });
          resultsContainer.appendChild(div);
        });
      } catch (err) {
        resultsContainer.innerHTML = `<div style="padding: 15px; background: #f8d7da; border-radius: 4px; color: #721c24;">
          <strong>❌ Erro na busca</strong><br>
          ${err.message}<br>
          <small style="margin-top: 10px; display: block;">Verifique sua conexão com o Share Linx.</small>
        </div>`;
        console.error('Erro ao buscar:', err);
      }
    });
  }

  useSelectedBtn.addEventListener('click', async () => {
    if (!selectedArticle) return alert('Selecione um artigo primeiro.');
    
    // Primeiro, tenta extrair conteúdo da URL
    let textoBase = selectedArticle.content || selectedArticle.text || selectedArticle.body || '';
    
    if (!textoBase && selectedArticle.url) {
      try {
        preview.innerHTML = '📥 Extraindo conteúdo do artigo...';
        const extracted = await window.electronAPI.extractArticleContent(selectedArticle.url);
        if (extracted.error) {
          console.warn('Aviso:', extracted.error);
          textoBase = selectedArticle.title || '';
          preview.innerHTML = '';
        } else {
          textoBase = extracted.content || selectedArticle.title || '';
          preview.innerHTML = '';
        }
      } catch (err) {
        console.error('Erro ao extrair:', err);
        textoBase = selectedArticle.title || '';
        preview.innerHTML = '';
      }
    }
    
    if (!textoBase) {
      textoBase = selectedArticle.title || '';
    }

    // Verifica preferência salva
    const pref = localStorage.getItem('preferredFormatter');
    if (pref === 'ai') {
      // usar IA automaticamente
      try {
        preview.innerHTML = ' Consultando IA...';
        const resposta = await window.electronAPI.askAI(textoBase);
        const parsed = parseAIResponse(resposta || '');
        document.getElementById('title').value = parsed.title || '';
        document.getElementById('module').value = parsed.module || '';
        document.getElementById('desc').value = parsed.description || '';
        document.getElementById('cause').value = parsed.cause || '';
        document.getElementById('solution').value = parsed.solution || '';
        document.getElementById('links').value = parsed.links || '';
        document.getElementById('tags').value = parsed.tags || '';
        editorCard.style.display = 'block';
        previewCard.classList.remove('hidden');
        setFormatIndicator('ai');
        atualizarPreview();
      } catch (err) {
        alert('Erro ao consultar IA: ' + (err.message || err));
        preview.innerHTML = '';
      }
      return;
    }
    if (pref === 'local') {
      preencherCamposComTexto(textoBase);
      setFormatIndicator('local');
      editorCard.style.display = 'block';
      previewCard.classList.remove('hidden');
      atualizarPreview();
      return;
    }

    // Sem preferência: mostrar modal para escolher
    const modal = document.getElementById('formatChoiceModal');
    const btnAI = document.getElementById('modalUseAI');
    const btnLocal = document.getElementById('modalUseLocal');
    const btnCancel = document.getElementById('modalCancel');
    const persistChk = document.getElementById('modalPersistChoice');

    function closeModal() {
      modal.classList.add('hidden');
      btnAI.onclick = null; btnLocal.onclick = null; btnCancel.onclick = null;
    }

    modal.classList.remove('hidden');

    btnAI.onclick = async () => {
      const persist = persistChk && persistChk.checked;
      if (persist) localStorage.setItem('preferredFormatter', 'ai');
      try {
        preview.innerHTML = ' Consultando IA...';
        const resposta = await window.electronAPI.askAI(textoBase);
        const parsed = parseAIResponse(resposta || '');
        document.getElementById('title').value = parsed.title || '';
        document.getElementById('module').value = parsed.module || '';
        document.getElementById('desc').value = parsed.description || '';
        document.getElementById('cause').value = parsed.cause || '';
        document.getElementById('solution').value = parsed.solution || '';
        document.getElementById('links').value = parsed.links || '';
        document.getElementById('tags').value = parsed.tags || '';
        editorCard.style.display = 'block';
        previewCard.classList.remove('hidden');
        setFormatIndicator('ai');
        atualizarPreview();
      } catch (err) {
        alert('Erro ao consultar IA: ' + (err.message || err));
        preview.innerHTML = '';
      }
      closeModal();
    };

    btnLocal.onclick = () => {
      const persist = persistChk && persistChk.checked;
      if (persist) localStorage.setItem('preferredFormatter', 'local');
      preencherCamposComTexto(textoBase);
      setFormatIndicator('local');
      closeModal();
    };

    btnCancel.onclick = () => { closeModal(); };
  });

  formatBtn.addEventListener('click', async () => {
    let textoBase = '';
    if (quill && typeof quill.getText === 'function') {
      textoBase = quill.getText().trim();
    } else if (quill && quill.root) {
      textoBase = (quill.root.innerText || quill.root.textContent || '').trim();
    }
    
    if (!textoBase) return alert('Digite algo no editor.');

    // Formata diretamente com as funções do formatter.js
    preencherCamposComTexto(textoBase);
  });

  clearBtn.addEventListener('click', () => {
    if (quill && typeof quill.setContents === 'function') {
      quill.setContents([]);
    } else if (quill && quill.root) {
      quill.root.innerHTML = '';
    }
  });

  renderBtn.addEventListener('click', atualizarPreview);

    const copyPreviewBtn = document.getElementById('copyPreview');
  const formatWithAIBtn = document.getElementById('formatWithAI');
  const copyJsonBtn = document.getElementById('copyJson');
  const downloadTxtBtn = document.getElementById('downloadTxt');
  const downloadMdBtn = document.getElementById('downloadMd');

    if (copyPreviewBtn) copyPreviewBtn.addEventListener('click', async () => {
      try {
        // Garante que o preview está atualizado com os campos atuais
        atualizarPreview();

        // Texto alvo: preferir innerText, fallback para textContent, e por fim remover tags do innerHTML
        let previewContent = (preview.innerText || preview.textContent || '').trim();
        if (!previewContent) {
          // Remover tags simples e converter quebras
          previewContent = preview.innerHTML.replace(/<\/?(div|h1|h2|h3|h4|p|li|ol|ul|a)[^>]*>/gi, '\n').replace(/<[^>]+>/g, '').trim();
        }

        if (!previewContent) return alert('Preview vazio. Gere o preview antes de copiar.');

        // Tenta usar a API moderna primeiro
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(previewContent);
          alert('Preview copiado para a área de transferência!');
          return;
        }

        // Fallback: textarea + execCommand
        const ta = document.createElement('textarea');
        ta.value = previewContent;
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (ok) alert('Preview copiado para a área de transferência!');
        else alert('Não foi possível copiar o preview automaticamente. Selecionar e copiar manualmente.');
      } catch (err) {
        console.error('Erro ao copiar preview:', err);
        alert('Erro ao copiar: ' + (err && err.message ? err.message : String(err)));
      }
    });
  if (copyJsonBtn) copyJsonBtn.addEventListener('click', () => alert('Em desenvolvimento'));
  if (downloadTxtBtn) downloadTxtBtn.addEventListener('click', () => alert('Em desenvolvimento'));
  if (downloadMdBtn) downloadMdBtn.addEventListener('click', () => alert('Em desenvolvimento'));

  // Botão: formatar com IA (chama main.ask-ai)
  if (formatWithAIBtn) formatWithAIBtn.addEventListener('click', async () => {
    let textoBase = '';
    // Preferir conteúdo do editor; se estiver vazio, usar campos do formulário
    if (quill && typeof quill.getText === 'function') {
      textoBase = quill.getText().trim();
    } else if (quill && quill.root) {
      textoBase = (quill.root.innerText || quill.root.textContent || '').trim();
    }
    if (!textoBase) {
      // montar texto a partir dos campos do formulário como fallback
      textoBase = [document.getElementById('title').value, document.getElementById('desc').value, document.getElementById('solution').value].filter(Boolean).join('\n');
    }
    if (!textoBase) return alert('Digite ou selecione um texto para enviar à IA.');

    preview.innerHTML = ' Consultando IA...';
    try {
      const resposta = await window.electronAPI.askAI(textoBase);
      console.log('🔹 Resposta bruta da IA:', resposta);
      // parsear resposta estruturada da IA
      const parsed = parseAIResponse(resposta || '');
      console.log('✅ Parsed response:', parsed);
      // Preencher campos com o que foi parseado
      document.getElementById('title').value = parsed.title || '';
      document.getElementById('module').value = parsed.module || '';
      document.getElementById('desc').value = parsed.description || '';
      document.getElementById('cause').value = parsed.cause || '';
      document.getElementById('solution').value = parsed.solution || '';
      document.getElementById('links').value = parsed.links || '';
      document.getElementById('tags').value = parsed.tags || '';
      editorCard.style.display = 'block';
      previewCard.classList.remove('hidden');
  setFormatIndicator('ai');
      atualizarPreview();
    } catch (err) {
      console.error('❌ Erro ao chamar IA ou parsear resposta:', err);
      alert('Erro ao consultar IA: ' + (err.message || err));
      preview.innerHTML = '';
    }
  });

  // Botão de mock: injeta um JSON de exemplo sem chamar a API (útil para testes)
  const mockAIBtn = document.getElementById('mockAI');
  if (mockAIBtn) mockAIBtn.addEventListener('click', () => {
    const example = {
      title: 'Linx Microvix - Faturamento - Como realizar faturamento',
      module: 'Faturamento',
      description: 'Para realizar faturamento, realize os passos a seguir:',
      cause: 'Erro de configuração no cadastro do cliente',
      solution: [
        'Acesse o menu Faturamento e clique em Novo',
        'Preencha os dados do cliente',
        'Valide os itens e clique em Salvar'
      ],
      links: ['https://ajuda.linx.com.br/faturamento'],
      tags: ['faturamento','cliente','cadastro']
    };

    const jsonText = JSON.stringify(example, null, 2);
    console.log('Mock IA JSON:', jsonText);
    // usar o mesmo pipeline que a resposta real recebida da IA
    const parsed = parseAIResponse(jsonText);
    document.getElementById('title').value = parsed.title || '';
    document.getElementById('module').value = parsed.module || '';
    document.getElementById('desc').value = parsed.description || '';
    document.getElementById('cause').value = parsed.cause || '';
    document.getElementById('solution').value = parsed.solution || '';
    document.getElementById('links').value = parsed.links || '';
    document.getElementById('tags').value = parsed.tags || '';
    editorCard.style.display = 'block';
    previewCard.classList.remove('hidden');
    setFormatIndicator('ai', 'IA (mock)');
    atualizarPreview();
    alert('Mock IA aplicado — veja o preview.');
  });

  console.log('Listeners inicializados');
});

function atualizarPreview() {
  const title = document.getElementById('title').value;
  const desc = document.getElementById('desc').value;
  const cause = document.getElementById('cause').value;
  const sol = document.getElementById('solution').value;
  const links = document.getElementById('links').value;
  const tags = document.getElementById('tags').value;

  let html = `<div style="font-family: 'Segoe UI', sans-serif; font-size: 13px;">`;
  html += `<h1 style="font-size: 20px; margin-bottom: 10px;">${title}</h1>`;
  if (desc) html += `<h3 style="font-size: 14px;">Descrição</h3><p style="line-height: 1.5;">${desc}</p>`;
  if (cause) html += `<h3 style="font-size: 14px;">Causa</h3><p style="line-height: 1.5;">${cause}</p>`;
  if (sol) {
    html += '<h3 style="font-size: 14px;">Solução</h3><ol style="line-height: 1.8;">';
    sol.split('\n').forEach(l => {
      const step = l.trim();
      if (step) html += `<li>${step.replace(/^\d+\.\s*/, '')}</li>`;
    });
    html += '</ol>';
  }
  if (links) {
    html += '<h4 style="font-size: 13px;">Links relacionados</h4>';
    links.split('\n').forEach(l => (html += `<a href="${l}" target="_blank" style="display: block; margin: 5px 0; color: #0ea5a0;">${l}</a>`));
  }
  if (tags) html += `<div style="margin-top: 15px;"><strong>Tags:</strong> ${tags}</div>`;
  html += `</div>`;

  preview.innerHTML = html;
}

// Parseia a resposta textual da IA (com etiquetas) em um objeto estruturado
function parseAIResponse(text) {
  // Primeiro, tente extrair um JSON embutido (caso a IA inclua texto extra) e parseá-lo.
  function extractFirstJson(s) {
    if (!s) return null;
    const firstBrace = s.indexOf('{');
    if (firstBrace === -1) return null;
    let depth = 0;
    for (let i = firstBrace; i < s.length; i++) {
      const ch = s[i];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      if (depth === 0) {
        const candidate = s.slice(firstBrace, i + 1);
        return candidate;
      }
    }
    return null;
  }

  // Tentar extrair JSON primeiro
  try {
    const embedded = extractFirstJson(text);
    const toParse = embedded || text;
    const obj = JSON.parse(toParse);
    const safe = {
      title: obj.title || '',
      module: obj.module || '',
      description: obj.description || '',
      cause: obj.cause || ''
    };

    // solution: aceitar array ou string
    if (Array.isArray(obj.solution)) {
      safe.solution = obj.solution.join('\n');
    } else if (typeof obj.solution === 'string') {
      safe.solution = obj.solution;
    } else {
      safe.solution = '';
    }

    // links: array -> string lines
    if (Array.isArray(obj.links)) safe.links = obj.links.join('\n');
    else if (typeof obj.links === 'string') safe.links = obj.links;
    else safe.links = '';

    // tags: array -> '; '-separated string
    if (Array.isArray(obj.tags)) safe.tags = obj.tags.slice(0,6).join('; ');
    else if (typeof obj.tags === 'string') safe.tags = obj.tags;
    else safe.tags = '';

    return safe;
  } catch (err) {
    // continua para o parser legacy abaixo
  }

  const data = {
    title: '',
    module: '',
    description: '',
    cause: '',
    solution: '',
    links: '',
    tags: ''
  };

  if (!text) return data;

  const lines = text.split(/\r?\n/);
  let cur = null;
  const solLines = [];
  const linkLines = [];

  for (let raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const mTitle = line.match(/^Título:\s*(.*)/i);
    const mModule = line.match(/^Módulo:\s*(.*)/i);
    const mDesc = line.match(/^Descrição:\s*(.*)/i);
    const mCause = line.match(/^Causa:\s*(.*)/i);
    const mSol = line.match(/^Solução:\s*$/i);
    const mLinks = line.match(/^Links relacionados:\s*$/i);
    const mTags = line.match(/^Tags:\s*(.*)/i);

    if (mTitle) { data.title = mTitle[1].trim(); cur = null; continue; }
    if (mModule) { data.module = mModule[1].trim(); cur = null; continue; }
    if (mDesc) { data.description = mDesc[1].trim(); cur = null; continue; }
    if (mCause) { data.cause = mCause[1].trim(); cur = null; continue; }
    if (mSol) { cur = 'solution'; continue; }
    if (mLinks) { cur = 'links'; continue; }
    if (mTags) { data.tags = mTags[1].trim(); cur = null; continue; }

    // Conteúdo dependendo do bloco atual
    if (cur === 'solution') {
      solLines.push(line);
    } else if (cur === 'links') {
      linkLines.push(line);
    } else {
      // Caso não esteja em um bloco, tente inferir
      // Se conter 'http' trate como link
      if (/https?:\/\//i.test(line)) linkLines.push(line);
      else if (/^\d+\./.test(line)) solLines.push(line);
      else if (!data.description) data.description = (data.description ? data.description + ' ' : '') + line;
    }
  }

  if (solLines.length) data.solution = solLines.join('\n');
  if (linkLines.length) data.links = linkLines.join('\n');

  data.tags = data.tags;

  return data;
}

function preencherCamposComTexto(texto) {
  // Usa as funções do formatter.js para extrair informações
  const moduleName = detectModule(texto);
  const questionPhrase = extractQuestionPhrase(texto);
  const title = buildTitle(moduleName, questionPhrase);
  const description = buildDescription(questionPhrase, moduleName);
  const tags = generateTags(texto);
  const normalizedSteps = normalizeStepsText(texto);

  console.log('🔍 Debug Formatação:');
  console.log('  Texto:', texto.substring(0, 50) + '...');
  console.log('  Módulo:', moduleName);
  console.log('  Pergunta:', questionPhrase);
  console.log('  Título:', title);
  console.log('  Descrição:', description);
  console.log('  Tags:', tags);
  console.log('  Passos:', normalizedSteps.substring(0, 50) + '...');

  // Preenche os campos do formulário
  document.getElementById('title').value = title || 'Título sugerido';
  document.getElementById('module').value = moduleName || '';
  document.getElementById('desc').value = description || 'Descrição automática';
  document.getElementById('solution').value = normalizedSteps || '1. Passo 1';
  document.getElementById('cause').value = '';
  document.getElementById('links').value = '';
  document.getElementById('tags').value = tags;

  // Mostra o editor do artigo e o preview
  editorCard.style.display = 'block';
  previewCard.classList.remove('hidden');
  setFormatIndicator('local');
  atualizarPreview();
}

// Define badge indicador do método de formatação
function setFormatIndicator(method, label) {
  const badge = document.getElementById('formatMethodBadge');
  if (!badge) return;
  badge.classList.remove('hidden', 'ai', 'local');
  if (method === 'ai') {
    badge.classList.add('ai');
    badge.textContent = label || 'Método: IA';
  } else if (method === 'local') {
    badge.classList.add('local');
    badge.textContent = label || 'Método: Local';
  } else {
    badge.textContent = label || `Método: ${method}`;
  }
}