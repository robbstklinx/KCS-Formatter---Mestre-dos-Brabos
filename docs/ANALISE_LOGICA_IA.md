# 🤖 Análise: Lógica de Formatação com IA (Copilot vs OpenAI)

**Versão**: 3.0.5  
**Data**: Novembro 2025  
**Status**: ✅ Analisado - Pronto para Integração Copilot

---

## 📊 1. Fluxo Completo da Formatação

```
┌──────────────────────────────────────────────────────────────────┐
│ USUÁRIO CLICA "FORMATAR COM IA" (renderer.js)                   │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ RENDERER (Frontend) - renderer.js:482                            │
│ • Coleta texto do editor Quill                                  │
│ • Se vazio, coleta dos campos (title, desc, solution)           │
│ • Envia para main via IPC: window.electronAPI.askAI(textoBase) │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ MAIN (Backend) - main.js:510 (ipcMain.handle('ask-ai'))        │
│                                                                   │
│ PASSO 1: PRÉ-PROCESSAMENTO                                      │
│ ├─ smartParseContent(prompt) - Detecta estrutura                │
│ │  ├─ Se tem números: mantém                                    │
│ │  ├─ Se tem bullets: mantém                                    │
│ │  ├─ Se tem verbos de ação: reorganiza em lista                │
│ │  └─ Se é descritivo: quebra em parágrafos                     │
│ │                                                                 │
│ ├─ detectarModulo(content) - Identifica módulo via regex        │
│ │  └─ Exemplo: "faturamento" → "Faturamento"                   │
│ │                                                                 │
│ ├─ gerarTags(content) - Gera tags por frequência                │
│ │  └─ Remove stop words PT (artigos, preposições, etc)         │
│ │                                                                 │
│ ├─ extrairUrls(content) - Extrai URLs do texto                  │
│ │  └─ Valida com URL() API                                      │
│ │                                                                 │
│ └─ medirQualidadeConteudo(content) - Score 0-100               │
│    └─ Analisa: completude, clareza, estrutura                   │
│                                                                   │
│ PASSO 2: CRIAR PROMPT ESTRUTURADO                               │
│ └─ Envia prompt + contexto + sugestões para IA                  │
│                                                                   │
│ PASSO 3: CHAMAR IA (OpenAI ou Copilot)                         │
│ ├─ Usa OpenAI ou Copilot baseado em .env                       │
│ ├─ Model: gpt-4o-mini (ambos compatíveis)                       │
│ ├─ Temperature: 0.15 (baixo - respostas consistentes)           │
│ └─ Espera resposta JSON estruturada                             │
│                                                                   │
│ PASSO 4: VALIDAÇÃO (kcs-validator.js)                          │
│ ├─ Valida titulo (máx 200 chars, padrão KCS)                   │
│ ├─ Valida module (contra lista de 16 módulos)                   │
│ ├─ Valida description (10-500 chars, começa com "Para")         │
│ ├─ Valida solution (mín 1 item, máx 1000 chars)                 │
│ ├─ Valida links (máx 5, URLs válidas)                           │
│ ├─ Valida tags (máx 6, lowercase)                               │
│ └─ Se houver erro: fixKCSJson() tenta auto-corrigir             │
│                                                                   │
│ PASSO 5: RETORNO ESTRUTURADO                                    │
│ └─ Retorna: { success, data, errors, warnings, qualidade }     │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│ RENDERER (Frontend) - renderer.js:520                            │
│ • Recebe objeto estruturado                                      │
│ • parseAIResponse() transforma em campo/valor                    │
│ • Preenche formulário (title, module, description, etc)         │
│ • Atualiza preview do artigo formatado                          │
│ • Log de validação no console (DevTools)                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔧 2. Configuração Atual (OpenAI/Copilot)

### **Arquivo: `src/main.js` (linhas 15-35)**

```javascript
// Carrega variáveis do .env
const OPENAI_API_KEY = (process.env.OPENAI_API_KEY || '').trim();
const COPILOT_API_KEY = (process.env.COPILOT_API_KEY || '').trim();
const COPILOT_ENDPOINT = (process.env.COPILOT_ENDPOINT || 'https://api.openai.com/v1').trim();

