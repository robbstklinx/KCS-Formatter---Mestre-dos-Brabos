# 🔧 Guia Comparativo: Antes vs. Depois (Child Windows)

Mostrando exatamente o que você vai implementar no seu projeto.

---

## ❌ ANTES (Sem Funcionalidades)

```javascript
// Simples abertura - SEM NADA
const childWindow = new BrowserWindow({
  width: 1200,
  height: 800
});

childWindow.loadURL(url);
// FIM! Sem menus, sem atalhos, sem nada...
```

**Resultado**:
```
❌ Sem menu superior
❌ Sem context menu (clique direito)
❌ Ctrl+C não funciona
❌ Ctrl+V não funciona
❌ Sem botão de voltar
❌ Sem botão de avançar
❌ Sem busca
❌ Sem acesso a URL da página
❌ Usuário fica preso
```

---

## ✅ DEPOIS (Completo)

```javascript
// Completo com TODAS as funcionalidades
const childWindow = new BrowserWindow({
  width: 1200,
  height: 850,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: false,           // ⭐ Permite executar JS
    webSecurity: false,       // ⭐ Permite conteúdo externo
    allowRunningInsecureContent: true
  },
  show: false
});

// ✅ Remover CSP (bloqueia funcionalidades)
childWindow.webContents.session.webRequest.onHeadersReceived(
  {urls: ['<all_urls>']},
  (details, callback) => {
    const responseHeaders = {...details.responseHeaders};
    delete responseHeaders['content-security-policy'];
    delete responseHeaders['content-security-policy-report-only'];
    callback({responseHeaders});
  }
);

// ✅ Atalhos de teclado (Ctrl+C, Ctrl+V, etc)
childWindow.webContents.on('before-input-event', (event, input) => {
  // Todas as combinações de teclado
});

// ✅ Menu de contexto (clique direito)
childWindow.webContents.on('context-menu', () => {
  const menu = Menu.buildFromTemplate([
    { label: 'Copiar', role: 'copy' },
    { label: 'Colar', role: 'paste' },
    // ... mais opções
  ]);
  menu.popup(childWindow);
});

// ✅ Menu superior
childWindow.setMenu(Menu.buildFromTemplate([
  { label: 'Editar', submenu: [...] },
  { label: 'Exibir', submenu: [...] },
  { label: 'Navegação', submenu: [...] }
]));

// ✅ Carregar URL
childWindow.loadURL(url);
```

**Resultado**:
```
✅ Menu Editar (undo, redo, cut, copy, paste)
✅ Menu Exibir (reload, DevTools)
✅ Menu Navegação (voltar, avançar)
✅ Context menu completo
✅ Ctrl+C funciona (copiar)
✅ Ctrl+V funciona (colar)
✅ Ctrl+A funciona (selecionar tudo)
✅ Ctrl+F funciona (buscar)
✅ Alt+Left funciona (voltar)
✅ Alt+Right funciona (avançar)
✅ F12 abre DevTools
✅ URL da página acessível
✅ Usuário tem controle total
```

---

## 📊 Comparação Visual

```
╔═══════════════════════════════════════════════════════════╗
║                  FEATURE COMPARISON                      ║
╠═══════════════════════════╦═════════════════════════════╣
║ Funcionalidade            ║ Antes     │ Depois         ║
╠═══════════════════════════╬═══════════╪════════════════╣
║ Menu Superior             ║ ❌        │ ✅             ║
║ Context Menu              ║ ❌        │ ✅             ║
║ Copiar (Ctrl+C)           ║ ❌        │ ✅             ║
║ Colar (Ctrl+V)            ║ ❌        │ ✅             ║
║ Selecionar Tudo (Ctrl+A)  ║ ❌        │ ✅             ║
║ Buscar (Ctrl+F)           ║ ❌        │ ✅             ║
║ Voltar (Alt+Left)         ║ ❌        │ ✅             ║
║ Avançar (Alt+Right)       ║ ❌        │ ✅             ║
║ Recarregar (Ctrl+R)       ║ ❌        │ ✅             ║
║ DevTools (F12)            ║ ❌        │ ✅             ║
║ CSP Removido              ║ ❌        │ ✅             ║
║ Redirecionamentos         ║ ❌        │ ✅             ║
║ Tratamento de Erros       ║ ❌        │ ✅             ║
╚═══════════════════════════╩═══════════╪════════════════╝
```

---

## 🎯 Passo a Passo: Aplicar no Seu Projeto

