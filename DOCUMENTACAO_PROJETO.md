# 📚 Documentação Completa - KCS Formatter App 3.0

## 📑 Índice
1. [Visão Geral do Projeto](#visão-geral)
2. [Arquitetura da Aplicação](#arquitetura)
3. [Tecnologias Utilizadas](#tecnologias)
4. [Estrutura de Pastas](#estrutura-pastas)
5. [Componentes Principais](#componentes)
6. [Fluxo de Dados](#fluxo-dados)
7. [Funcionalidades Detalhadas](#funcionalidades)
8. [Integração com APIs Externas](#apis)
9. [Como Funciona Passo a Passo](#passo-passo)

---

## 🎯 Visão Geral do Projeto

### O que é o KCS Formatter?

O **KCS Formatter** é uma aplicação desktop desenvolvida em **Electron** que ajuda na formatação e estruturação de artigos técnicos de suporte seguindo a metodologia **KCS (Knowledge Centered Service)** da **Linx Microvix**.

### Objetivo Principal

Permitir que usuários:
1. **Busquem artigos** na base de conhecimento do Share Linx
2. **Visualizem o conteúdo** em uma janela integrada
3. **Extraiam informações** de forma estruturada
4. **Formateiem automaticamente** segundo metodologia KCS
5. **Gerar JSON estruturado** com campos padronizados

### Benefícios

✅ Padronização de documentação
✅ Economia de tempo na formatação
✅ Reutilização inteligente de conhecimento
✅ Interface amigável e intuitiva
✅ Suporte a diferentes estruturas de conteúdo

---

## 🏗️ Arquitetura da Aplicação

```
┌─────────────────────────────────────────────────────────────┐
│                    USUÁRIO FINAL                             │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
   ┌─────────────────┐          ┌──────────────────┐
   │  UI/Frontend    │          │ Backend Process  │
   │  (Renderer)     │          │  (Main)          │
   └────────┬────────┘          └────────┬─────────┘
            │                            │
            │    ◄─── IPC ───►          │
            │ (Comunicação)             │
            │                            │
        ┌───┴────────────────────────────┴──────┐
        │                                       │
        ▼                                       ▼
   ┌──────────────────┐              ┌────────────────────┐
   │ Janelas          │              │ Processamento      │
   │ • Main           │              │ • Parsing          │
   │ • Child (artigos)│              │ • Extração         │
   └──────────────────┘              │ • Chamadas APIs    │
                                     └────────────────────┘
        │                                       │
        └───────────────┬───────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
   ┌─────────────┐              ┌────────────────┐
   │ APIs        │              │ Sistema de     │
   │ • Share     │              │ Arquivos       │
   │ • OpenAI/   │              │ • .env         │
   │   Copilot   │              │ • índices      │
   │ • Google    │              │ • recursos     │
   │ • DuckDuckGo│              │                │
   └─────────────┘              └────────────────┘
```

---

## 💻 Tecnologias Utilizadas

### Framework Principal
- **Electron 31.7.7**: Framework para criar aplicações desktop multiplataforma com JavaScript

### Linguagem de Programação
- **JavaScript (Node.js)**: Lógica backend e IPC

### Front-end
- **HTML5**: Estrutura da interface
- **CSS3**: Estilização
- **JavaScript vanilla**: Interação com DOM

### Processamento de Dados
- **Cheerio 1.1.2**: Parser HTML (extração de conteúdo web)
- **Axios 1.13.2**: Cliente HTTP (requisições para APIs)
- **Node-fetch 3.3.2**: API Fetch nativa do Node.js

### Inteligência Artificial
- **OpenAI 4.0.0**: SDK para integração com GPT-4o-mini
- **Suporte a Copilot**: Alternativa usando mesmo SDK com endpoint customizado

### Configuração e Ambiente
- **dotenv 16.6.1**: Gerenciamento de variáveis de ambiente
- **electron-builder 26.0.12**: Empacotamento e distribuição

---

## 📁 Estrutura de Pastas

```
kcs_formatter_app_3.0/
│
├── src/                              # Código-fonte da aplicação
│   ├── main.js                       # ⭐ Processo principal (backend)
│   ├── renderer.js                   # Interface de usuário (UI/evento)
│   ├── preload.js                    # Bridge de segurança IPC
│   ├── formatter.js                  # Utilitários de formatação
│   ├── .env                          # Variáveis de ambiente (SECRETO)
│   │
│   └── public/                       # Arquivos estáticos
│       ├── index.html                # Página principal
│       ├── styles.css                # Estilos da aplicação
│       └── mestredosbrabosicon.ico   # Ícone da aplicação
│
├── node_modules/                     # Dependências do projeto
├── package.json                      # Metadados e scripts
├── package-lock.json                 # Versões fixas das dependências
│
└── DOCUMENTACAO_PROJETO.md           # Este arquivo
```

### Arquivos Principais

#### 1. `main.js` (Processo Principal - Backend)
**O "coração" da aplicação**

Responsável por:
- ✅ Criar e gerenciar janelas
- ✅ Processar requisições do frontend via IPC
- ✅ Chamar APIs externas (Share, OpenAI, Copilot)
- ✅ Fazer parsing de conteúdo HTML
- ✅ Gerenciar context menus e atalhos

#### 2. `renderer.js` (Interface de Usuário)
**O "rosto" da aplicação**

Responsável por:
- ✅ Capturar eventos do usuário (cliques, entrada de texto)
- ✅ Enviar requisições para o backend via IPC
- ✅ Atualizar a interface com resultados
- ✅ Exibir resultados de busca
- ✅ Gerenciar formulários

#### 3. `preload.js` (Segurança)
**Proteção entre frontend e backend**

Responsável por:
- ✅ Expor apenas funções seguras via IPC
- ✅ Prevenir acesso direto ao Node.js
- ✅ Validar chamadas entre processos
- ✅ Manter isolamento de contexto

#### 4. `formatter.js` (Utilitários)
**Ferramentas de formatação**

Contém funções para:
- ✅ Formatar textos
- ✅ Validar dados
- ✅ Estruturar JSON

#### 5. `.env` (Configuração Secreto)
**Armazena chaves e URLs sensíveis**

Contém:
```ini
OPENAI_API_KEY=sk-...          # Chave OpenAI (opcional)
COPILOT_API_KEY=...            # Chave Copilot (alternativa)
COPILOT_ENDPOINT=...           # URL do endpoint
SHARE_API_URL=...              # URL do Share Linx
SHARE_API_KEY=...              # Autenticação Share Linx
```

---

## 🔧 Componentes Principais

### 1. **Criação de Janelas**

#### `createWindow()` - Janela Principal
```javascript
function createWindow() {
  // Cria a janela principal da aplicação
  // - Tamanho: 1200x800 pixels
  // - Carrega index.html do diretório public
  // - Usa preload.js para segurança
  // - Desabilita menu padrão
}
```

**O que faz:**
- Abre a janela principal
- Define tamanho e icone
- Carrega o HTML da interface
- Configura segurança (context isolation, sandbox)
- Escuta eventos do Electron

#### `createArticleWindow(url, title)` - Janela Child (Artigo)
```javascript
function createArticleWindow(url, title) {
  // Cria uma nova janela para visualizar artigos
  // - Tamanho: 1200x850 pixels
  // - Carrega a URL do artigo
  // - Remove CSS restritivo (CSP)
  // - Permite navegação e busca
}
```

**O que faz:**
- Abre nova janela para visualizar artigo completo
- Decodifica URLs de redirecionamento (DuckDuckGo)
- Remove políticas de segurança restritivas
- Adiciona menu com navegação
- Implementa atalhos de teclado (Ctrl+F, Ctrl+C, etc)

---

### 2. **Sistema de Comunicação IPC (Inter-Process Communication)**

O Electron trabalha com dois processos separados que precisam se comunicar:

```
┌─────────────────────────────────┐
│     Renderer (Frontend)         │
│  • Interface HTML/CSS/JS        │
│  • Eventos do usuário           │
│  • DOM manipulation             │
└────────────────┬────────────────┘
                 │
        ◄─────── IPC ──────►
        
         ipcMain.handle()
         ipcRenderer.invoke()
                 │
┌────────────────┴────────────────┐
│      Main (Backend)             │
│  • APIs externas                │
│  • Processamento pesado         │
│  • Sistema de arquivos          │
│  • Variáveis de ambiente        │
└─────────────────────────────────┘
```

#### Handlers IPC Principais

**1. `open-article-window`** - Abrir artigo em nova janela
```javascript
ipcMain.handle('open-article-window', async (event, url, title) => {
  // Valida URL
  // Remove redirecionamentos
  // Cria janela child
  // Retorna status
})
```

**2. `ask-ai`** - Formatar conteúdo com IA
```javascript
ipcMain.handle('ask-ai', async (event, prompt) => {
  // Aplica parser inteligente
  // Envia para OpenAI/Copilot
  // Retorna JSON formatado segundo KCS
})
```

**3. `search-share`** - Buscar no Share Linx
```javascript
ipcMain.handle('search-share', async (event, termoBusca) => {
  // Chama API do Share Linx
  // Retorna lista de artigos encontrados
})
```

**4. `search-google`** - Buscar alternativas
```javascript
ipcMain.handle('search-google', async (event, termoBusca) => {
  // Tenta múltiplas estratégias
  // Google scoped Share Linx
  // DuckDuckGo
  // Confluence direto
})
```

**5. `extract-article-content`** - Extrair conteúdo de artigo
```javascript
ipcMain.handle('extract-article-content', async (event, url) => {
  // Faz requisição HTTP para a URL
  // Parse HTML com Cheerio
  // Estrutura conteúdo de forma inteligente
  // Limpa ruído (scripts, styles, nav)
  // Retorna texto limpo
})
```

---

### 3. **Parser Inteligente de Conteúdo**

#### Função: `smartParseContent(content)`

**Problema que resolve:**
Artigos do Share Linx não têm estrutura padronizada:
- Alguns têm listas numeradas (1. 2. 3...)
- Outros têm bullets (-, *, •)
- Outros são puramente narrativos/descritivos

**Solução - Detecção Automática:**

```
Input: Conteúdo bruto do artigo
         │
         ▼
┌─────────────────────────────────┐
│ Analisa padrões no conteúdo     │
│ • Tem números? → Numerado       │
│ • Tem bullets? → Com bullets    │
│ • Tem ações? → Descritivo ativo │
│ • Genérico? → Puro descritivo   │
└────────────┬────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐       ┌──────────┐
│ Manter  │       │Reorganizar│
│ Padrão  │       │ em Passos │
└─────────┘       └──────────┘
    │                 │
    └────────┬────────┘
             │
             ▼
Output: Conteúdo estruturado
        (pronto para IA processar)
```

**Exemplo de Transformação:**

**Entrada (Narrativo):**
```
Para fazer uma devolução, acesse o sistema. 
Clique no botão de devoluções. Selecione o 
pedido que deseja devolver. Digite o motivo 
e confirme a solicitação.
```

**Saída (Após Parser):**
```
1. Para fazer uma devolução, acesse o sistema
2. Clique no botão de devoluções
3. Selecione o pedido que deseja devolver
4. Digite o motivo e confirme a solicitação
```

---

### 4. **Integração com IA (OpenAI / Copilot)**

#### Fluxo de Processamento

```
Conteúdo extraído
      │
      ▼
┌──────────────────────────┐
│ Parser Inteligente       │ ◄─── Estrutura o conteúdo
│ smartParseContent()      │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Prompt para IA           │ ◄─── Define o que IA deve fazer
│ "Você é um assistente   │
│  técnico que formata     │
│  segundo KCS..."         │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Chamada à API            │
│ • OpenAI gpt-4o-mini     │ ◄─── Usa chave configurada
│ • Copilot (alternativa)  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Resposta JSON            │ ◄─── Estrutura KCS
│ {                        │
│   "title": "...",        │
│   "module": "...",       │
│   "description": "...",  │
│   "cause": "...",        │
│   "solution": [...],     │
│   "links": [...],        │
│   "tags": [...]          │
│ }                        │
└──────────────────────────┘
```

#### Campos KCS Explicados

| Campo | O que é | Exemplo |
|-------|---------|---------|
| **title** | Título padronizado | "Linx Microvix - Vendas - Como fazer devolução" |
| **module** | Módulo do sistema | "Vendas", "Faturamento", "Estoque" |
| **description** | Resumo em uma frase | "Para fazer uma devolução de compra..." |
| **cause** | Motivo/contexto do problema | "Produto defeituoso ou não atende requisito" |
| **solution** | Array com passos numerados | ["1. Acesse o sistema", "2. Clique em..."] |
| **links** | URLs relevantes | ["https://share.linx.com.br/..."] |
| **tags** | Palavras-chave para busca | ["devolução", "vendas", "compra"] |

---

### 5. **Buscas em Múltiplas Fontes**

#### Estratégia de Busca Hierárquica

```
Usuário digita termo de busca
         │
         ▼
┌─────────────────────────────┐
│ Estratégia 1: Share Linx    │ ◄─── API Confluence oficial
│ (Confluence REST API)       │
│ /rest/api/search            │
└────────────┬────────────────┘
             │
    Encontrou? ✓ Retorna resultados
             │
    Não? ✗ Próxima estratégia
             │
             ▼
┌─────────────────────────────┐
│ Estratégia 2: Google        │ ◄─── Busca scoped: site:share.linx.com.br
│ (Web scraping com Cheerio)  │
└────────────┬────────────────┘
             │
    Encontrou? ✓ Retorna resultados
             │
    Não? ✗ Próxima estratégia
             │
             ▼
┌─────────────────────────────┐
│ Estratégia 3: DuckDuckGo    │ ◄─── Busca alternativa scoped
│ (Web scraping com Cheerio)  │
└────────────┬────────────────┘
             │
    Encontrou? ✓ Retorna resultados
             │
    Não? ✗ Retorna erro com dicas
```

#### Por que múltiplas estratégias?

- ✅ **Redundância**: Se uma falhar, tenta outra
- ✅ **Velocidade**: Retorna primeiro resultado disponível
- ✅ **Flexibilidade**: Diferentes fontes podem estar disponíveis
- ✅ **Robustez**: Não depende de uma única API

---

## 📊 Fluxo de Dados Completo

### Cenário: Usuário busca, abre artigo e formata

```
1. BUSCA
   ┌──────────────────────────┐
   │ Usuário digita termo     │
   │ e clica "Buscar"         │
   └────────────┬─────────────┘
                │
                ▼ IPC: invoke('search-google')
   ┌──────────────────────────┐
   │ Backend processa busca   │
   │ • Tenta Share Linx API   │
   │ • Tenta Google           │
   │ • Tenta DuckDuckGo       │
   └────────────┬─────────────┘
                │
                ▼ Retorna lista de resultados
   ┌──────────────────────────┐
   │ Frontend exibe resultados│
   │ com título, URL, resumo  │
   └──────────────────────────┘

2. VISUALIZAÇÃO
   ┌──────────────────────────┐
   │ Usuário clica em artigo  │
   │ para visualizar          │
   └────────────┬─────────────┘
                │
                ▼ IPC: invoke('open-article-window')
   ┌──────────────────────────┐
   │ Backend:                 │
   │ • Valida URL             │
   │ • Decodifica se needed   │
   │ • Cria janela nova       │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │ Nova janela abre com:    │
   │ • Menu de navegação      │
   │ • Menu de contexto       │
   │ • Atalhos (Ctrl+F, etc)  │
   │ • Conteúdo do artigo     │
   └──────────────────────────┘

3. EXTRAÇÃO
   ┌──────────────────────────┐
   │ Usuário clica            │
   │ "Usar artigo selecionado"│
   └────────────┬─────────────┘
                │
                ▼ IPC: invoke('extract-article-content')
   ┌──────────────────────────┐
   │ Backend:                 │
   │ • Faz HTTP GET da URL    │
   │ • Parse HTML com Cheerio │
   │ • Encontra #main-content │
   │ • Remove lixo (scripts)  │
   │ • Estrutura texto        │
   └────────────┬─────────────┘
                │
                ▼ Retorna conteúdo limpo
   ┌──────────────────────────┐
   │ Frontend exibe preview   │
   │ do conteúdo extraído     │
   └──────────────────────────┘

4. FORMATAÇÃO KCS
   ┌──────────────────────────┐
   │ Usuário clica            │
   │ "Formatar com KCS"       │
   └────────────┬─────────────┘
                │
                ▼ IPC: invoke('ask-ai')
   ┌──────────────────────────┐
   │ Backend:                 │
   │ • Aplica smartParseContent
   │ • Prepara prompt para IA │
   │ • Chama OpenAI/Copilot   │
   └────────────┬─────────────┘
                │
                ▼ IA retorna JSON
   ┌──────────────────────────┐
   │ Backend valida JSON      │
   │ Retorna resultado        │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │ Frontend exibe:          │
   │ • Título formatado       │
   │ • Módulo identificado    │
   │ • Descrição              │
   │ • Passos numerados       │
   │ • Tags                   │
   │ • Botão copiar JSON      │
   └──────────────────────────┘
```

---

## 🎯 Funcionalidades Detalhadas

### 1. **Busca Inteligente Multi-Fonte**

**Frontend (renderer.js):**
```javascript
// Usuário digita e clica buscar
document.getElementById('searchBtn').addEventListener('click', () => {
  const termo = document.getElementById('searchInput').value;
  
  // Invoca backend via IPC
  window.ipc.invoke('search-google', termo)
    .then(resultados => {
      // Exibe resultados na UI
      displayResults(resultados.items);
    });
});
```

**Backend (main.js):**
```javascript
ipcMain.handle('search-google', async (event, termoBusca) => {
  let items = [];
  
  // Estratégia 1: Share Linx
  try {
    // Tenta API Confluence
    const response = await axios.get(shareUrl);
    items = processShareResults(response.data);
    if (items.length > 0) return { items };
  } catch (err) { /* tenta próxima */ }
  
  // Estratégia 2: Google
  try {
    // Faz scraping Google
    const response = await axios.get(googleUrl);
    items = scrapeGoogleResults(response.data);
    if (items.length > 0) return { items };
  } catch (err) { /* tenta próxima */ }
  
  // Estratégia 3: DuckDuckGo
  try {
    // Faz scraping DuckDuckGo
    const response = await axios.get(ddgUrl);
    items = scrapeDDGResults(response.data);
    if (items.length > 0) return { items };
  } catch (err) { /* retorna erro */ }
});
```

---

### 2. **Extração de Conteúdo com Parsing Inteligente**

**O que acontece:**

```
URL do artigo
     │
     ▼
HTTP GET request (Axios)
     │
     ▼
HTML Raw (carregado completamente)
     │
     ▼
Cheerio Parse (converte em DOM-like)
     │
     ▼
Seletores CSS (encontra conteúdo principal)
Prioridade:
1. #main-content (Confluence padrão)
2. .confluence-content-wrapper
3. .wiki-content
4. [role="main"]
5. article tag
6. body (fallback)
     │
     ▼
Remove elementos desnecessários:
- <script>
- <style>
- <nav>
- <header>
- <footer>
- .breadcrumbs
- .comments-section
     │
     ▼
Extrai TODOS os headers (h1-h6), parágrafos, listas
     │
     ▼
smartParseContent() - Reorganiza conforme tipo
     │
     ▼
Limpa whitespace, remove duplicatas
     │
     ▼
Limita a 12.000 caracteres / 200 linhas
     │
     ▼
Retorna conteúdo estruturado
```

---

### 3. **Formatação com IA (KCS)**

**Prompt System:**
```
Você é um assistente técnico que formata artigos 
segundo KCS (Knowledge Centered Service).

Estrutura esperada:
{
  "title": "Linx Microvix - [Módulo] - Como [ação]",
  "module": "[Identificar módulo]",
  "description": "Para [descrever objetivo]...",
  "cause": "[Motivo do problema]",
  "solution": [
    "1. Passo um",
    "2. Passo dois",
    "2.1. Subpasso"
  ],
  "links": ["urls encontradas"],
  "tags": ["até 6 tags"]
}
```

**Temperatura: 0.15**
(Baixa temperatura = respostas mais consistentes e previsíveis)

---

### 4. **Menu de Contexto da Janela de Artigo**

```
Clique direito na página do artigo
         │
         ▼
┌──────────────────────────────┐
│ Voltar (Alt+Left)            │
│ Avançar (Alt+Right)          │
│ Recarregar (Ctrl+R)          │
├──────────────────────────────┤
│ Copiar (Ctrl+C)              │
│ Colar (Ctrl+V)               │
│ Recortar (Ctrl+X)            │
├──────────────────────────────┤
│ Selecionar Tudo (Ctrl+A)     │
│ Localizar na página (Ctrl+F) │
├──────────────────────────────┤
│ Inspecionar elemento (F12)   │
└──────────────────────────────┘
```

---

## 🔌 APIs Externas Utilizadas

### 1. **Share Linx (Confluence)**

**Endpoint:**
```
GET https://share.linx.com.br/rest/api/search
    ?cql=text~"termo"&space=KB&expand=excerpt&limit=10
```

**Headers:**
```javascript
{
  'User-Agent': 'Mozilla/5.0...',
  'Accept': 'application/json'
}
```

**Resposta:**
```json
{
  "results": [
    {
      "title": "Título do artigo",
      "url": "/pages/viewpage.action?pageId=12345",
      "excerpt": "Resumo do conteúdo...",
      "content": { "body": { "storage": { "value": "<html>..." } } }
    }
  ]
}
```

---

### 2. **OpenAI API**

**Endpoint:**
```
POST https://api.openai.com/v1/chat/completions
```

**Headers:**
```javascript
{
  'Authorization': `Bearer ${OPENAI_API_KEY}`,
  'Content-Type': 'application/json'
}
```

**Request:**
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "Você é um assistente técnico..."
    },
    {
      "role": "user",
      "content": "Conteúdo para formatar..."
    }
  ],
  "temperature": 0.15
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "{\"title\": \"...\", \"module\": \"...\"}"
      }
    }
  ]
}
```

---

### 3. **Copilot API** (Alternativa)

**Endpoint:**
```
POST https://api.openai.com/v1/chat/completions
```

**Diferença:**
- Mesma interface OpenAI
- Autenticação via `COPILOT_API_KEY` ao invés de `OPENAI_API_KEY`
- Endpoint customizável em `.env`

---

### 4. **Google Search** (Web Scraping)

**Endpoint (HTTP GET):**
```
https://www.google.com/search?q=site:share.linx.com.br termo
```

**Processo:**
1. Faz requisição HTTP
2. Recebe HTML do Google
3. Parse HTML com Cheerio
4. Extrai links de `div.g`, `div[data-sokoban-container]`
5. Filtra apenas URLs do Share Linx
6. Retorna resultados

---

### 5. **DuckDuckGo** (Web Scraping)

**Endpoint (HTTP GET):**
```
https://duckduckgo.com/html/?q=site:share.linx.com.br termo
```

**Processo:**
Semelhante ao Google, mas com seletores CSS diferentes

---

## 🔄 Atalhos de Teclado Implementados

| Atalho | Ação | Local |
|--------|------|-------|
| `Ctrl+F` | Localizar na página | Janela de artigo |
| `Ctrl+C` | Copiar texto selecionado | Janela de artigo |
| `Ctrl+X` | Recortar | Janela de artigo |
| `Ctrl+V` | Colar | Janela de artigo |
| `Ctrl+A` | Selecionar tudo | Janela de artigo |
| `Ctrl+R` | Recarregar página | Janela de artigo |
| `Ctrl+Shift+R` | Recarregar sem cache | Janela de artigo |
| `Alt+Left` | Voltar (navegação) | Janela de artigo |
| `Alt+Right` | Avançar (navegação) | Janela de artigo |
| `F12` | Abrir DevTools (debug) | Janela de artigo |

---

## 🚀 Como Funciona Passo a Passo - Exemplo Prático

### Cenário: Buscar e formatar "Devolução de compra"

**PASSO 1: Iniciar Aplicação**
```bash
npm start
```
- Electron inicia
- `app.whenReady()` executa
- `createWindow()` é chamada
- Abre `index.html`
- `renderer.js` carrega

**PASSO 2: Usuário Digita Busca**
```
Usuário: Escreve "Devolução de compra" no input
Renderer: Detecta entrada e clica em "Buscar"
```

**PASSO 3: Backend Recebe Busca (IPC)**
```javascript
// renderer.js
window.ipc.invoke('search-google', 'Devolução de compra')

// main.js
ipcMain.handle('search-google', async (event, termoBusca) => {
  // Tenta 3 estratégias...
  // Retorna: [
  //   { title: "Devolução Fácil...", url: "https://...", ... }
  // ]
})
```

**PASSO 4: Frontend Exibe Resultados**
```html
<div class="resultado">
  <h3>Devolução Fácil - Vendas</h3>
  <p>Para fazer devolução...</p>
  <a href="#" onclick="abreArtigo(url)">Visualizar</a>
</div>
```

**PASSO 5: Usuário Clica em Artigo**
```javascript
// renderer.js
function abreArtigo(url) {
  window.ipc.invoke('open-article-window', url, 'Devolução Fácil')
}

// main.js
ipcMain.handle('open-article-window', async (event, url, title) => {
  // Valida URL
  // Decodifica se for redirect
  // Chama createArticleWindow(url, title)
  // Nova janela abre
})
```

**PASSO 6: Nova Janela Carrega Artigo**
```
createArticleWindow() cria BrowserWindow
     │
     ▼
Carrega URL do artigo via childWindow.loadURL(url)
     │
     ▼
WebContents.on('did-finish-load')
     │
     ▼
Executa JavaScript para remover CSP restritivo
     │
     ▼
Exibe página completa do artigo
     │
     ▼
Menu com navegação e atalhos disponível
```

**PASSO 7: Usuário Clica "Usar Artigo Selecionado"**
```javascript
// renderer.js
window.ipc.invoke('extract-article-content', url)

// main.js
ipcMain.handle('extract-article-content', async (event, url) => {
  // axios.get(url)
  // cheerio.load(html)
  // Encontra #main-content
  // Remove lixo
  // Retorna conteúdo limpo
})
```

**PASSO 8: Conteúdo Extraído Exibido**
```
Frontend exibe preview:
"Para fazer uma devolução de compra, acesse o sistema...
Clique no menu de vendas...
"
```

**PASSO 9: Usuário Clica "Formatar com KCS"**
```javascript
// renderer.js
window.ipc.invoke('ask-ai', conteudoExtraido)

// main.js
ipcMain.handle('ask-ai', async (event, prompt) => {
  // smartParseContent(prompt)
  //   → Detecta tipo
  //   → Reorganiza em passos
  // 
  // openai.chat.completions.create({
  //   model: 'gpt-4o-mini',
  //   messages: [ system prompt, user content ]
  // })
  //
  // Retorna JSON KCS
})
```

**PASSO 10: Resultado Exibido**
```json
{
  "title": "Linx Microvix - Vendas - Como fazer devolução",
  "module": "Vendas",
  "description": "Para fazer uma devolução de compra acesse o sistema de vendas...",
  "cause": "Cliente necessita devolver produto",
  "solution": [
    "1. Acesse o sistema de vendas",
    "2. Clique no menu de vendas",
    "3. Selecione 'Devoluções'",
    "4. Informe o número do pedido",
    "5. Confirme a solicitação"
  ],
  "links": ["https://share.linx.com.br/pages/..."],
  "tags": ["devolução", "vendas", "compra", "produto"]
}
```

**PASSO 11: Usuário Copia Resultado**
```javascript
// Frontend tem botão "Copiar JSON"
// Copia texto para clipboard
// Usuário cola onde precisar
```

---

## 🔐 Segurança

### Context Isolation
```javascript
webPreferences: {
  contextIsolation: true,  // Isola contexto
  nodeIntegration: false,  // Bloqueia acesso ao Node.js
  sandbox: false,          // Para debug (reativar em produção)
  preload: path.join(__dirname, 'preload.js')
}
```

### Content Security Policy (CSP)
- Removida deliberadamente em janelas de artigo
- Motivo: Permitir visualização de conteúdo externo
- ⚠️ Apenas para URLs confiáveis (Share Linx)

### Variáveis de Ambiente
- Armazenadas em `.env`
- Carregadas via `dotenv`
- Nunca expostas ao frontend
- Gitignore para não fazer commit

---

## 📝 Resumo das Conexões

```
┌─────────────────────────────────────────────────────────┐
│                  APLICAÇÃO COMPLETA                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend (renderer.js)                                 │
│  • HTML: index.html                                     │
│  • CSS: styles.css                                      │
│  • JS: renderer.js                                      │
│  └─ Captura eventos do usuário                         │
│     └─ Envia via IPC (preload.js como bridge)          │
│                                                         │
│  Backend (main.js)                                      │
│  • Recebe via IPC handlers                             │
│  • Processa requisições                                 │
│  • Chama APIs externas (axios)                         │
│  • Faz parsing HTML (cheerio)                          │
│  • Chama IA (openai SDK)                               │
│  └─ Retorna resultados via IPC                         │
│                                                         │
│  Janelas:                                               │
│  • Main: Busca + Interface                             │
│  • Child: Visualização de artigos                      │
│  └─ Comunicação via Events/IPC                         │
│                                                         │
│  Dados:                                                 │
│  • .env: Configuração sensível                         │
│  • package.json: Dependências                          │
│  • node_modules: Bibliotecas                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎓 Conclusão

O **KCS Formatter** é uma aplicação completa que:

1. ✅ Busca inteligentemente em múltiplas fontes
2. ✅ Extrai conteúdo de forma robusta
3. ✅ Estrutura automaticamente conteúdo heterogêneo
4. ✅ Formata usando IA conforme metodologia KCS
5. ✅ Oferece interface intuitiva e responsiva
6. ✅ Implementa segurança adequada

**Conceitos-chave aprendidos:**
- Electron para aplicações desktop
- Arquitetura Main/Renderer
- IPC para comunicação entre processos
- Web scraping com Cheerio
- Integração com APIs REST
- Processamento inteligente de conteúdo
- Uso de IA para formatação automática

---

**Versão:** 3.0.3  
**Última atualização:** Novembro 2025  
**Autor:** Equipe Mestre dos Brabos - Linx Microvix
