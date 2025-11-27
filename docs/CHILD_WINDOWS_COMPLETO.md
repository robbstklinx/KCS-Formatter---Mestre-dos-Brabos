# 🪟 Guia: Como Implementar Child Windows Completas com Funcionalidades

Este guia explica em detalhes como fazer janelas "child" (filhas) com todos os recursos: cópia, navegação, busca, menu de contexto, etc.

---

## 📋 Sumário de Funcionalidades

A child window implementada tem:

```
✅ Menu superior (Editar, Exibir, Navegação)
✅ Context menu (clique direito com opções)
✅ Atalhos de teclado (Ctrl+C, Ctrl+V, etc)
✅ Botões de navegação (voltar, avançar)
✅ Busca na página (Ctrl+F)
✅ Reload (Ctrl+R)
✅ DevTools (F12)
✅ Remover CSP restritivo
✅ Tratamento de erros
✅ Carregamento de URL externa
```

---

## 🔑 Conceitos Principais

### 1️⃣ **Criar a Janela Child**

```javascript
const childWindow = new BrowserWindow({
  width: 1200,
  height: 850,
  icon: path.join(__dirname, 'public', 'icon.ico'),
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: false,                    // ⚠️ Importante para remover CSP
    enableRemoteModule: false,
    preload: undefined,
    webSecurity: false,               // ⚠️ Importante para conteúdo externo
    allowRunningInsecureContent: true,
    enableBlinkFeatures: 'ResizeObserver'
  },
  show: false  // Não mostrar automaticamente
});
```

**O que cada linha faz**:
- `nodeIntegration: false` - Segurança: evita acesso a Node.js no contexto renderer
- `contextIsolation: true` - Segurança: isola contextos
- `sandbox: false` - Permite executar JavaScript para remover CSP
- `webSecurity: false` - Permite carregar conteúdo de outras origens
- `allowRunningInsecureContent: true` - Permite conteúdo HTTP em HTTPS
- `show: false` - Mostra apenas depois de carregar

---

### 2️⃣ **Monitorar Eventos de Carregamento**

```javascript
// Evento: DOM está pronto
childWindow.webContents.on('dom-ready', () => {
  console.log('✅ DOM pronto!');
  
  // Remover CSP que bloqueia funcionalidades
  childWindow.webContents.executeJavaScript(`
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (cspMeta) {
      cspMeta.remove();
      console.log('🔓 CSP removido');
    }
  `);
});

// Evento: Página carregada completamente
childWindow.webContents.on('did-finish-load', () => {
  console.log('✅ Página carregada!');
  childWindow.show();  // Mostrar agora
});

// Evento: Falha ao carregar
childWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
  console.error('❌ Erro:', errorDescription);
  childWindow.loadURL(`data:text/html,<h1>Erro: ${errorDescription}</h1>`);
  childWindow.show();
});
```

---

### 3️⃣ **Remover CSP Restritivo (CRUCIAL)**

Muitos sites têm Content-Security-Policy que bloqueiam funcionalidades. Remover:

```javascript
// Opção 1: Via JavaScript na página
childWindow.webContents.executeJavaScript(`
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspMeta) cspMeta.remove();
`);

// Opção 2: Via headers HTTP (mais eficaz)
childWindow.webContents.session.webRequest.onHeadersReceived({urls: ['<all_urls>']}, (details, callback) => {
  const responseHeaders = {...details.responseHeaders};
  
  // Remover CSP headers
  delete responseHeaders['content-security-policy'];
  delete responseHeaders['content-security-policy-report-only'];
  
  callback({responseHeaders});
});
```

---

### 4️⃣ **Atalhos de Teclado**