### PASSO 1: Adicione as Imports

```javascript
// No topo do seu main.js
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
```

### PASSO 2: Encontre a Função que Abre Child Windows

Procure por algo tipo:

```javascript
// ❌ ANTES
function createChildWindow(url) {
  const window = new BrowserWindow({ width: 1200, height: 800 });
  window.loadURL(url);
}
```

### PASSO 3: Substitua pela Versão Completa

```javascript
// ✅ DEPOIS
function createChildWindow(url) {
  const childWindow = new BrowserWindow({
    width: 1200,
    height: 850,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,                  // ⭐ IMPORTANTE
      webSecurity: false,              // ⭐ IMPORTANTE
      allowRunningInsecureContent: true
    },
    show: false
  });

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
    // Ctrl+C
    if (input.control && input.key.toLowerCase() === 'c') {
      childWindow.webContents.copy();
      return;
    }
    
    // Ctrl+V
    if (input.control && input.key.toLowerCase() === 'v') {
      childWindow.webContents.paste();
      return;
    }
    
    // Ctrl+A
    if (input.control && input.key.toLowerCase() === 'a') {
      childWindow.webContents.selectAll();
      return;
    }
    
    // Ctrl+F
    if (input.control && input.key.toLowerCase() === 'f') {
      event.preventDefault();
      childWindow.webContents.findInPage('');
      return;
    }
    
    // Ctrl+R
    if (input.control && input.key.toLowerCase() === 'r' && !input.shift) {
      childWindow.reload();
      return;
    }
    
    // Alt+Left
    if (input.alt && input.key === 'ArrowLeft') {
      if (childWindow.webContents.canGoBack()) {
        childWindow.webContents.goBack();
      }
      return;
    }
    
    // Alt+Right
    if (input.alt && input.key === 'ArrowRight') {
      if (childWindow.webContents.canGoForward()) {
        childWindow.webContents.goForward();
      }
      return;
    }
    
    // F12
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

  // ===== MOSTRAR E CARREGAR =====
  childWindow.webContents.on('did-finish-load', () => {
    childWindow.show();
  });

  childWindow.loadURL(url).catch(err => {
    console.error('Erro ao carregar:', err.message);
    childWindow.show();
  });
}
```

### PASSO 4: Teste

```bash
npm start
```

Abra uma janela child, teste:
- [ ] Ctrl+C (copiar)
- [ ] Ctrl+V (colar)
- [ ] Clique direito (menu)
- [ ] Alt+Left (voltar)
- [ ] F12 (DevTools)

---

## 📋 Checklist de Implementação

```
Funcionalidades:
- [ ] Menu Editar (undo, redo, cut, copy, paste)
- [ ] Menu Exibir (reload, forceReload, DevTools)
- [ ] Menu Navegação (back, forward)
- [ ] Context menu (clique direito)
- [ ] Ctrl+C (copiar)
- [ ] Ctrl+V (colar)
- [ ] Ctrl+X (recortar)
- [ ] Ctrl+A (selecionar tudo)
- [ ] Ctrl+F (buscar)
- [ ] Ctrl+R (recarregar)
- [ ] Alt+Left (voltar)
- [ ] Alt+Right (avançar)
- [ ] F12 (DevTools)
- [ ] CSP removido

Configurações:
- [ ] sandbox: false
- [ ] webSecurity: false
- [ ] allowRunningInsecureContent: true
- [ ] show: false (mostrar só quando carregar)

Testing:
- [ ] Página carrega sem erros
- [ ] Menu aparece
- [ ] Atalhos funcionam
- [ ] Clique direito funciona
```

---

## 🆘 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Ctrl+C não copia | Adicione `webSecurity: false` |
| Menu não aparece | Use `childWindow.setMenu(Menu.buildFromTemplate(...))` |
| Atalhos não funcionam | Use `before-input-event` listener |
| Clique direito não funciona | Use `context-menu` listener |
| Página não carrega | Remova CSP com headers + JS |
| DevTools não abre | Adicione `F12` em `before-input-event` |

---

## 💾 Arquivo Completo (Copiar e Usar)

Veja `CHILD_WINDOWS_COMPLETO.md` para o código 100% pronto para copiar e colar.

---

**Agora você tem tudo para implementar!** 🚀

Qualquer dúvida, veja:
- `docs/CHILD_WINDOWS_COMPLETO.md` - Guia técnico completo
- `docs/TROUBLESHOOTING.md` - Solução de problemas
