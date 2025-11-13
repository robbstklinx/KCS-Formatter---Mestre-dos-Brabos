# 🪟 Feature: Janelas Child - Visualizador de Artigos

## 📋 O que foi implementado

Uma nova funcionalidade que permite abrir artigos em **janelas secundárias (child) do Electron** com todas as funcionalidades de um navegador.

---

## ✨ Funcionalidades

### 🔗 Botão "Abrir" em Cada Artigo
Cada artigo na lista de busca agora possui um botão `🔗 Abrir` que abre a URL em uma janela dedicada.

```
Antes:                           Depois:
┌──────────────────┐            ┌──────────────────────────┐
│ Título           │            │ Título                   │
│ Link url         │     →      │ Link url      🔗 Abrir   │
└──────────────────┘            └──────────────────────────┘
```

### 🌐 Janela Redimensionável
- **Tamanho padrão**: 1000x700 pixels
- **Redimensionável**: Arrastar bordas/cantos para ajustar
- **Ícone**: Mostra o ícone do app

### 📋 Context Menu Completo (Clique Direito)
- ✅ Copiar
- ✅ Colar
- ✅ Recortar
- ✅ Selecionar Tudo
- ✅ **Localizar na página** (Ctrl+F)
- ✅ Recarregar página
- ✅ Recarregar (cache completo)
- ✅ Inspecionar elemento

### ⌨️ Atalhos de Teclado
- `Ctrl+F` - Localizar na página
- `Ctrl+C` - Copiar
- `Ctrl+V` - Colar
- `Ctrl+X` - Recortar
- `Ctrl+A` - Selecionar tudo
- `F5` - Recarregar
- `Ctrl+Shift+R` - Recarregar cache completo
- `Ctrl++` - Aumentar zoom
- `Ctrl+-` - Diminuir zoom
- `Ctrl+0` - Resetar zoom padrão

### 🔒 Segurança
- Sandboxing ativo (isolamento de processo)
- Context isolation habilitado
- Navegação limitada ao mesmo domínio
- Links externos abrem no navegador padrão
- Sem acesso a APIs do Electron

---

## 🔧 Implementação Técnica

### Arquivos Alterados

#### 1. **main.js** (+100 linhas)
```javascript
// Nova função: createArticleWindow(url, title)
- Cria BrowserWindow secundária
- Carrega URL do artigo
- Configura context menu
- Habilita zooming (Ctrl +/-)
- Restringe navegação ao domínio original
- Bloqueia abrir links em novas janelas (abre no navegador)

// Novo IPC Handler: 'open-article-window'
- Valida URL
- Chama createArticleWindow
- Retorna resultado (success/error)
```

#### 2. **preload.js** (+1 linha)
```javascript
// Expõe novo método
openArticleWindow: (url, title) => ipcRenderer.invoke('open-article-window', url, title)
```

#### 3. **renderer.js** (+40 linhas)
```javascript
// Atualizado: renderização de itens de busca
- Adicionado botão "🔗 Abrir" em cada resultado
- Click no botão → openArticleWindow
- Hover effect (cor muda para teal mais claro)
- Não interfere com seleção do artigo (usa stopPropagation)
```

---

## 🎯 Casos de Uso

### Scenario 1: Visualizar Artigo Completo
```
1. Usuário busca por "Como criar cliente"
2. Resultados aparecem com links
3. Clica no botão "🔗 Abrir" em um resultado
4. Janela child abre mostrando o artigo completo
5. Usuário pode copiar conteúdo, localizar texto, etc.
6. Volta ao editor principal quando terminar
```

### Scenario 2: Comparar Múltiplos Artigos
```
1. Abre primeiro artigo (janela child #1)
2. Volta ao editor principal
3. Busca novo termo
4. Abre segundo artigo (janela child #2)
5. Agora tem 2 janelas abertas lado a lado
6. Copia trechos de ambos para o editor
```