```javascript
childWindow.webContents.on('before-input-event', (event, input) => {
  // Ctrl+C: Copiar
  if (input.control && input.key.toLowerCase() === 'c') {
    childWindow.webContents.copy();
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
  
  // Ctrl+F: Localizar
  if (input.control && input.key.toLowerCase() === 'f') {
    event.preventDefault();
    childWindow.webContents.findInPage('');
    return;
  }
  
  // Ctrl+R: Recarregar
  if (input.control && input.key.toLowerCase() === 'r' && !input.shift) {
    childWindow.reload();
    return;
  }
  
  // Alt+Left: Voltar
  if (input.alt && input.key === 'ArrowLeft') {
    if (childWindow.webContents.canGoBack()) {
      childWindow.webContents.goBack();
    }
    return;
  }
  
  // F12: DevTools
  if (input.key === 'F12') {
    childWindow.webContents.toggleDevTools();
    return;
  }
});
```

---

### 5️⃣ **Menu de Contexto (Clique Direito)**

```javascript
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
    { label: 'Localizar', role: 'find', accelerator: 'Ctrl+F' },
    { type: 'separator' },
    { label: 'Inspecionar', role: 'inspect' }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  menu.popup(childWindow);
});
```

---

### 6️⃣ **Menu Superior**

```javascript
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
```

---

## 🛠️ Código Completo para Copiar

Crie uma função assim no seu `main.js`:

```javascript
// ===== FUNÇÃO PARA ABRIR CHILD WINDOW =====
function openArticleWindow(url, title = 'Visualizador') {
  // 1️⃣ CRIAR JANELA
  const childWindow = new BrowserWindow({
    width: 1200,
    height: 850,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: false,
      allowRunningInsecureContent: true
    },
    show: false
  });

  // 2️⃣ REMOVER CSP VIA HEADERS
  childWindow.webContents.session.webRequest.onHeadersReceived(
    {urls: ['<all_urls>']},
    (details, callback) => {
      const responseHeaders = {...details.responseHeaders};
      delete responseHeaders['content-security-policy'];
      delete responseHeaders['content-security-policy-report-only'];
      callback({responseHeaders});
    }
  );

  // 3️⃣ REMOVER CSP VIA JAVASCRIPT
  childWindow.webContents.on('dom-ready', () => {
    childWindow.webContents.executeJavaScript(`
      const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (csp) csp.remove();
    `);
  });

  // 4️⃣ ATALHOS DE TECLADO
  childWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'c') {
      childWindow.webContents.copy();
      return;
    }
    if (input.control && input.key.toLowerCase() === 'v') {
      childWindow.webContents.paste();
      return;
    }
    if (input.control && input.key.toLowerCase() === 'a') {
      childWindow.webContents.selectAll();
      return;
    }
    if (input.control && input.key.toLowerCase() === 'f') {
      event.preventDefault();
      childWindow.webContents.findInPage('');
      return;
    }
    if (input.control && input.key.toLowerCase() === 'r' && !input.shift) {
      childWindow.reload();
      return;
    }
    if (input.alt && input.key === 'ArrowLeft') {
      if (childWindow.webContents.canGoBack()) {
        childWindow.webContents.goBack();
      }
      return;
    }
    if (input.alt && input.key === 'ArrowRight') {
      if (childWindow.webContents.canGoForward()) {
        childWindow.webContents.goForward();
      }
      return;
    }
    if (input.key === 'F12') {
      childWindow.webContents.toggleDevTools();
      return;
    }
  });

  // 5️⃣ MENU DE CONTEXTO (CLIQUE DIREITO)
  childWindow.webContents.on('context-menu', () => {
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
      { label: 'Localizar', role: 'find', accelerator: 'Ctrl+F' },
      { type: 'separator' },
      { label: 'Inspecionar', role: 'inspect' }
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup(childWindow);
  });

  // 6️⃣ MENU SUPERIOR
  const menu = Menu.buildFromTemplate([
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
  ]);
  childWindow.setMenu(menu);

  // 7️⃣ MOSTRAR QUANDO CARREGAR
  childWindow.webContents.on('did-finish-load', () => {
    childWindow.show();
  });

  // 8️⃣ CARREGAR URL
  childWindow.loadURL(url).catch(err => {
    console.error('❌ Erro ao carregar URL:', err.message);
    childWindow.loadURL(`data:text/html,<h1>Erro ao carregar</h1><p>${err.message}</p>`);
    childWindow.show();
  });
}

// ===== CHAMADO VIA IPC =====
ipcMain.handle('open-article-window', async (event, url, title) => {
  try {
    if (!url) throw new Error('URL não fornecida');
    openArticleWindow(url, title);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
```

