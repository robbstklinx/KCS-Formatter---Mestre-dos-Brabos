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

// Carrega variáveis do .env (localizado em src/)
dotenv.config({ path: path.join(__dirname, '.env') });

// Remove espaços em branco das variáveis de ambiente
const OPENAI_API_KEY = (process.env.OPENAI_API_KEY || '').trim();
const SHARE_API_KEY = (process.env.SHARE_API_KEY || '').trim();
const SHARE_API_URL = (process.env.SHARE_API_URL || '').trim();

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

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
  
  const childWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, 'public', 'mestredosbrabosicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // ⚠️ DESATIVADO PARA DEBUG - REATIVAR EM PRODUÇÃO
      // Habilita recursos de navegador
      enableRemoteModule: false,
      preload: undefined, // Não precisa de preload para janelas child
      webSecurity: true
    },
    show: false // Mostrar depois que carregar
  });

  // MUITO DEBUG: Log de console da child window
  childWindow.webContents.on('console-message', (level, message, line, sourceId) => {
    console.log(`  📱 Child Window Console [${level}]: ${message} (${sourceId}:${line})`);
  });

  // Debug: Monitor de estado da janela
  childWindow.webContents.on('did-start-loading', () => {
    console.log('⏳ Child window: Iniciando carregamento da URL...');
  });

  childWindow.webContents.on('did-finish-load', () => {
    console.log('✅ Child window: Carregamento HTML concluído!');
    childWindow.show(); // Mostra assim que carregar
  });

  childWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    console.error('❌ Child window: Falha ao carregar');
    console.error('   Erro:', errorDescription, `(código ${errorCode})`);
    console.error('   URL:', validatedURL);
    console.error('   Main frame:', isMainFrame);
    // Mesmo com erro, tenta mostrar para o usuário ver a mensagem de erro
    if (!childWindow.isDestroyed() && !childWindow.isVisible()) {
      childWindow.show();
    }
  });

  childWindow.webContents.on('crashed', () => {
    console.error('❌ Child window: Renderizador travou!');
  });

  // Monitora navegação
  childWindow.webContents.on('will-navigate', (event, url) => {
    console.log('🔄 Child window: Navegando para:', url);
  });

  childWindow.webContents.on('did-navigate', (event, url) => {
    console.log('✅ Child window: Navegou para:', url);
  });

  // Carrega a URL do artigo
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

  // Context menu completo (copy, paste, cut, find, inspect, reload, etc)
  childWindow.webContents.on('context-menu', (e) => {
    const template = [
      { label: 'Copiar', role: 'copy' },
      { label: 'Colar', role: 'paste' },
      { label: 'Recortar', role: 'cut' },
      { type: 'separator' },
      { label: 'Selecionar Tudo', role: 'selectAll' },
      { label: 'Localizar na página', role: 'find' },
      { type: 'separator' },
      { label: 'Recarregar', role: 'reload' },
      { label: 'Recarregar (cache completo)', role: 'forceReload' },
      { type: 'separator' },
      { label: 'Inspecionar', role: 'inspect' }
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup(childWindow);
  });

  // 🔧 DEBUG: Abre DevTools automaticamente para ver erros (REMOVER EM PRODUÇÃO)
  setTimeout(() => {
    if (!childWindow.isDestroyed()) {
      console.log('🔧 Abrindo DevTools da child window para debug...');
      childWindow.webContents.openDevTools();
    }
  }, 500);

  // Permite abrir links em navegador padrão (segurança)
  childWindow.webContents.setWindowOpenHandler(({ url: newUrl }) => {
    if (newUrl.startsWith('http://') || newUrl.startsWith('https://')) {
      // Abre em navegador padrão ao invés de nova janela
      require('electron').shell.openExternal(newUrl);
    }
    return { action: 'deny' };
  });

  // Handle de zoom (Ctrl + / Ctrl - / Ctrl 0)
  childWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control || input.meta) {
      if (input.key.toLowerCase() === '+' || input.key === '=') {
        event.preventDefault();
        childWindow.webContents.zoomLevel += 0.5;
      } else if (input.key === '-') {
        event.preventDefault();
        childWindow.webContents.zoomLevel -= 0.5;
      } else if (input.key === '0') {
        event.preventDefault();
        childWindow.webContents.zoomLevel = 0;
      }
    }
  });

  // Desabilita navegação fora do domínio (segurança)
  childWindow.webContents.on('will-navigate', (event, url) => {
    const parsedUrl = new URL(url);
    const originalUrl = new URL(childWindow.webContents.getURL());
    
    // Permite navegação dentro do mesmo domínio
    if (parsedUrl.hostname !== originalUrl.hostname) {
      event.preventDefault();
    }
  });

  // Log de abertura
  console.log(`🌐 Janela child aberta: "${title}"`);
  console.log(`📍 URL: ${url}`);

  return childWindow;
}