### Scenario 3: Usar "Localizar" para Buscar Texto
```
1. Abre artigo em janela child
2. Pressiona Ctrl+F (Find)
3. Digita termo a procurar
4. Navegador destaca todas as ocorrências
5. Facilita encontrar informação específica
```

---

## 🚀 Como Usar

### Modo Programático (futuro)
```javascript
// Se precisar abrir por código
const result = await window.electronAPI.openArticleWindow(
  'https://share.linx.com.br/articles/123',
  'Como Configurar Módulo X'
);
```

### Modo UI (atual)
1. **Buscar** → Digite termo
2. **Clique** em um resultado (seleciona)
3. **Clique** no botão "🔗 Abrir" 
4. **Nova janela** abre automaticamente
5. **Use** as funcionalidades do navegador
6. **Feche** quando terminar (X no canto)

---

## 🛡️ Considerações de Segurança

### ✅ Implementado
- [x] Sandbox ativo (processo isolado)
- [x] Context isolation
- [x] Node integration desabilitado
- [x] Preload desabilitado para child windows
- [x] Validação de URL
- [x] Restrição de navegação ao domínio
- [x] Links externos em navegador padrão

### ⚠️ Limitações Intencionais
- [x] Não permite abrir janelas adicionais de dentro da child window
- [x] Não permite acessar APIs do Electron
- [x] Não permite download de arquivos
- [x] Não permite acesso ao filesystem

---

## 📊 Comparação: Antes vs Depois

### ANTES (v3.0.1)
```
Buscar → Selecionar artigo → "Usar artigo selecionado" → Dados no preview
  (Sem visualização da página original)
```

### DEPOIS (v3.0.2)
```
Buscar → Clique "🔗 Abrir" → Janela child (navegador) → Copiar/Localizar texto
              ↓
    "Usar artigo selecionado" → Dados no preview
    (Agora com opção de visualizar original)
```

---

## 🔧 Configurações Personalizáveis

Se precisar ajustar, edite `main.js` na função `createArticleWindow`:

```javascript
// Tamanho da janela
const childWindow = new BrowserWindow({
  width: 1000,  // ← Aumentar/diminuir
  height: 700,  // ← Aumentar/diminuir
  ...
});

// Zoom mínimo/máximo
childWindow.webContents.zoomLevel += 0.5; // Incremente de 0.1 em 0.1

// Restrições de domínio (na função will-navigate)
if (parsedUrl.hostname !== originalUrl.hostname) {
  // Alterar lógica aqui se precisar permitir domínios específicos
}
```

---

## 🎓 Próximas Melhorias Possíveis

- [ ] Botão de voltar/avançar (back/forward)
- [ ] Barra de endereço editável
- [ ] Histórico de navegação
- [ ] Botão de parar carregamento
- [ ] Indicador de carregamento (progress bar)
- [ ] Modo escuro para child windows
- [ ] Salvar última URL visitada
- [ ] Atalho para abrir DevTools (F12)
- [ ] Sincronizar zoom entre janelas

---

## 📝 Notas

1. **Múltiplas janelas**: O usuário pode abrir quantas janelas child quiser
2. **Independentes**: Cada janela funciona independentemente
3. **Não bloqueiam main**: Abrir child window não trava a main window
4. **Fácil fechar**: Botão X fecha apenas a child (main continua)
5. **Redimensionável**: Cada janela guarda seu próprio tamanho

---

## ✅ Status

- ✅ Feature implementada
- ✅ Context menu completo
- ✅ Segurança validada
- ✅ Sem breaking changes
- ✅ Código testado
- ✅ Pronto para produção

---

## 🎉 Resultado Final

Usuários agora podem:
- ✅ Visualizar artigos em janelas separadas
- ✅ Usar funcionalidades completas de navegador
- ✅ Copiar/colar/localizar texto facilmente
- ✅ Recarregar página se necessário
- ✅ Aumentar/diminuir zoom
- ✅ Inspecionar elementos (dev tools)
- ✅ Manter UI principal intocada

