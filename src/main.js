// ===== main.js =====
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const axios = require('axios');
const cheerio = require('cheerio');

// Importa módulos KCS
const { validateKCS, fixKCSJson, formatKCSForDisplay } = require('./kcs-validator');
const { detectarModulo, gerarTags, extrairUrls, medirQualidadeConteudo } = require('./kcs-helpers');

// Carrega variáveis do .env (localizado em src/)
dotenv.config({ path: path.join(__dirname, '.env') });

// Remove espaços em branco das variáveis de ambiente
const OPENAI_API_KEY = (process.env.OPENAI_API_KEY || '').trim();
const COPILOT_API_KEY = (process.env.COPILOT_API_KEY || '').trim();
const COPILOT_ENDPOINT = (process.env.COPILOT_ENDPOINT || 'https://api.openai.com/v1').trim();
const OLLAMA_ENDPOINT = (process.env.OLLAMA_ENDPOINT || 'http://localhost:11434/v1').trim();
const OLLAMA_MODEL = (process.env.OLLAMA_MODEL || 'llama3.1').trim();
const SHARE_API_KEY = (process.env.SHARE_API_KEY || '').trim();
const SHARE_API_URL = (process.env.SHARE_API_URL || '').trim();

let openai = null;
let aiProvider = 'none';

// Fallback em cascata: OpenAI → Copilot → Ollama
if (OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  aiProvider = 'openai';
} else if (COPILOT_API_KEY) {
  openai = new OpenAI({ apiKey: COPILOT_API_KEY, baseURL: COPILOT_ENDPOINT });
  aiProvider = 'copilot';
} else {
  // Fallback: Usar Ollama local (sem chave necessária)
  try {
    openai = new OpenAI({ 
      apiKey: 'not-needed-for-ollama',
      baseURL: OLLAMA_ENDPOINT 
    });
    aiProvider = 'ollama';
  } catch (err) {
    console.warn('⚠️ Erro ao inicializar Ollama:', err.message);
  }
}

// =============================
// === Criação da Janela ===
// =============================
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'public', 'mestredosbrabosicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  // Carrega o index.html diretamente da pasta `src/public` para preservar caminhos relativos

  const originalPath = path.join(__dirname, 'public', 'index.html');
  try {
    mainWindow.loadFile(originalPath);
  } catch (err) {
    console.error('Erro ao carregar index.html:', err);
  }

  // Remove o menu padrão (Arquivo, Editar, etc)
  mainWindow.removeMenu();

  // Habilita context menu (clique direito) com copy/paste/inspect
  mainWindow.webContents.on('context-menu', (e) => {
    const template = [
      { label: 'Copiar', role: 'copy' },
      { label: 'Colar', role: 'paste' },
      { label: 'Recortar', role: 'cut' },
      { type: 'separator' },
      { label: 'Inspecionar', role: 'inspect' }
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup(mainWindow);
  });

  // Abre o DevTools automaticamente pra debug (DESATIVADO PARA PRODUÇÃO)
  // mainWindow.webContents.openDevTools();
}