// Inicializa o app
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Fecha tudo ao sair
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

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
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      throw new Error('URL vazia após limpeza');
    }
    
    console.log('✅ URL limpa:', cleanUrl);
    
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

// 🔹 IA — Formatação de texto KCS
ipcMain.handle('ask-ai', async (event, prompt) => {
  try {
    if (!OPENAI_API_KEY) {
      const msg = '❌ Chave OpenAI ausente (OPENAI_API_KEY não está definida em .env).';
      console.error(msg);
      return msg;
    }
    console.log('📤 Enviando prompt para IA (primeiros 100 caracteres):', prompt.substring(0, 100) + '...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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

Regras:
- Título: "Linx Microvix - [Módulo] - Como [ação]" (sem pontuação final).
- Module: identificar quando possível (Faturamento, Estoque, Fiscal, Empresa, Suprimentos, Segurança, Postos, Farma, Automotivo).
- Description: frase introdutória começando com "Para ...".
- Solution: array de passos; subpassos como elementos que iniciem com "1.1" etc.
- Links: array de URLs.
- Tags: array de até 6 strings.

Se alguma informação não puder ser determinada, retorne campo vazio ("" ou []). Sempre retorne JSON válido e em português.`
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.15
    });
    const resposta = completion.choices[0]?.message?.content || 'Sem resposta.';
    console.log('📥 Resposta recebida da IA (primeiros 150 chars):', resposta.substring(0, 150) + '...');
    console.log('📋 Resposta completa:', resposta);
    
    return resposta;
  } catch (err) {
    const msg = `❌ Erro ao consultar IA: ${err.message || err}`;
    console.error(msg);
    return msg;
  }
});

// DEBUG: Log para verificar se as chaves foram carregadas
console.log('OpenAI API Key carregada:', OPENAI_API_KEY ? '✓ Sim' : '✗ Não');
console.log('Share API URL carregada:', SHARE_API_URL ? '✓ Sim' : '✗ Não');
console.log('Share API Key carregada:', SHARE_API_KEY ? '✓ Sim' : '✗ Não');

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
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Estratégia de extração: tenta vários seletores comuns
    let content = '';
    let extractedFrom = 'desconhecido';
    
    // Tenta principais seletores de artigo (ordem de prioridade)
    const selectors = [
      { selector: '.confluence-content-wrapper', name: 'Confluence (Share Linx)' },
      { selector: '.wiki-content', name: 'Wiki Content (Confluence)' },
      { selector: '[role="main"]', name: 'Main Role' },
      { selector: 'article', name: 'Article Tag' },
      { selector: '.content', name: 'Content Class' },
      { selector: '.article-body', name: 'Article Body' },
      { selector: '.post-content', name: 'Post Content' },
      { selector: '#content', name: 'Content ID' },
      { selector: '.page-content', name: 'Page Content' },
      { selector: 'main', name: 'Main Tag' }
    ];

    for (const {selector, name} of selectors) {
      const el = $(selector).first();
      if (el.length > 0) {
        content = el.text();
        extractedFrom = name;
        console.log(`  ✓ Encontrado em: ${name}`);
        if (content.length > 150) {
          console.log(`  ✓ Conteúdo extraído: ${content.length} caracteres`);
          break;
        }
      }
    }

    // Se ainda não achou, tenta pegar todo o texto do body
    if (content.length < 100) {
      console.log('  ⚠️ Conteúdo insuficiente, tentando body inteiro...');
      content = $('body').text();
      extractedFrom = 'Body (fallback)';
    }

    // Limpa espaços em branco mas preserva parágrafos
    const lines = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 100);  // Pega até 100 linhas
    
    content = lines.join('\n').trim().substring(0, 4000);   // Limita a 4000 caracteres

    console.log(`  📊 Extraído de: ${extractedFrom}`);
    console.log(`  📊 Tamanho final: ${content.length} caracteres, ${lines.length} linhas`);

    if (content.length < 50) {
      throw new Error('Não foi possível extrair conteúdo significativo da página');
    }

    console.log('✅ Conteúdo extraído:', content.substring(0, 100) + '...');
    return { content, error: null };

  } catch (err) {
    const errorMsg = `❌ Erro ao extrair conteúdo: ${err.message || err}`;
    console.error(errorMsg);
    return { content: null, error: errorMsg };
  }
});
