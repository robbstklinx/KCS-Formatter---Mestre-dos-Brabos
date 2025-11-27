# 🪟 Child Windows Funcionais - Guia Prático Local

> Como implementar janelas child com menu, atalhos, cópia, navegação, etc. **SEM precisar de Git**.

---

## 🎯 O Problema

Seu projeto tem janelas child que abrem, mas:

```
❌ Não consegue copiar texto
❌ Não consegue colar
❌ Não tem menu
❌ Não consegue voltar/avançar
❌ Não consegue buscar
❌ Não consegue ver a URL da página
❌ Usuário fica preso na página
```

---

## ✅ A Solução

Adicionar um código no `main.js` que ativa TODAS essas funcionalidades.

---

## 🔑 4 Pontos-Chave

### 1️⃣ **webPreferences (Configuração da Janela)**

```javascript
webPreferences: {
  nodeIntegration: false,
  contextIsolation: true,
  sandbox: false,                    // ⭐ CRUCIAL - Permite JS
  webSecurity: false,                // ⭐ CRUCIAL - Conteúdo externo
  allowRunningInsecureContent: true  // ⭐ CRUCIAL - HTTP em HTTPS
}
```

**Por que?**
- `sandbox: false` - Permite executar JavaScript para remover bloqueios
- `webSecurity: false` - Permite carregar conteúdo de origens diferentes
- `allowRunningInsecureContent` - Permite misturar HTTP com HTTPS

---

### 2️⃣ **Remover CSP (Content Security Policy)**

Muitos sites têm CSP que **bloqueia copy/paste/menu**. Você precisa remover:

```javascript
// Via HTTP Headers
childWindow.webContents.session.webRequest.onHeadersReceived(
  {urls: ['<all_urls>']},
  (details, callback) => {
    const responseHeaders = {...details.responseHeaders};
    
    // Remove os headers que bloqueiam
    delete responseHeaders['content-security-policy'];
    delete responseHeaders['content-security-policy-report-only'];
    
    callback({responseHeaders});
  }
);

// Via JavaScript (reforça)
childWindow.webContents.on('dom-ready', () => {
  childWindow.webContents.executeJavaScript(`
    const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (csp) csp.remove();
  `);
});
```

---

### 3️⃣ **Atalhos de Teclado**

Interceptar teclado para ativar funcionalidades:

```javascript
childWindow.webContents.on('before-input-event', (event, input) => {
  // Ctrl+C = Copiar
  if (input.control && input.key.toLowerCase() === 'c') {
    childWindow.webContents.copy();
    return;
  }
  
  // Ctrl+V = Colar
  if (input.control && input.key.toLowerCase() === 'v') {
    childWindow.webContents.paste();
    return;
  }
  
  // Ctrl+A = Selecionar tudo
  if (input.control && input.key.toLowerCase() === 'a') {
    childWindow.webContents.selectAll();
    return;
  }
  
  // Ctrl+F = Localizar
  if (input.control && input.key.toLowerCase() === 'f') {
    event.preventDefault();
    childWindow.webContents.findInPage('');
    return;
  }
  
  // Ctrl+R = Recarregar
  if (input.control && input.key.toLowerCase() === 'r' && !input.shift) {
    childWindow.reload();
    return;
  }
  
  // Alt+Left = Voltar
  if (input.alt && input.key === 'ArrowLeft') {
    if (childWindow.webContents.canGoBack()) {
      childWindow.webContents.goBack();
    }
    return;
  }
  
  // Alt+Right = Avançar
  if (input.alt && input.key === 'ArrowRight') {
    if (childWindow.webContents.canGoForward()) {
      childWindow.webContents.goForward();
    }
    return;
  }
  
  // F12 = DevTools (ver código da página)
  if (input.key === 'F12') {
    childWindow.webContents.toggleDevTools();
    return;
  }
});
```

---

### 4️⃣ **Menu (Clique Direito + Superior)**

Adicionar menus com opções:

```javascript
// ===== MENU DE CONTEXTO (Clique Direito) =====
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

// ===== MENU SUPERIOR =====
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
```

---

## 📋 Passo a Passo para Seu Projeto

### PASSO 1: Localize sua função que abre child windows

No seu `main.js`, procure por algo como:

```javascript
function openWindow(url) {
  // ... código ...
}
```

ou

```javascript
ipcMain.handle('open-window', async (event, url) => {
  // ... código ...
});
```

### PASSO 2: Encontre onde cria `BrowserWindow`

```javascript
const childWindow = new BrowserWindow({
  width: 1200,
  height: 800
  // ... outras opções
});
```

### PASSO 3: Modifique as `webPreferences`

**ANTES:**
```javascript
const childWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  webPreferences: {
    nodeIntegration: false
  }
});
```

**DEPOIS:**
```javascript
const childWindow = new BrowserWindow({
  width: 1200,
  height: 850,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: false,                    // ← ADICIONE ISSO
    webSecurity: false,                // ← ADICIONE ISSO
    allowRunningInsecureContent: true  // ← ADICIONE ISSO
  },
  show: false  // ← Mostrar só quando carregar
});
```