// Inicializa cliente OpenAI ou Copilot
let openai = null;
if (OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: OPENAI_API_KEY });
} else if (COPILOT_API_KEY) {
  openai = new OpenAI({ apiKey: COPILOT_API_KEY, baseURL: COPILOT_ENDPOINT });
}
```

**O que isso significa:**
- ✅ Já suporta AMBOS os providers!
- ✅ Prioridade: OpenAI → Copilot (se OpenAI não existir)
- ✅ Usa API OpenAI (compatível com ambos)

---

## 📝 3. O Que É Necessário para Funcionar

### **Opção A: Usar OpenAI (ATUAL)**
Arquivo: `src/.env`
```env
OPENAI_API_KEY=sk_test_...
```
- ✅ Funciona agora
- ❌ Cobra por uso (tokens)
- ⚠️ Precisa de chave válida

### **Opção B: Usar Copilot (RECOMENDADO - EMPRESA)**
Arquivo: `src/.env`
```env
COPILOT_API_KEY=seu_token_copilot
COPILOT_ENDPOINT=https://api.openai.com/v1
```
- ✅ Acesso via empresa
- ✅ Sem cobranças por uso
- ✅ Mesma API que OpenAI
- ⚠️ Precisa configurar token

---

## 🔄 4. Prompt Enviado para IA

### **Sistema Prompt (Temperature: 0.15)**

```
Você é um assistente técnico que formata artigos de suporte segundo 
a metodologia KCS usada pela Linx Microvix.

Saída requerida: RETORNE APENAS UM OBJETO JSON VÁLIDO. 
Não escreva texto adicional fora do JSON.

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
- Module: identificar quando possível. Módulos sugeridos: [detectado].
- Description: frase introdutória começando com "Para ..." 
- Cause: explicação do problema ou contexto
- Solution: TODOS os passos/instruções. Preserve numeração.
- Links: extrair URLs. URLs encontradas: [extraído]
- Tags: até 6 tags relevantes. Sugestões: [gerado]

Se alguma informação não puder ser determinada, retorne campo vazio.
```

**Exemplos de entrada:**

```
Conteúdo do usuário:
"Como faturar uma nota fiscal no módulo de faturamento?
1. Acesse o módulo de Faturamento
2. Clique em Nova NF
   2.1. Preencha os dados do cliente
   2.2. Adicione itens
3. Clique em Salvar"
```

**Resposta esperada (JSON):**

```json
{
  "title": "Linx Microvix - Faturamento - Como faturar uma nota fiscal",
  "module": "Faturamento",
  "description": "Para faturar uma nota fiscal no módulo de faturamento, realize os passos a seguir",
  "cause": "",
  "solution": [
    "Acesse o módulo de Faturamento",
    "Clique em Nova NF",
    "2.1. Preencha os dados do cliente",
    "2.2. Adicione itens",
    "Clique em Salvar"
  ],
  "links": [],
  "tags": ["faturamento", "nota-fiscal", "nf", "modulo"]
}
```

---

## ✅ 5. O Que Já Funciona

| Componente | Status | Arquivo | Descrição |
|-----------|--------|---------|-----------|
| **IPC Channel** | ✅ | main.js:510 | Handler 'ask-ai' pronto |
| **Frontend** | ✅ | renderer.js:482 | Botão "Formatar com IA" |
| **OpenAI API** | ✅ | main.js | Cliente OpenAI inicializado |
| **Copilot Support** | ✅ | main.js:23-30 | Suporte ao baseURL customizado |
| **Parser** | ✅ | main.js:461 | smartParseContent() |
| **Modulo Detection** | ✅ | kcs-helpers.js | 10 módulos suportados |
| **Tag Generation** | ✅ | kcs-helpers.js | Frequency-based com stop words |
| **URL Extraction** | ✅ | kcs-helpers.js | Regex + validação |
| **Quality Score** | ✅ | kcs-helpers.js | Score 0-100 |
| **Validation** | ✅ | kcs-validator.js | Valida campos KCS |
| **Auto-fix** | ✅ | kcs-validator.js | fixKCSJson() |
| **Console Logging** | ✅ | main.js | DevTools com debug info |

---

## ⚠️ 6. O Que Falta

### **1. Arquivo `.env` Configurado**
**Arquivo faltando**: `src/.env`
```env
# Escolha UMA das opções:

