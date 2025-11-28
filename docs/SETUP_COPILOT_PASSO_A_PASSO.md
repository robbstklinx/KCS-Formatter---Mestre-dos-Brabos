# ⚡ Guia Prático: Ativar Copilot no KCS Formatter

**Versão**: 3.0.5  
**Tempo**: ~10 minutos  
**Dificuldade**: 🟢 Fácil

---

## 📋 Checklist Rápido

- [ ] Ter token Copilot da empresa
- [ ] Criar arquivo `.env` em `src/`
- [ ] Adicionar token ao `.env`
- [ ] Reiniciar aplicação
- [ ] Testar com texto de exemplo
- [ ] Verificar console para erros

---

## 🚀 Passo 1: Obter Token Copilot

### **Onde obter?**
- Contactar seu gerente de TI / Suporte técnico
- Ou acessar: GitHub Copilot (sua conta empresarial)
- Token começa com: `ghp_` ou similar

### **Exemplo de token (FALSO):**
```
ghp_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7
```

---

## 💾 Passo 2: Criar Arquivo `.env`

### **Localização exata:**
```
c:\Users\[seu_usuario]\OneDrive - Linx SA\Área de Trabalho\Projects\
Formatador KCS\kcs_formatter_app\src\.env
                                    ↑
                                  AQUI!
```

### **Opção A: PowerShell (Recomendado)**

```powershell
# 1. Abrir PowerShell
# 2. Navegar até a pasta
cd "c:\Users\jose.mcorreia\OneDrive - Linx SA\Área de Trabalho\Projects\Formatador KCS\kcs_formatter_app\src"

# 3. Criar arquivo vazio
New-Item .env

# 4. Abrir com editor
notepad .env
```

### **Opção B: VS Code (Alternativa)**

1. Abrir VS Code
2. Ir em File → Open Folder
3. Navegar até `src/`
4. New File → `.env`
5. Escrever conteúdo (ver abaixo)

---

## ✏️ Passo 3: Escrever Conteúdo do `.env`

### **Abrir arquivo `.env` que criou**

**Copie E COLE uma das opções:**

### **OPÇÃO 1: Usar Copilot (RECOMENDADO)**

```env
# GitHub Copilot (Empresa)
COPILOT_API_KEY=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
COPILOT_ENDPOINT=https://api.openai.com/v1
```

**O que fazer:**
1. Copiar linhas acima
2. Colar no arquivo `.env`
3. **SUBSTITUIR** `ghp_XXXX...` pelo **seu token real**
4. Salvar (Ctrl+S)

---

### **OPÇÃO 2: Usar OpenAI (se tiver chave)**

```env
# OpenAI (Pago)
OPENAI_API_KEY=sk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**O que fazer:**
1. Copiar linha acima
2. Colar no arquivo `.env`
3. **SUBSTITUIR** `sk_XXXX...` pelo **seu token real**
4. Salvar (Ctrl+S)

---

### **OPÇÃO 3: Ambos (Fallback)**

```env
# GitHub Copilot (Empresa - Primário)
COPILOT_API_KEY=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
COPILOT_ENDPOINT=https://api.openai.com/v1

# OpenAI (Backup - se Copilot falhar)
OPENAI_API_KEY=sk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 🔑 Onde Colocar o Token

**Exemplo completo (SEM dados reais):**

```env
COPILOT_API_KEY=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
COPILOT_ENDPOINT=https://api.openai.com/v1
```

**O que cada linha faz:**
- **Linha 1**: Chave de acesso Copilot (obtém da empresa)
- **Linha 2**: URL do servidor da API (sempre igual)

---

## ⚙️ Passo 4: Reiniciar a Aplicação

### **Parar a app:**
```powershell
# Se está rodando, aperte:
Ctrl + C
```

### **Iniciar novamente:**
```powershell
cd "c:\Users\jose.mcorreia\OneDrive - Linx SA\Área de Trabalho\Projects\Formatador KCS\kcs_formatter_app"
npm start
```

**Esperado:**
```
> kcs-formatter@3.0.5 start
> electron .

OpenAI API Key carregada: ✗ Não
Copilot API Key carregada: ✓ Sim           ← ✅ BINGO!
Share API URL carregada: ✗ Não
Share API Key carregada: ✗ Não
✓ Usando Copilot como provider de IA      ← ✅ CONFIRMADO!
```

---

## 🧪 Passo 5: Teste Prático

### **1. Abrir DevTools**
- Pressione: `F12`
- Aba: "Console"

### **2. Digitar Texto no Editor**
```
Como criar um usuário no módulo de RH?

Procedimento:
1. Acesse o módulo de RH
2. Clique em "Novo Usuário"
3. Preencha:
   - Nome completo
   - Email corporativo
   - Departamento
4. Clique em "Salvar"
```

