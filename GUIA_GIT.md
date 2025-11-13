# 📚 Guia Didático: Subir Projeto do KCS Formatter para o Git

## 🎯 Objetivo
Colocar o projeto "KCS Formatter - Mestre dos Brabos" em um repositório Git da sua organização no GitHub, configurando branches e começando com commits organizados.

---

## 📋 Pré-requisitos

### ✅ Checklist antes de começar:
- [ ] Git instalado no Windows (https://git-scm.com/download/win)
- [ ] Conta GitHub com permissão na organização
- [ ] Organização criada no GitHub
- [ ] Terminal PowerShell aberto

### 🔧 Verificar instalação do Git:
```powershell
git --version
```
**Deve retornar algo como:** `git version 2.43.0.windows.1`

---

## 🚀 Passo a Passo

### **PASSO 1: Criar o Repositório no GitHub**

1. Acesse: https://github.com/organizations/[sua-organizacao]/repositories
2. Clique em **"New"** (botão verde)
3. Preencha:
   - **Repository name:** `kcs-formatter-app` (ou `kcs-formatter` - sem espaços, use hífen)
   - **Description:** `KCS Formatter - Mestre dos Brabos - Electron app for formatting knowledge articles`
   - **Visibility:** `Private` (para proteger o código) ou `Public` (conforme política)
   - **Initialize this repository with:**
     - ✅ Add a README file
     - ✅ Add .gitignore (selecione: **Node**)
     - ✅ Choose a license (sugestão: **MIT**)
4. Clique em **"Create repository"**

**Resultado:** GitHub criou um repositório vazio pronto para receber seu código.

---

### **PASSO 2: Configurar Git Localmente (Primeira Vez)**

Execute estes comandos **uma única vez** no seu computador:

```powershell
# Configure seu nome e email global
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@empresa.com"

# Verifique se funcionou
git config --global --list
```

**Deve mostrar:**
```
user.name=Seu Nome
user.email=seu.email@empresa.com
```

---

### **PASSO 3: Inicializar Git no Projeto Local**

Navegue até a pasta do projeto e execute:

```powershell
# Entre na pasta do projeto
cd 'c:\Users\jose.mcorreia\OneDrive - Linx SA\Área de Trabalho\Projects\Formatador KCS\kcs_formatter_app_3.0'

# Inicialize um novo repositório Git
git init

# Verifique o status
git status
```

**Resultado esperado:**
```
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        ...seus arquivos...
```

---

### **PASSO 4: Criar arquivo `.gitignore` (Se não existir)**

O `.gitignore` diz ao Git quais arquivos ignorar. Ele já deve ter sido criado pelo GitHub, mas vamos garantir:

Crie/atualize o arquivo `.gitignore` na raiz do projeto com:

```
# Dependências Node
node_modules/
npm-debug.log*
package-lock.json

# Variáveis de ambiente
.env
.env.local

# Arquivos do Electron
dist/
out/
*.exe

# Cache e temporários
.DS_Store
Thumbs.db
*.swp
*.swo

# IDEs
.vscode/
.idea/
*.sublime-project

# Logs
logs/
*.log
```

---

### **PASSO 5: Adicionar Arquivos ao Git (First Commit)**

```powershell
# Adicione todos os arquivos rastreáveis
git add .

# Verifique o que será commitado
git status

# Crie o primeiro commit
git commit -m "feat: initial project setup - KCS Formatter v3.0.0"
```

**Mensagem esperada:**
```
[master (root-commit) abc1234] feat: initial project setup - KCS Formatter v3.0.0
 42 files changed, 3425 insertions(+)
 create mode 100644 package.json
 ...
```

---

### **PASSO 6: Conectar ao Repositório Remoto (GitHub)**

Copie a URL do seu repositório no GitHub (botão verde **<> Code** → HTTPS):
- Exemplo: `https://github.com/sua-organizacao/kcs-formatter-app.git`

Execute:

```powershell
# Adicione o repositório remoto
git remote add origin https://github.com/sua-organizacao/kcs-formatter-app.git

# Verifique a conexão
git remote -v

# Deve mostrar:
# origin  https://github.com/sua-organizacao/kcs-formatter-app.git (fetch)
# origin  https://github.com/sua-organizacao/kcs-formatter-app.git (push)
```

---

### **PASSO 7: Fazer Upload para o GitHub (Push)**

```powershell
# Envie o código para o repositório remoto
git branch -M main

git push -u origin main
```

**Na primeira vez, pode pedir autenticação:**
- Use o **Personal Access Token (PAT)** do GitHub:
  1. GitHub → Settings → Developer settings → Personal access tokens
  2. Clique em **"Generate new token"**
  3. Marque: `repo`, `workflow`, `read:user`
  4. Copie o token (guardar em local seguro!)
  5. Cole como senha quando Git pedir

**Resultado:**
```
Enumerating objects: 42, done.
Counting objects: 100% (42/42), done.
...
To https://github.com/sua-organizacao/kcs-formatter-app.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🌿 Usando Branches (Fluxo de Trabalho)

### **Entendendo Branches**
- **`main`**: Código em produção (estável)
- **`develop`**: Código em desenvolvimento
- **`feature/xxx`**: Novas features
- **`bugfix/xxx`**: Correção de bugs

### **Criar uma Nova Branch para Desenvolvimento**

```powershell
# Crie e mude para uma nova branch
git checkout -b develop

# Envie a branch para o GitHub
git push -u origin develop
```

### **Fazer Commits Regulares**

Sempre que fizer alterações:

```powershell
# Veja o que mudou
git status

# Adicione os arquivos modificados
git add src/renderer.js src/main.js

# Ou adicione TUDO (cuidado!)
git add .

# Crie um commit com mensagem descritiva
git commit -m "fix: font size dropdown showing correct labels (small, normal, large, huge)"

# Envie para o GitHub
git push
```

### **Exemplo: Criar Feature Branch**

```powershell
# A partir da branch main/develop
git checkout main

# Crie uma nova branch para sua feature
git checkout -b feature/search-improvement

# Faça suas alterações, adicione e commit
git add .
git commit -m "feat: add timeout to search queries for better UX"

# Envie para GitHub
git push -u origin feature/search-improvement

# No GitHub, crie um Pull Request (PR):
# - Compare: feature/search-improvement → develop
# - Descreva as mudanças
# - Aguarde review
# - Faça merge
```

---

## 📝 Convenção de Commits (Semantic Commit)

Use esta convenção para mensagens claras:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### **Tipos:**
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **refactor**: Reorganização de código (sem mudanças de comportamento)
- **style**: Mudanças de formatação/estilo
- **docs**: Alterações em documentação
- **test**: Adição/modificação de testes
- **chore**: Atualizações de dependências, configuração, etc.

### **Exemplos:**
```
feat(search): add confluence API integration
fix(formatter): remove punctuation from titles
refactor(quill): simplify toolbar initialization
docs: update README with installation instructions
```

---

## 🔄 Fluxo de Trabalho Recomendado (Git Flow)

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│  1. Clone/Atualizar                                  │
│     git pull origin main                             │
│                                                       │
│  2. Criar Feature Branch                             │
│     git checkout -b feature/nova-feature             │
│                                                       │
│  3. Fazer Alterações + Commits Regulares             │
│     git add .                                        │
│     git commit -m "feat: describe your change"       │
│                                                       │
│  4. Enviar para GitHub                               │
│     git push origin feature/nova-feature             │
│                                                       │
│  5. Abrir Pull Request no GitHub                     │
│     Aguardar review, fazer ajustes se necessário     │
│                                                       │
│  6. Merge para Develop/Main                          │
│     git checkout develop                             │
│     git merge feature/nova-feature                   │
│     git push origin develop                          │
│                                                       │
│  7. Deletar Branch Local e Remota                    │
│     git branch -d feature/nova-feature               │
│     git push origin --delete feature/nova-feature    │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## 📚 Comandos Úteis do Git

```powershell
# Ver histórico de commits
git log
git log --oneline -5  # Últimos 5 commits em linha única

# Ver diferenças
git diff                 # Mudanças não commitadas
git diff HEAD~1          # Mudanças do último commit

# Ver branches
git branch               # Branches locais
git branch -a            # Todas as branches (local + remoto)

# Sincronizar com remoto
git pull origin main     # Baixar atualizações

# Desfazer mudanças
git checkout -- arquivo.js   # Descartar mudanças de 1 arquivo
git reset HEAD~1             # Desfazer último commit (mantém mudanças)

# Trocar de branch
git checkout main
git checkout develop
git switch feature/minha-feature  # Sintaxe mais nova
```

---

## ⚠️ Troubleshooting

### **"Permission denied (publickey)"**
- Você precisa configurar a chave SSH do GitHub
- Ou usar um Personal Access Token (PAT) em vez de HTTPS

### **"Your branch is behind 'origin/main'"**
```powershell
git pull origin main
```

### **"Merge conflict"**
Git vai avisar qual arquivo tem conflito. Abra o arquivo e procure por:
```
<<<<<<< HEAD
seu código
=======
código do remoto
>>>>>>> branch-name
```
Escolha qual manter, delete os marcadores e faça commit.

### **"Acidentalmente commitei na branch errada"**
```powershell
# Desfaça o commit mas mantenha as mudanças
git reset HEAD~1

# Mude para a branch correta
git checkout -b feature/correta

# Refaça o commit na branch correta
git add .
git commit -m "mensagem"
git push origin feature/correta
```

---

## 🎓 Resumo Rápido (Meu Workflow Diário)

```powershell
# Manhã: Começar nova tarefa
git checkout develop
git pull origin develop
git checkout -b feature/minha-tarefa

# Durante o dia: Salvar progresso
git add .
git commit -m "feat: implementar nova funcionalidade"
git push origin feature/minha-tarefa

# Fim do dia: Fazer PR e chamar para review
# (No GitHub: New Pull Request → Descrever → Create PR)

# Depois de aprovado: Merge
git checkout develop
git pull origin develop
git merge feature/minha-tarefa
git push origin develop

# Limpar
git branch -d feature/minha-tarefa
git push origin --delete feature/minha-tarefa
```

---

## 🚀 Próximos Passos

1. ✅ Criar repositório no GitHub
2. ✅ Fazer primeiro push do projeto
3. ✅ Criar branch `develop` para desenvolvimento
4. ✅ Começar a trabalhar com branches de features
5. 🎯 Configurar proteção de branches (Settings → Branches)
6. 🎯 Adicionar automação com GitHub Actions (CI/CD)

---

## 📞 Dúvidas Comuns

**P: Preciso fazer um commit a cada mudança pequena?**
R: Não obrigatoriamente, mas é bom fazer commits lógicos (uma feature completa ou um fix completo por commit).

**P: Posso deletar branches do GitHub?**
R: Sim! Depois de fazer merge, delete a branch remota para manter o repositório limpo.

**P: Como voltar para um commit anterior?**
R: Use `git reset` (local) ou `git revert` (cria um novo commit desfazendo as mudanças).

**P: É normal ter conflitos?**
R: Sim! É parte do trabalho em equipe. Use as ferramentas do VS Code para resolver.

---

**Sucesso com seu repositório! 🎉**