// =============================
// === Criar Janelas Child (Visualizador de Artigos) ===
// =============================
function createArticleWindow(url, title = 'Visualizador de Artigo') {
  console.log('🆕 Criando janela child. URL:', url, 'Title:', title);

  // Valida a URL antes de carregar
  if (!url || !url.startsWith('http')) {
    console.error('❌ URL inválida fornecida:', url);
    return;
  }

  const childWindow = new BrowserWindow({
    width: 1200,
    height: 850,
    icon: path.join(__dirname, 'public', 'mestredosbrabosicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      enableRemoteModule: false,
      preload: undefined,
      webSecurity: false,
      allowRunningInsecureContent: true,
      enableBlinkFeatures: 'ResizeObserver'
    },
    show: false
  });

  // Monitora todas as falhas de carregamento
  childWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    console.error('❌ Child window: Falha ao carregar');
    console.error('   Erro:', errorDescription, `(código ${errorCode})`);
    console.error('   URL:', validatedURL);
    console.error('   Main frame:', isMainFrame);

    if (!childWindow.isDestroyed()) {
      childWindow.loadURL(`data:text/html,<h1>Erro ao carregar conteúdo</h1><p>${errorDescription}</p>`);
      childWindow.show();
    }
  });

  // Log de console da página carregada
  childWindow.webContents.on('console-message', (level, message, line, sourceId) => {
    console.log(`  📱 Child Console [${level}]: ${message} (${sourceId}:${line})`);
  });

  // Monitora se o conteúdo foi renderizado
  childWindow.webContents.on('dom-ready', () => {
    console.log('✅ Child window: DOM pronto!');
    
    // Remove ou relaxa o CSP que pode estar bloqueando o conteúdo
    childWindow.webContents.executeJavaScript(`
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (cspMeta) {
        console.log('🔓 Removendo CSP restritivo...');
        cspMeta.remove();
      }
      
      const bodyContent = document.body.innerHTML;
      console.log('📄 Body innerHTML length:', bodyContent.length);
      console.log('📄 Body text length:', document.body.textContent.length);
    `).catch(err => console.error('Erro ao executar JS:', err));
  });

  childWindow.webContents.on('did-finish-load', () => {
    console.log('✅ Child window: Carregamento HTML concluído!');
    
    // Adiciona barra de URL no topo da página
    childWindow.webContents.executeJavaScript(`
      if (!document.getElementById('__kcs-url-bar')) {
        const urlBar = document.createElement('div');
        urlBar.id = '__kcs-url-bar';
        urlBar.style.cssText = \`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: #f0f0f0;
          border-bottom: 1px solid #ccc;
          display: flex;
          align-items: center;
          padding: 0 10px;
          z-index: 999998;
          font-family: Arial, sans-serif;
          font-size: 12px;
          color: #333;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        \`;
        
        urlBar.innerHTML = \`
          <strong style="margin-right: 10px;">URL:</strong>
          <input id="__kcs-url-input" type="text" readonly 
            value="\${window.location.href}"
            style="flex: 1; padding: 5px 8px; border: 1px solid #999; 
            border-radius: 3px; font-size: 11px; font-family: monospace;
            background: white; color: #333;">
          <button id="__kcs-copy-url" style="margin-left: 10px; padding: 5px 10px; 
            background: #007bff; color: white; border: none; border-radius: 3px; 
            cursor: pointer; font-size: 12px;">Copiar</button>
        \`;
        
        document.body.insertBefore(urlBar, document.body.firstChild);
        
        // Ajusta o margin do body para não sobrepor a barra
        if (document.body.style.marginTop === '') {
          document.body.style.marginTop = '40px';
        }
        
        // Funcionalidade de copiar URL
        document.getElementById('__kcs-copy-url').addEventListener('click', () => {
          const input = document.getElementById('__kcs-url-input');
          input.select();
          document.execCommand('copy');
          alert('URL copiada!');
        });
      }
      
      const htmlSize = document.documentElement.innerHTML.length;
      const hasContent = document.body.children.length > 0;
      console.log('📊 HTML size:', htmlSize, 'bytes');
      console.log('📊 Has child elements:', hasContent);
      console.log('📊 Body element found:', !!document.body);
    `).catch(err => console.error('Erro ao verificar conteúdo:', err));

    // Injetar script do KcsFinder
    const finderScript = require('fs').readFileSync(path.join(__dirname, 'kcs-finder.js'), 'utf8');
    childWindow.webContents.executeJavaScript(finderScript);

    childWindow.show();
  });

  // Monitora erro de renderização
  childWindow.webContents.on('crashed', () => {
    console.error('❌ Child window: Renderizador travou!');
  });

  // Monitora erros de rede
  childWindow.webContents.session.webRequest.onErrorOccurred({urls: ['<all_urls>']}, (details) => {
    console.warn('⚠️ Erro de rede:', {
      url: details.url,
      error: details.error
    });
  });

  // Intercepta headers para remover CSP restritivo
  childWindow.webContents.session.webRequest.onHeadersReceived({urls: ['<all_urls>']}, (details, callback) => {
    const responseHeaders = {...details.responseHeaders};
    
    // Remove ou relaxa o Content-Security-Policy
    if (responseHeaders['content-security-policy']) {
      console.log('🔓 CSP detectado no header, removendo...');
      delete responseHeaders['content-security-policy'];
    }
    if (responseHeaders['content-security-policy-report-only']) {
      console.log('🔓 CSP report-only detectado, removendo...');
      delete responseHeaders['content-security-policy-report-only'];
    }
    
    callback({responseHeaders});
  });

  console.log('📡 Carregando URL:', url);
  childWindow.loadURL(url).catch(err => {
    console.error('❌ Erro crítico ao carregar URL:', err.message);
    console.error('   Stack:', err.stack);
  });

  // Timeout para forçar exibição se did-finish-load não dispara
  const showTimeout = setTimeout(() => {
    if (!childWindow.isDestroyed() && !childWindow.isVisible()) {
      console.warn('⚠️ TIMEOUT (5s): Forçando exibição da janela child mesmo sem carregar...');
      childWindow.show();
    }
  }, 5000);

  childWindow.on('show', () => clearTimeout(showTimeout));
  childWindow.on('close', () => clearTimeout(showTimeout));

  // Registra atalhos de teclado globais
  childWindow.webContents.on('before-input-event', (event, input) => {
    // Ctrl+F: Localizar com KcsFinder
    if (input.control && input.key.toLowerCase() === 'f') {
      event.preventDefault();
      childWindow.webContents.executeJavaScript(`
        if (window.__KcsFinder) {
          window.__KcsFinder.toggle();
        }
      `);
      return;
    }
    
    // Ctrl+C: Copiar
    if (input.control && input.key.toLowerCase() === 'c') {
      childWindow.webContents.copy();
      return;
    }
    
    // Ctrl+X: Recortar
    if (input.control && input.key.toLowerCase() === 'x') {
      childWindow.webContents.cut();
      return;
    }
    
    // Ctrl+V: Colar
    if (input.control && input.key.toLowerCase() === 'v') {
      childWindow.webContents.paste();
      return;
    }
    
    // Ctrl+A: Selecionar tudo
    if (input.control && input.key.toLowerCase() === 'a') {
      childWindow.webContents.selectAll();
      return;
    }
    
    // Ctrl+R: Recarregar
    if (input.control && input.key.toLowerCase() === 'r' && !input.shift) {
      childWindow.reload();
      return;
    }
    
    // Ctrl+Shift+R: Recarregar forçado
    if (input.control && input.shift && input.key.toLowerCase() === 'r') {
      childWindow.webContents.reloadIgnoringCache();
      return;
    }
    
    // Alt+Left: Voltar
    if (input.alt && input.key === 'ArrowLeft') {
      if (childWindow.webContents.canGoBack()) {
        childWindow.webContents.goBack();
      }
      return;
    }
    
    // Alt+Right: Avançar
    if (input.alt && input.key === 'ArrowRight') {
      if (childWindow.webContents.canGoForward()) {
        childWindow.webContents.goForward();
      }
      return;
    }
    
    // F12: DevTools
    if (input.key === 'F12') {
      childWindow.webContents.toggleDevTools();
      return;
    }
  });

  // Context menu completo com opções úteis
  childWindow.webContents.on('context-menu', (e) => {
    const template = [
      { label: 'Voltar', role: 'back', accelerator: 'Alt+Left' },
      { label: 'Avançar', role: 'forward', accelerator: 'Alt+Right' },
      { label: 'Recarregar', role: 'reload', accelerator: 'Ctrl+R' },
      { type: 'separator' },
      { label: 'Copiar', role: 'copy', accelerator: 'Ctrl+C' },
      { label: 'Colar', role: 'paste', accelerator: 'Ctrl+V' },
      { label: 'Recortar', role: 'cut', accelerator: 'Ctrl+X' },
      { type: 'separator' },
      { label: 'Selecionar Tudo', role: 'selectAll', accelerator: 'Ctrl+A' },
      { label: 'Localizar na página', role: 'find', accelerator: 'Ctrl+F' },
      { type: 'separator' },
      { label: 'Inspecionar elemento', role: 'inspect' }
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup(childWindow);
  });

  // Menu superior com navegação e ações
  const template = [
    {
      label: 'Editar',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'Exibir',
      submenu: [
        { role: 'reload', accelerator: 'Ctrl+R' },
        { role: 'forceReload', accelerator: 'Ctrl+Shift+R' },
        { role: 'toggleDevTools', accelerator: 'F12' }
      ]
    },
    {
      label: 'Navegação',
      submenu: [
        { role: 'back', accelerator: 'Alt+Left' },
        { role: 'forward', accelerator: 'Alt+Right' }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  childWindow.setMenu(menu);

  // 🔧 DEBUG: Abre DevTools automaticamente para ver erros e console
  setTimeout(() => {
    if (!childWindow.isDestroyed()) {
      console.log('🔧 Abrindo DevTools da child window para debug...');
      childWindow.webContents.openDevTools();
    }
  }, 1000);
}

// =============================
// === Comunicação via IPC ====
// =============================

// 🔹 Abrir artigo em janela child
ipcMain.handle('open-article-window', async (event, url, title) => {
  try {
    console.log('🔗 IPC: open-article-window recebido. URL:', url, 'Title:', title);
    
    if (!url) {
      throw new Error('URL não fornecida');
    }
    
    // Remove espaços em branco
    let cleanUrl = url.trim();
    if (!cleanUrl) {
      throw new Error('URL vazia após limpeza');
    }
    
    console.log('✅ URL limpa:', cleanUrl);
    
    // Se for URL de redirecionamento (ex: DuckDuckGo), extrai a URL real
    if (cleanUrl.includes('duckduckgo.com/l/') || cleanUrl.includes('uddg=')) {
      console.log('🔄 URL de redirecionamento detectada, decodificando...');
      try {
        const urlObj = new URL(cleanUrl);
        const uddg = urlObj.searchParams.get('uddg');
        if (uddg) {
          cleanUrl = decodeURIComponent(uddg);
          console.log('✅ URL decodificada:', cleanUrl);
        }
      } catch (e) {
        console.warn('⚠️ Falha ao decodificar URL:', e.message);
      }
    }
    
    // Valida URL
    try {
      const parsedUrl = new URL(cleanUrl);
      console.log('✅ URL válida. Protocol:', parsedUrl.protocol, 'Host:', parsedUrl.host);
    } catch (urlErr) {
      // Se não for URL válida, tenta adicionar protocolo
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        console.warn('⚠️ URL sem protocolo, adicionando https://');
        const urlComProtocolo = 'https://' + cleanUrl;
        new URL(urlComProtocolo); // Valida com protocolo
        const finalUrl = urlComProtocolo;
        console.log('✅ URL com protocolo:', finalUrl);
        createArticleWindow(finalUrl, title || 'Visualizador de Artigo');
        return { success: true, message: `Artigo "${title}" aberto em nova janela` };
      } else {
        throw new Error('URL inválida: ' + urlErr.message);
      }
    }
    
    // Cria e abre a janela
    createArticleWindow(cleanUrl, title || 'Visualizador de Artigo');
    
    return { success: true, message: `Artigo "${title}" aberto em nova janela` };
  } catch (err) {
    const errorMsg = `❌ Erro ao abrir janela: ${err.message || err}`;
    console.error(errorMsg);
    console.error('Stack:', err.stack);
    return { success: false, error: errorMsg };
  }
});

// =============================
// === Parser Inteligente de Conteúdo KCS ===
// =============================
function smartParseContent(content) {
  console.log('🔍 Analisando conteúdo com parser inteligente...');
  
  // Detecta tipo de estrutura
  const hasNumberedList = /^\d+[.).:\s]|^\d+\./m.test(content);
  const hasBulletList = /^[-*•]/m.test(content);
  const hasActionVerbs = /\b(acesse|clique|selecione|digite|pressione|confira|verifique|abra|navegue|informe|confirme|execute|realize|complete)\b/i.test(content);
  
  let structured = '';
  
  if (hasNumberedList) {
    // Conteúdo já tem estrutura numerada
    console.log('✓ Estrutura numerada detectada');
    structured = content;
  } else if (hasBulletList) {
    // Tem bullets, manter como está
    console.log('✓ Estrutura com bullets detectada');
    structured = content;
  } else if (hasActionVerbs) {
    // Conteúdo descritivo com ações - reorganizar
    console.log('✓ Conteúdo descritivo com ações detectado');
    
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    structured = sentences
      .map((sentence, idx) => {
        const trimmed = sentence.trim();
        if (trimmed.match(/\b(acesse|clique|selecione|digite|pressione|confira|verifique|abra|navegue|informe|confirme|execute|realize|complete)\b/i)) {
          return `${idx + 1}. ${trimmed}`;
        }
        return trimmed;
      })
      .filter(s => s.trim().length > 0)
      .join('\n');
  } else {
    // Conteúdo puro descritivo
    console.log('✓ Conteúdo descritivo puro detectado');
    
    // Quebra em parágrafos e adiciona numeração
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 20);
    structured = paragraphs
      .map((para, idx) => `${idx + 1}. ${para.trim()}`)
      .join('\n\n');
  }
  
  console.log('📋 Conteúdo estruturado (primeiros 300 chars):', structured.substring(0, 300) + '...');
  return structured;
}