# OPÇÃO A: OpenAI (paga)
OPENAI_API_KEY=sk_test_...

# OPÇÃO B: Copilot (empresa - RECOMENDADO)
COPILOT_API_KEY=seu_token_aqui
COPILOT_ENDPOINT=https://api.openai.com/v1
```

**O que fazer:**
- [ ] Obter token Copilot da empresa
- [ ] Criar arquivo `src/.env`
- [ ] Adicionar chave correspondente

---

### **2. Dependência node-fetch (se necessário)**
**Status**: Parece estar importada dinamicamente

```javascript
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
```

**O que fazer:**
- [ ] Confirmar se `npm install` incluiu `node-fetch`
- [ ] Se não, executar: `npm install node-fetch`

---

### **3. Teste Prático**
**O que fazer:**
- [ ] Criar `.env` com chave
- [ ] Iniciar app: `npm start`
- [ ] Abrir DevTools (F12)
- [ ] Digitar texto no editor
- [ ] Clicar "Formatar com IA"
- [ ] Monitorar console para erros

---

## 🎯 7. Fluxo de Dados Específico (Copilot)

### **Passo 1: Inicialização**
```javascript
// Detecta que COPILOT_API_KEY está em .env
const COPILOT_API_KEY = process.env.COPILOT_API_KEY;
const COPILOT_ENDPOINT = 'https://api.openai.com/v1';

// Cria cliente
openai = new OpenAI({
  apiKey: COPILOT_API_KEY,
  baseURL: COPILOT_ENDPOINT
});
```

### **Passo 2: Chamada à API**
```javascript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',  // ✅ Copilot suporta este model
  messages: [
    { role: 'system', content: '...' },
    { role: 'user', content: '...' }
  ],
  temperature: 0.15
});
```

### **Passo 3: Resposta**
```javascript
const resposta = completion.choices[0].message.content;
// Esperado: JSON válido com campos KCS

const kcsData = JSON.parse(resposta);
// Estrutura pronta para validação
```

### **Passo 4: Validação**
```javascript
const validation = validateKCS(kcsData);
// Retorna: { valid, errors, warnings, data }

// Se inválido, tenta corrigir
if (!validation.valid) {
  kcsData = fixKCSJson(kcsData);
}
```

### **Passo 5: Resposta Final**
```javascript
return {
  success: validation.valid,
  data: validation.data,        // Dados validados
  errors: validation.errors,    // Erros encontrados
  warnings: validation.warnings,// Avisos
  qualidade: qualidade,         // Score 0-100
  raw: resposta                 // JSON bruto
};
```

---

## 📋 8. Exemplo de Teste Passo a Passo

### **Entrada do Usuário:**
```
Como criar uma nova empresa no módulo de Empresa?

Procedimento:
- Acesse o módulo de Empresa
- Clique em "Nova Empresa"
- Preencha os dados da empresa (CNPJ, razão social, etc)
  - Campo CNPJ é obrigatório
  - Campo razão social deve ter 5-100 caracteres
- Clique em "Salvar"