### PASSO 4: Adicione ANTES de `childWindow.loadURL(url)`

```javascript
// ===== REMOVER CSP =====
childWindow.webContents.session.webRequest.onHeadersReceived(
  {urls: ['<all_urls>']},
  (details, callback) => {
    const responseHeaders = {...details.responseHeaders};
    delete responseHeaders['content-security-policy'];
    delete responseHeaders['content-security-policy-report-only'];
    callback({responseHeaders});
  }
);

// ===== ATALHOS DE TECLADO =====
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

// ===== MENU DE CONTEXTO =====
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

// ===== MENU SUPERIOR =====
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

// ===== MOSTRAR QUANDO CARREGAR =====
childWindow.webContents.on('did-finish-load', () => {
  childWindow.show();
});

// ===== CARREGAR URL =====
childWindow.loadURL(url).catch(err => {
  console.error('Erro ao carregar:', err.message);
  childWindow.show();
});
```

### PASSO 5: Teste!

```bash
npm start
```

Abra uma janela child e teste:
- [ ] Ctrl+C (copiar)
- [ ] Ctrl+V (colar)
- [ ] Clique direito (menu)
- [ ] Alt+Left (voltar)
- [ ] Ctrl+F (buscar)
- [ ] F12 (DevTools)

---

## 🚨 Problema Comum

**Problema**: "Ainda não funciona copiar"

**Solução**:

1. Verifique se tem `Menu` importado:
```javascript
const { BrowserWindow, Menu, ipcMain } = require('electron');
```

2. Certifique-se que `sandbox: false` e `webSecurity: false` estão presentes

3. Abra DevTools (F12) e veja se tem erro:
```javascript
childWindow.webContents.openDevTools();
```

4. Se ainda não funcionar, tente adicionar isso TAMBÉM:
```javascript
childWindow.webContents.on('dom-ready', () => {
  childWindow.webContents.executeJavaScript(`
    const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (csp) csp.remove();
    
    // Força permitir tudo
    if (document.documentElement) {
      document.documentElement.style.WebkitUserSelect = 'text';
    }
  `);
});
```

---

## 📊 Atalhos Disponíveis

| Atalho | O que faz |
|--------|-----------|
| **Ctrl+C** | Copiar seleção |
| **Ctrl+V** | Colar |
| **Ctrl+X** | Recortar |
| **Ctrl+A** | Selecionar tudo |
| **Ctrl+F** | Localizar na página |
| **Ctrl+R** | Recarregar página |
| **Ctrl+Shift+R** | Recarregar sem cache |
| **Alt+Left** | Voltar página anterior |
| **Alt+Right** | Avançar página próxima |
| **F12** | Abrir DevTools (ver código) |
| **Clique Direito** | Menu de contexto |

---

## 💡 Dicas Importantes

1. **`sandbox: false` é essencial** - Sem isso, JavaScript não roda
2. **`webSecurity: false` é essencial** - Sem isso, não carrega conteúdo externo
3. **Remova CSP de 2 formas** - Headers HTTP + JavaScript
4. **Use `show: false` e `did-finish-load`** - Evita mostrar página pela metade
5. **Adicione handlers de erro** - Para páginas que não carregam

---

## 🎯 Checklist Final

- [ ] Adicionou `sandbox: false`
- [ ] Adicionou `webSecurity: false`
- [ ] Adicionou `allowRunningInsecureContent: true`
- [ ] Removeu CSP via headers HTTP
- [ ] Removeu CSP via JavaScript
- [ ] Adicionou atalhos de teclado
- [ ] Adicionou menu de contexto
- [ ] Adicionou menu superior
- [ ] Testou Ctrl+C
- [ ] Testou Ctrl+V
- [ ] Testou Alt+Left (voltar)
- [ ] Testou F12 (DevTools)
- [ ] Testou clique direito

---

## 📌 Estrutura Final

Sua função deve ficar assim:

```javascript
function openChildWindow(url) {
  // 1. Criar janela COM configurações corretas
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

  // 2. Remover CSP (bloqueia tudo)
  childWindow.webContents.session.webRequest.onHeadersReceived(
    {urls: ['<all_urls>']},
    (details, callback) => {
      const responseHeaders = {...details.responseHeaders};
      delete responseHeaders['content-security-policy'];
      delete responseHeaders['content-security-policy-report-only'];
      callback({responseHeaders});
    }
  );

  // 3. Atalhos
  childWindow.webContents.on('before-input-event', (event, input) => {
    // ... todos os atalhos ...
  });

  // 4. Menu contexto
  childWindow.webContents.on('context-menu', () => {
    // ... menu ...
  });

  // 5. Menu superior
  childWindow.setMenu(Menu.buildFromTemplate([...]));

  // 6. Mostrar e carregar
  childWindow.webContents.on('did-finish-load', () => {
    childWindow.show();
  });
  
  childWindow.loadURL(url);
}
```

---

**Pronto! Com isso sua janela child vai ter TODAS as funcionalidades!** 🎉

Qualquer problema, abra DevTools (F12) e veja o erro no console.