// 🔹 IA — Formatação de texto KCS
ipcMain.handle('ask-ai', async (event, prompt) => {
  try {
    if (!openai && !OPENAI_API_KEY && !COPILOT_API_KEY) {
      const msg = '❌ Nenhuma chave de IA configurada (OPENAI_API_KEY ou COPILOT_API_KEY).';
      console.error(msg);
      return { success: false, error: msg };
    }
    
    // Se não tem openai inicializado, inicializar agora
    if (!openai) {
      if (COPILOT_API_KEY) {
        openai = new OpenAI({ apiKey: COPILOT_API_KEY, baseURL: COPILOT_ENDPOINT });
        console.log('🔄 Usando Copilot como provider de IA');
      } else if (OPENAI_API_KEY) {
        openai = new OpenAI({ apiKey: OPENAI_API_KEY });
        console.log('🔄 Usando OpenAI como provider de IA');
      }
    }
    
    console.log('📤 Enviando prompt para IA (primeiros 100 caracteres):', prompt.substring(0, 100) + '...');
    
    // Aplica parser inteligente ao conteúdo
    const structuredContent = smartParseContent(prompt);
    
    // Detecta módulo e gera informações adicionais
    const moduloDetectado = detectarModulo(structuredContent);
    const tagsAutomaticas = gerarTags(structuredContent);
    const urlsEncontradas = extrairUrls(structuredContent);
    const qualidade = medirQualidadeConteudo(structuredContent);

    console.log(`📊 Análise: Módulo=${moduloDetectado}, Qualidade=${qualidade.score}%, Tags=${tagsAutomaticas.length}, URLs=${urlsEncontradas.length}`);

    // Selecionar modelo baseado no provider
    const modelMap = {
      'openai': 'gpt-4o-mini',
      'copilot': 'gpt-4o-mini',
      'ollama': OLLAMA_MODEL
    };
    const selectedModel = modelMap[aiProvider] || 'gpt-4o-mini';
    
    console.log(`📋 Usando modelo: ${selectedModel} (provider: ${aiProvider})`);

    const completion = await openai.chat.completions.create({
      model: selectedModel,
      messages: [
        {
          role: 'system',
          content: `Você é um assistente técnico que formata artigos de suporte segundo a metodologia KCS usada pela Linx Microvix.

Saída requerida: RETORNE APENAS UM OBJETO JSON VÁLIDO. Não escreva texto adicional fora do JSON.

Estrutura do JSON (campos obrigatórios/formatos):
{
  "title": string,
  "module": string,
  "description": string,
  "cause": string,
  "solution": ["passo 1", "passo 1.1", "passo 2"],
  "links": ["https://..."],
  "tags": ["tag1", "tag2"]
}

Regras CRÍTICAS:
- Título: "Linx Microvix - [Módulo] - Como [ação]" (sem pontuação final).
- Module: identificar quando possível. Módulos sugeridos: ${moduloDetectado}.
- Description: frase introdutória começando com "Para ..." que resuma o artigo.
- Cause: explicação do problema ou contexto (se não houver, deixar vazio).
- Solution: array com TODOS os passos/instruções encontrados. Preserve numeros e subpassos (ex: "1", "1.1", "2"). ISSO É O MAIS IMPORTANTE.
- Links: extrair URLs do conteúdo original. URLs encontradas: ${urlsEncontradas.join(', ') || 'nenhuma'}.
- Tags: array de até 6 tags relevantes ao conteúdo. Sugestões: ${tagsAutomaticas.join(', ')}.

Se alguma informação não puder ser determinada, retorne campo vazio ("" ou []). Sempre retorne JSON válido e em português.`
        },
        { role: 'user', content: `Conteúdo estruturado do artigo:\n\n${structuredContent}` }
      ],
      temperature: 0.15
    });
    
    const resposta = completion.choices[0]?.message?.content || 'Sem resposta.';
    console.log('📥 Resposta recebida da IA (primeiros 150 chars):', resposta.substring(0, 150) + '...');
    
    // Parse do JSON retornado
    let kcsData = {};
    try {
      kcsData = JSON.parse(resposta);
    } catch (parseErr) {
      console.error('❌ Erro ao fazer parse do JSON:', parseErr.message);
      return {
        success: false,
        error: 'IA retornou JSON inválido',
        raw: resposta
      };
    }
    
    // Valida os dados KCS
    const validation = validateKCS(kcsData);
    
    console.log('✅ Validação KCS:', validation.valid ? 'APROVADO' : 'COM ERROS');
    if (validation.errors.length > 0) {
      console.log('❌ Erros:', validation.errors);
    }
    if (validation.warnings.length > 0) {
      console.log('⚠️ Avisos:', validation.warnings);
    }
    
    console.log('📋 Dados KCS finais:', JSON.stringify(validation.data, null, 2));
    
    return {
      success: validation.valid,
      data: validation.data,
      errors: validation.errors,
      warnings: validation.warnings,
      qualidade: qualidade,
      raw: resposta
    };
  } catch (err) {
    const msg = `❌ Erro ao consultar IA: ${err.message || err}`;
    console.error(msg);
    console.error('Stack:', err.stack);
    return { success: false, error: msg };
  }
});