---

## 📊 Tabela de Atalhos

| Atalho | Função |
|--------|--------|
| **Ctrl+C** | Copiar seleção |
| **Ctrl+V** | Colar |
| **Ctrl+X** | Recortar |
| **Ctrl+A** | Selecionar tudo |
| **Ctrl+F** | Localizar na página |
| **Ctrl+R** | Recarregar |
| **Ctrl+Shift+R** | Recarregar (sem cache) |
| **Alt+Left** | Voltar |
| **Alt+Right** | Avançar |
| **F12** | Abrir DevTools |
| **Clique Direito** | Menu de contexto |

---

## 🎯 Passo a Passo para Seu Projeto

### 1️⃣ No seu `main.js`, adicione no topo:

```javascript
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
```

### 2️⃣ Procure onde você tem a função de abrir child windows

Copie a função `openArticleWindow` acima

### 3️⃣ Procure no código IPC:

```javascript
ipcMain.handle('open-window', async (event, url) => {
  // Aqui chamar: openArticleWindow(url);
});
```

### 4️⃣ No seu `renderer.js`, quando clicar para abrir:

```javascript
const result = await window.electronAPI.openWindow(url);
```

Pronto! A janela vai ter todas as funcionalidades.

---

## 🔍 Checklist de Funcionalidades

- [ ] Menu superior (Editar, Exibir, Navegação)
- [ ] Context menu (clique direito)
- [ ] Atalho Ctrl+C (copiar)
- [ ] Atalho Ctrl+V (colar)
- [ ] Atalho Ctrl+A (selecionar tudo)
- [ ] Atalho Ctrl+F (buscar)
- [ ] Atalho Ctrl+R (recarregar)
- [ ] Atalho Alt+Left (voltar)
- [ ] Atalho Alt+Right (avançar)
- [ ] Atalho F12 (DevTools)
- [ ] CSP removido
- [ ] Página carrega sem erros

---

## ⚠️ Problemas Comuns

### Problema: Cópia/Cola não funciona
**Solução**: Adicione `webSecurity: false` nas webPreferences

### Problema: Menu não aparece
**Solução**: Use `const menu = Menu.buildFromTemplate([...]); childWindow.setMenu(menu);`

### Problema: Atalhos não funcionam
**Solução**: Use `before-input-event` para interceptar teclado:
```javascript
childWindow.webContents.on('before-input-event', (event, input) => {
  // ... tratar input ...
});
```

### Problema: CSP bloqueia funcionalidades
**Solução**: Remover via:
```javascript
// Headers HTTP
childWindow.webContents.session.webRequest.onHeadersReceived(...)

// E via JavaScript
childWindow.webContents.executeJavaScript('document.querySelector(...).remove()')
```

### Problema: Menu de contexto não aparece
**Solução**: Verifique se está usando `Menu.buildFromTemplate()` e `menu.popup(childWindow)`

---

## 💡 Dicas

1. **Sempre use `webSecurity: false`** para conteúdo externo
2. **Remova CSP** de duas formas (headers + JavaScript) para garantir
3. **Use `show: false`** e mostrar apenas no `did-finish-load`
4. **Adicione timeout** se página demorar a carregar:
   ```javascript
   setTimeout(() => {
     if (!childWindow.isDestroyed() && !childWindow.isVisible()) {
       childWindow.show();
     }
   }, 5000);
   ```
5. **Log tudo** para debug: Use `console.log()` para rastrear eventos

---

**Essa solução foi implementada no KCS Formatter e funciona perfeitamente!** 🎉