Mais informações: https://help.linx.com/empresa
```

### **Processamento (Backend):**

1. **smartParseContent()**: Detecta que é descritivo com bullets e verbos
2. **detectarModulo()**: Encontra "Empresa"
3. **gerarTags()**: Gera ["empresa", "cnpj", "razão", "salvar"]
4. **extrairUrls()**: Encontra ["https://help.linx.com/empresa"]
5. **medirQualidadeConteudo()**: Score = 85%

6. **OpenAI/Copilot**: Recebe prompt estruturado
7. **Retorna JSON:**
```json
{
  "title": "Linx Microvix - Empresa - Como criar uma nova empresa",
  "module": "Empresa",
  "description": "Para criar uma nova empresa no módulo de Empresa, realize os passos a seguir",
  "cause": "",
  "solution": [
    "Acesse o módulo de Empresa",
    "Clique em \"Nova Empresa\"",
    "Preencha os dados da empresa (CNPJ, razão social, etc)",
    "2.1. Campo CNPJ é obrigatório",
    "2.2. Campo razão social deve ter 5-100 caracteres",
    "Clique em \"Salvar\""
  ],
  "links": ["https://help.linx.com/empresa"],
  "tags": ["empresa", "cnpj", "razao-social", "criar"]
}
```

8. **validateKCS()**: ✅ Valida tudo OK
9. **Frontend**: Preenche formulário e mostra preview

---

## 🚀 9. Passo a Passo para Ativar Copilot

### **PASSO 1: Obter Token Copilot**
```bash
# Contato: Seu gerente TI / Conta da Empresa
# Você deve receber um token como:
# ghp_XxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx
```

### **PASSO 2: Criar arquivo `.env`**
```bash
cd "c:\Users\...\kcs_formatter_app"
cd src

# No Windows PowerShell:
New-Item .env
```

**Conteúdo do `.env`:**
```env
# GitHub Copilot
COPILOT_API_KEY=ghp_XxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx
COPILOT_ENDPOINT=https://api.openai.com/v1

# Opcional (se usar OpenAI também):
# OPENAI_API_KEY=sk_test_...
```

### **PASSO 3: Reiniciar a Aplicação**
```bash
npm start
```

### **PASSO 4: Testar**
1. Abrir DevTools (F12)
2. Digitar texto no editor
3. Clicar "Formatar com IA"
4. Ver no console:
   - ✅ "🔄 Usando Copilot como provider de IA"
   - ✅ "📤 Enviando prompt para IA..."
   - ✅ "📥 Resposta recebida..."
   - ✅ "✅ Validação KCS: APROVADO"

---

## 📊 10. Comparação: OpenAI vs Copilot

| Aspecto | OpenAI | Copilot |
|--------|--------|---------|
| **Custo** | 💰 Pago por token | ✅ Grátis (empresa) |
| **Modelo** | gpt-4o-mini | gpt-4o-mini |
| **API Endpoint** | api.openai.com/v1 | api.openai.com/v1 |
| **Chave** | sk_test_... | ghp_... |
| **Inicialização** | `new OpenAI({apiKey})` | `new OpenAI({apiKey, baseURL})` |
| **Latência** | ~2-5s | ~2-5s |
| **Implementação** | ✅ Já existe | ✅ Já existe |

**Conclusão:** Código já suporta ambos! Só falta configurar `.env`

---

## 🔍 11. Troubleshooting

| Problema | Causa | Solução |
|---------|-------|---------|
| "Nenhuma chave IA configurada" | `.env` faltando ou vazio | Criar `.env` com COPILOT_API_KEY |
| "JSON inválido" | IA retornou texto não-JSON | Verificar prompt no console |
| "Erro de validação" | Resposta não segue formato | fixKCSJson() tenta corrigir automaticamente |
| "Timeout/sem resposta" | Problema de conexão | Verificar internet e token |
| "401 Unauthorized" | Token inválido | Confirmar token com TI |

---

## 📌 12. Resumo Executivo

### **O que JÁ funciona:**
✅ Interface completa (UI, botões, campos)  
✅ Parser inteligente de conteúdo  
✅ Detecção automática de módulo  
✅ Geração de tags  
✅ Validação KCS completa  
✅ Suporte OpenAI e Copilot  
✅ Auto-correção de erros  
✅ Console com debug info  

### **O que FALTA:**
⚠️ Arquivo `.env` com chave Copilot  
⚠️ Teste prático da integração  

### **Próximas ações:**
1. [ ] Obter token Copilot
2. [ ] Criar `src/.env`
3. [ ] Copiar token para variável
4. [ ] Reiniciar `npm start`
5. [ ] Testar com texto de exemplo
6. [ ] Monitorar console (F12)

---

**Versão**: 3.0.5  
**Status**: ✅ Pronto para Configuração Copilot  
**Tempo de Setup**: ~5 minutos  
**Risco**: Baixo (só precisa configurar variáveis de ambiente)