// DEBUG: Log para verificar se as chaves foram carregadas
console.log('OpenAI API Key carregada:', OPENAI_API_KEY ? '✓ Sim' : '✗ Não');
console.log('Copilot API Key carregada:', COPILOT_API_KEY ? '✓ Sim' : '✗ Não');
console.log('Ollama Endpoint carregado:', OLLAMA_ENDPOINT ? '✓ Sim' : '✗ Não');
console.log('Ollama Model:', OLLAMA_MODEL);
console.log('Share API URL carregada:', SHARE_API_URL ? '✓ Sim' : '✗ Não');
console.log('Share API Key carregada:', SHARE_API_KEY ? '✓ Sim' : '✗ Não');

if (!OPENAI_API_KEY && !COPILOT_API_KEY && aiProvider === 'none') {
  console.warn('⚠️ ATENÇÃO: Nenhuma chave de IA configurada! Configure OPENAI_API_KEY, COPILOT_API_KEY ou OLLAMA_ENDPOINT em .env');
} else {
  console.log(`✓ Usando ${aiProvider.toUpperCase()} como provider de IA`);
}

// 🔹 Busca no Share Linx
ipcMain.handle('search-share', async (event, termoBusca) => {
  try {
    if (!SHARE_API_URL) {
      const msg = '❌ SHARE_API_URL não está configurada em .env';
      console.error(msg);
      return { error: msg };
    }
    if (!SHARE_API_KEY) {
      const msg = '❌ SHARE_API_KEY não está configurada em .env';
      console.error(msg);
      return { error: msg };
    }

    console.log(`📡 Buscando no Share Linx: "${termoBusca}"`);
    const url = `${SHARE_API_URL}?q=${encodeURIComponent(termoBusca)}`;
    console.log(`📍 URL de busca: ${url}`);
    
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${SHARE_API_KEY}`,
        Accept: 'application/json'
      }
    });

    if (!res.ok) {
      const msg = `❌ Erro HTTP ${res.status} ao buscar no Share Linx`;
      console.error(msg);
      return { error: msg };
    }
    
    const data = await res.json();
    console.log(`✅ Resultado do Share Linx: ${data.items?.length || 0} artigos encontrados`);
    
    // Debug: Verifica se as URLs estão sendo retornadas
    if (data.items && data.items.length > 0) {
      console.log('📋 Primeiros 3 itens retornados:');
      data.items.slice(0, 3).forEach((item, idx) => {
        console.log(`  [${idx}] Title: "${item.title}", URL: "${item.url || 'UNDEFINED'}", Module: "${item.module || 'N/A'}"`);
      });
    }
    
    return data;
  } catch (err) {
    const msg = `❌ Erro ao buscar no Share Linx: ${err.message || err}`;
    console.error(msg);
    console.error('Stack:', err.stack);
    return { error: msg };
  }
});

// 🔹 Busca no Share Linx (apenas na base de conhecimento)
// URL da base: https://share.linx.com.br/pages/viewpage.action?pageId=71895657
ipcMain.handle('search-google', async (event, termoBusca) => {
  try {
    console.log(`🔍 Buscando: "${termoBusca}"`);
    
    let items = [];
    
    // ========== ESTRATÉGIA 1: Share Linx Confluence ==========
    try {
      console.log('📍 Tentativa 1: Share Linx (Base de Conhecimento)...');
      
      // URL de busca do Confluence (Share Linx)
      // Busca dentro da página específica (pageId=71895657 é a KB)
      const shareUrl = `https://share.linx.com.br/rest/api/search?cql=text~"${encodeURIComponent(termoBusca)}" AND space=KB&expand=excerpt&limit=10`;
      
      console.log(`📍 URL:', ${shareUrl}`);
      
      const response = await axios.get(shareUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        timeout: 15000
      });
      
      const data = response.data;
      
      if (data.results && data.results.length > 0) {
        data.results.forEach((result) => {
          if (items.length >= 10) return;
          
          // Extrai informações do resultado
          const title = result.title || result.content?.title || 'Sem título';
          const url = `https://share.linx.com.br${result.url}` || '';
          const description = result.excerpt || result.content?.body?.storage?.value?.substring(0, 150) || 'Sem descrição';
          
          items.push({
            title: title,
            url: url,
            description: description.replace(/<[^>]*>/g, ''), // Remove tags HTML
            source: 'Share Linx KB'
          });
        });
      }
      
      if (items.length > 0) {
        console.log(`✅ Share Linx KB: Encontrados ${items.length} resultados`);
        console.log('📋 Primeiros 3 itens:');
        items.slice(0, 3).forEach((item, idx) => {
          console.log(`  [${idx}] Title: "${item.title}", URL: "${item.url}", Source: "${item.source}"`);
        });
        return { items: items };
      } else {
        console.log('⚠️ Share Linx retornou vazio, tentando alternativa...');
      }
    } catch (err) {
      console.log(`⚠️ Share Linx error: ${err.message}`);
    }
    
    // ========== ESTRATÉGIA 2: Google scoped ao Share Linx ==========
    try {
      console.log('📍 Tentativa 2: Google scoped ao Share Linx...');
      
      // Busca no Google mas limitado ao domínio share.linx.com.br
      const googleUrl = `https://www.google.com/search?q=site:share.linx.com.br ${encodeURIComponent(termoBusca)}`;
      
      const response = await axios.get(googleUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9',
          'Cache-Control': 'max-age=0'
        },
        timeout: 15000
      });
      
      const $ = cheerio.load(response.data);
      
      // Seletores do Google
      const selectors = ['div[data-sokoban-container]', 'div.Gx5Zad', 'div.g'];
      
      for (const selector of selectors) {
        $(selector).each((index, element) => {
          if (items.length >= 10) return;
          
          const titleElem = $(element).find('h3').first();
          const title = titleElem.text().trim();
          
          let url = $(element).find('a').attr('href');
          if (url && url.startsWith('/url?q=')) {
            const urlMatch = url.match(/\/url\?q=([^&]+)/);
            if (urlMatch) url = decodeURIComponent(urlMatch[1]);
          }
          
          // Garante que é do Share Linx
          if (title && url && url.includes('share.linx.com.br')) {
            const description = $(element).find('span').text().substring(0, 150);
            items.push({
              title: title,
              url: url,
              description: description,
              source: 'Share Linx (Google)'
            });
          }
        });
        
        if (items.length > 0) break;
      }
      
      if (items.length > 0) {
        console.log(`✅ Google Share Linx: Encontrados ${items.length} resultados`);
        console.log('📋 Primeiros 3 itens:');
        items.slice(0, 3).forEach((item, idx) => {
          console.log(`  [${idx}] Title: "${item.title}", URL: "${item.url}", Source: "${item.source}"`);
        });
        return { items: items };
      }
    } catch (err) {
      console.log(`⚠️ Google Share Linx error: ${err.message}`);
    }
    
    // ========== ESTRATÉGIA 3: DuckDuckGo scoped ==========
    try {
      console.log('📍 Tentativa 3: DuckDuckGo scoped ao Share Linx...');
      
      const ddgUrl = `https://duckduckgo.com/html/?q=site:share.linx.com.br ${encodeURIComponent(termoBusca)}`;
      
      const response = await axios.get(ddgUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });
      
      const $ = cheerio.load(response.data);
      
      $('div.result').each((index, element) => {
        if (items.length >= 10) return;
        
        const titleElem = $(element).find('a.result__a').first();
        const title = titleElem.text().trim();
        let url = titleElem.attr('href');
        
        if (title && url && url.includes('share.linx.com.br')) {
          const description = $(element).find('a.result__snippet').text().trim().substring(0, 150);
          items.push({
            title: title,
            url: url,
            description: description,
            source: 'Share Linx (DuckDuckGo)'
          });
        }
      });
      
      if (items.length > 0) {
        console.log(`✅ DuckDuckGo Share Linx: Encontrados ${items.length} resultados`);
        console.log('📋 Primeiros 3 itens:');
        items.slice(0, 3).forEach((item, idx) => {
          console.log(`  [${idx}] Title: "${item.title}", URL: "${item.url}", Source: "${item.source}"`);
        });
        return { items: items };
      }
    } catch (err) {
      console.log(`⚠️ DuckDuckGo Share Linx error: ${err.message}`);
    }
    
    // Se nenhuma fonte funcionou
    const msg = `⚠️ Não foi possível encontrar artigos no Share Linx com o termo "${termoBusca}".`;
    console.error(msg);
    return { 
      error: msg, 
      items: [],
      tips: [
        'Verifique se o termo está correto',
        'Tente um termo mais genérico',
        'Verifique sua conexão com a internet',
        'Você tem acesso à base de conhecimento do Share Linx?'
      ]
    };
    
  } catch (err) {
    const msg = `❌ Erro geral ao buscar: ${err.message || err}`;
    console.error(msg);
    return { error: msg, items: [] };
  }
});