### **3. Clicar "Formatar com IA"**
- Procure pelo botão verde "Formatar com IA"
- Clique

### **4. Monitorar Console**
Você deve ver:

```
📤 Enviando prompt para IA (primeiros 100 caracteres): Como criar um usuário...

📊 Análise: Módulo=RH, Qualidade=85%, Tags=4, URLs=0

📥 Resposta recebida da IA (primeiros 150 chars): {
  "title": "Linx Microvix - RH - Como criar um usuário"...

✅ Validação KCS: APROVADO

❌ Erros: [] (nenhum)

⚠️ Avisos: [] (nenhum)
```

### **5. Verificar se Funcionou**
- [ ] Campos do formulário preenchidos?
- [ ] Preview atualizado?
- [ ] Nenhum erro vermelho no console?

Se tudo OK → ✅ **FUNCIONANDO!**

---

## ⚠️ Troubleshooting

### **Problema: "Nenhuma chave de IA configurada"**

**Causa:**
- `.env` não foi criado
- `.env` está em local errado
- `.env` está vazio

**Solução:**
```powershell
# Verificar se arquivo existe
Test-Path "src\.env"

# Se False, criar novamente
# Se True, verificar conteúdo
Get-Content "src\.env"
```

---

### **Problema: "401 Unauthorized"**

**Causa:**
- Token inválido
- Token expirou
- Token é de outra pessoa

**Solução:**
1. Confirmar token com TI
2. Substituir no `.env`
3. Reiniciar app

---

### **Problema: "Timeout" ou Sem Resposta**

**Causa:**
- Problema de conexão
- Servidor da API fora
- Prompt muito grande

**Solução:**
1. Testar conexão: `ping api.openai.com`
2. Usar texto menor (< 5000 caracteres)
3. Reiniciar app

---

### **Problema: "JSON Inválido"**

**Causa:**
- IA retornou texto não-JSON
- Prompt confuso demais

**Solução:**
- Função `fixKCSJson()` tenta corrigir
- Se ainda falhar, verificar console para mensagem exata
- Contatar suporte se persistir

---

## 📸 Screenshots dos Passos

### **Passo 2: Criar `.env`**
```
Pasta: src
├── formatter.js
├── main.js
├── renderer.js
├── kcs-validator.js
├── kcs-helpers.js
├── .env          ← CRIAR AQUI
└── public/
```

### **Passo 3: Conteúdo `.env`**
```
[.env]

COPILOT_API_KEY=ghp_XXXX...
COPILOT_ENDPOINT=https://api.openai.com/v1
```

### **Passo 4: Terminal**
```powershell
PS C:\...\kcs_formatter_app> npm start

✓ Usando Copilot como provider de IA
```

### **Passo 5: Console (F12)**
```
📤 Enviando prompt para IA...
📊 Análise: Módulo=..., Qualidade=...
📥 Resposta recebida da IA...
✅ Validação KCS: APROVADO
```

---

## 🎓 Conceitos

### **O que é `.env`?**
- Arquivo de configuração
- Armazena senhas/chaves
- **NUNCA** fazer commit no Git (veja `.gitignore`)
- Variáveis de ambiente locais

### **Por que `.env` em `src/`?**
- `main.js` está em `src/`
- Arquivo `.env` é procurado na mesma pasta
- Código: `dotenv.config({ path: path.join(__dirname, '.env') })`

### **O que é Copilot?**
- IA da GitHub/Microsoft
- Usa modelo OpenAI (gpt-4o-mini)
- Acesso via empresa
- **Sem cobranças** por token

---

## ✅ Checklist Final

Antes de usar em produção:

- [ ] `.env` criado em `src/`
- [ ] Token Copilot adicionado
- [ ] `npm start` executado
- [ ] Console mostra "Usando Copilot"
- [ ] Teste funciona (recebe resposta JSON)
- [ ] Validação passa (JSON válido)
- [ ] Formulário preenche automaticamente
- [ ] Preview atualiza

---

## 📞 Suporte

Se tiver dúvidas:

1. **Verificar console** (F12) para erros exatos
2. **Ler `ANALISE_LOGICA_IA.md`** para entender fluxo
3. **Consultar `GUIA_GIT_COMPLETO.md`** para problemas com código

---

## 🚀 Próximos Passos

Após ativar Copilot:

1. Compartilhar `.env` **SEGURAMENTE** com time (via 1Password, LastPass, etc)
2. Atualizar documentação com chave configurada
3. Treinar Isabelly no fluxo
4. Usar em produção!

---

**Versão**: 3.0.5  
**Status**: ✅ Pronto  
**Tempo**: 10 minutos  
**Risco**: Baixo (apenas variáveis de ambiente)