// 🔹 Extrair conteúdo de um artigo a partir de sua URL
ipcMain.handle('extract-article-content', async (event, url) => {
  try {
    if (!url) throw new Error('URL não fornecida');
    console.log('📄 Extraindo conteúdo da URL:', url);

    // Timeout de 15 segundos para a requisição
    const response = await axios.get(url, { 
      timeout: 15000,
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cookie': 'CONF_SPACE_KEY=KB'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extrai o título da página
    let title = $('h1').first().text() || $('title').text() || 'Sem título';
    console.log(`📋 Título encontrado: "${title}"`);

    // Encontra o container principal do conteúdo
    let mainContent = null;
    const selectors = [
      '#main-content',
      '.confluence-content-wrapper',
      '.wiki-content',
      '[role="main"]',
      '.page-content',
      '#content'
    ];

    for (const selector of selectors) {
      const el = $(selector).first();
      if (el.length > 0) {
        mainContent = el;
        console.log(`  ✓ Container encontrado: ${selector}`);
        break;
      }
    }

    if (!mainContent) {
      mainContent = $('body');
      console.log(`  ✓ Usando body como fallback`);
    }

    // Remove elementos desnecessários
    mainContent.find('script, style, nav, header, footer, .breadcrumbs, .page-metadata, .recently-updated, .comments-section, .likes, .page-history').remove();

    // Estratégia: Extrair conteúdo preservando a hierarquia de tópicos (headers e seções)
    let content = '';
    let structuredContent = [];

    // Processa o conteúdo preservando headers e seções
    mainContent.find('h1, h2, h3, h4, h5, h6, p, li, td, div[class*="section"], div[class*="body"]').each((idx, elem) => {
      const $elem = $(elem);
      const text = $elem.text().trim();
      
      if (text && text.length > 0) {
        // Pula elementos muito pequenos ou genéricos
        if (text.match(/^(Home|Search|Log In|Sign Up|Settings|Help|Feedback|Comments|Like|Share|Save)$/i)) {
          return;
        }

        const tagName = elem.name.toLowerCase();
        
        // Adiciona indentação baseada no nível do header
        let prefix = '';
        if (tagName.match(/^h[1-6]$/)) {
          const level = parseInt(tagName[1]);
          prefix = '• '.repeat(level - 1);
          content += `\n${prefix}${text}\n`;
          structuredContent.push({ type: 'header', level, text });
        } else if (tagName === 'li') {
          prefix = '  • ';
          content += `${prefix}${text}\n`;
          structuredContent.push({ type: 'list', text });
        } else if (tagName === 'p' || tagName === 'td') {
          if (text.length > 20) {
            content += `${text}\n`;
            structuredContent.push({ type: 'paragraph', text });
          }
        }
      }
    });

    // Fallback: se extração estruturada retornou pouco, tenta extração simples
    if (content.length < 300) {
      console.log('  ⚠️ Conteúdo estruturado insuficiente, tentando extração simples...');
      content = mainContent.text();
    }

    // Limpa espaços em branco mas preserva parágrafos
    const lines = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 5) // Filtros apenas linhas com mais de 5 caracteres
      .slice(0, 200);  // Pega até 200 linhas
    
    content = lines.join('\n').trim().substring(0, 12000);   // Limita a 12000 caracteres

    console.log(`  📊 Tamanho final: ${content.length} caracteres, ${lines.length} linhas`);
    console.log(`  📊 Estrutura: ${structuredContent.length} elementos estruturados`);

    if (content.length < 100) {
      throw new Error(`Conteúdo insuficiente extraído (${content.length} chars). A página pode estar protegida ou vazia.`);
    }

    console.log('✅ Conteúdo extraído com sucesso!');
    console.log('📝 Primeiras 300 caracteres:', content.substring(0, 300) + '...');
    
    return { content, title, error: null };

  } catch (err) {
    const errorMsg = `❌ Erro ao extrair conteúdo: ${err.message || err}`;
    console.error(errorMsg);
    return { content: null, error: errorMsg };
  }
});

// Garante que a janela principal seja criada quando o app estiver pronto
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // No macOS, recria a janela se o ícone do dock for clicado e não houver janelas abertas
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Fecha o app quando todas as janelas forem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
