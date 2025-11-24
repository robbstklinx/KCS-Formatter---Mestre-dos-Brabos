# 🚀 Guia: Como Compartilhar o Projeto no Git com a Isa

Este guia explica como colocar o projeto em um repositório Git (GitHub, GitLab, etc) para que a Isa possa baixar, revisar e fazer ajustes no frontend.

---

## 📋 Pré-requisitos

Antes de começar, garanta que:

- ✅ Git instalado (`git --version`)
- ✅ Conta no GitHub/GitLab/Gitea
- ✅ SSH key configurada (ou token de acesso)
- ✅ Isa também tem uma conta e acesso ao repositório

---

## 🔑 Passo 1: Configurar SSH (Recomendado)

### No seu computador (você):

```bash
# Gerar SSH key (se não tiver)
ssh-keygen -t ed25519 -C "seu.email@example.com"

# Copiar a chave pública
cat ~/.ssh/id_ed25519.pub
```

### No GitHub (settings → SSH keys → New SSH key):

```
Cole a chave pública gerada acima
```

---

## 📦 Passo 2: Criar Repositório Remoto

### Opção A: GitHub (Recomendado)

1. **No GitHub** (https://github.com/novo):
   - Clique em **"New repository"**
   - Nome: `kcs-formatter-app`
   - Descrição: "Aplicação Electron para formatação KCS"
   - Private (se for privado, compartilhe com Isa)
   - ✅ Clique "Create repository"

2. **Copie a URL SSH**:
   ```
   git@github.com:seu-usuario/kcs-formatter-app.git
   ```

### Opção B: GitLab/Gitea

Similar ao GitHub, com URL diferente.

---

## 🔗 Passo 3: Conectar Repositório Local ao Remoto

No seu terminal (pasta do projeto):

```bash
cd "c:\Users\jose.mcorreia\OneDrive - Linx SA\Área de Trabalho\Projects\Formatador KCS\kcs_formatter_app_3.0"

# Ver remoto atual (deve estar vazio)
git remote -v

# Adicionar remoto
git remote add origin git@github.com:seu-usuario/kcs-formatter-app.git

# Verificar
git remote -v
# Deve mostrar: origin (fetch) e origin (push)
```

---

## 📤 Passo 4: Fazer o Primeiro Push

### Opção 1: Se estiver na branch `main`

```bash
# Verificar branch atual
git branch

# Fazer o push
git push -u origin main
```

### Opção 2: Se estiver na branch `feature/kcs-enhancements`

```bash
# Fazer push da branch de feature
git push -u origin feature/kcs-enhancements

# Também fazer push da main (versão estável)
git checkout main
git push -u origin main
```

**Resultado esperado**:
```
✅ Enumerating objects: ...
✅ Writing objects: ...
✅ Create pull request at: https://github.com/seu-usuario/kcs-formatter-app
```

---

## 👥 Passo 5: Compartilhar com Isa

### 1️⃣ Dar acesso ao repositório

**No GitHub** (Settings → Collaborators):
- Clique "Add people"
- Insira o username da Isa
- Role de acesso: **Collaborator** (pode fazer commits e push)

### 2️⃣ Isa recebe convite

Isa receberá um email com convite para colaborar.

### 3️⃣ Isa clona o repositório

Isa executa no terminal dela:

```bash
# Clonar o repositório
git clone git@github.com:seu-usuario/kcs-formatter-app.git

# Entrar na pasta
cd kcs-formatter-app

# Instalar dependências
npm install

# Executar
npm start
```

---

## 🌿 Passo 6: Workflow de Branches para Isa

### Isa faz alterações no frontend:

```bash
# 1️⃣ Criar nova branch para o trabalho dela
git checkout -b feature/isa-frontend-improvements

# 2️⃣ Fazer alterações (ex: editar src/renderer.js)
# ... edita arquivos ...

# 3️⃣ Verificar o que mudou
git status

# 4️⃣ Adicionar as mudanças
git add src/renderer.js

# 5️⃣ Fazer commit com mensagem descritiva
git commit -m "🎨 Melhorias no layout do formulário"

# 6️⃣ Fazer push para o repositório remoto
git push origin feature/isa-frontend-improvements
```

---

## 🔄 Passo 7: Pull Request (Code Review)

### Isa faz um Pull Request (PR):

**No GitHub**:
- Vai em **"Pull requests"**
- Clica **"New pull request"**
- Compare: `feature/isa-frontend-improvements` → `main`
- Escreve título e descrição
- Clica **"Create pull request"**

### Você revisa e aprova:

```bash
# 1️⃣ No GitHub, clique "Files changed" para revisar
# 2️⃣ Se está tudo certo, clique "Approve"
# 3️⃣ Clique "Merge pull request"
# 4️⃣ Clique "Confirm merge"
```

### Sincronizar seu repositório local:

```bash
# Voltar para main
git checkout main

# Atualizar main local
git pull origin main

# Ver os commits de Isa
git log --oneline -5
```

---

## 💾 Passo 8: Manter Atualizado

### Você faz alterações (na feature branch):

```bash
# Criar nova branch
git checkout -b feature/sua-feature

# Fazer mudanças
# ... edita arquivos ...

# Commit
git commit -am "Descrição da mudança"

# Push
git push origin feature/sua-feature
```

### Isa atualiza seu repositório local:

```bash
# Ir para main
git checkout main

# Puxar as atualizações mais recentes
git pull origin main

# Ver as mudanças
git log --oneline -5
```

---

## 🔐 Passo 9: Proteger a Branch Main

**No GitHub** (Settings → Branches → Add rule):

- Branch name pattern: `main`
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Dismiss stale pull request approvals

Isso garante que ninguém faça push diretamente em `main`.

---

## 📊 Resumo Visual do Fluxo

```
┌─────────────────────────────────────────────┐
│     GitHub (Repositório Remoto)             │
│  https://github.com/seu-usuario/...         │
└──────────────┬──────────────────────────────┘
               │
         git clone / pull / push
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼──────────┐   ┌──────▼──────┐
│   Seu PC     │   │  PC da Isa  │
│  (você)      │   │  (revisora) │
│              │   │             │
│ main ✅      │   │ main ✅     │
│ feature/xxx  │   │feature/yyy  │
└──────────────┘   └─────────────┘
```

---

## 🎯 Checklist de Compartilhamento

- [ ] SSH key configurada no GitHub
- [ ] Repositório criado no GitHub
- [ ] Local remoto adicionado (`git remote add origin`)
- [ ] Push inicial feito (`git push -u origin main`)
- [ ] Feature branch também feita push (`git push -u origin feature/kcs-enhancements`)
- [ ] Isa adicionada como colaboradora
- [ ] Isa clonou o repositório
- [ ] Isa consegue rodar o projeto (`npm install && npm start`)
- [ ] Branch protection rules configuradas em `main`
- [ ] Workflow de PR estabelecido

---

## 📞 Comandos Rápidos de Referência

```bash
# Configuração inicial
git remote add origin <url>
git push -u origin main
git push -u origin feature/kcs-enhancements

# Dia a dia
git status                    # Ver status
git pull origin main          # Atualizar main local
git checkout -b feature/xxx   # Criar nova branch
git add .                     # Adicionar mudanças
git commit -m "msg"           # Fazer commit
git push origin feature/xxx   # Fazer push

# Sincronizar com Isa
git fetch origin              # Baixar mudanças remotas
git merge origin/feature/isa-xxx  # Merge da feature dela

# Branches
git branch                    # Listar branches locais
git branch -a                 # Listar todas (local + remoto)
git branch -D feature/xxx     # Deletar branch local

# Histórico
git log --oneline -10         # Ver últimos 10 commits
git diff                      # Ver mudanças não staged
git show <commit>             # Ver um commit específico
```

---

## ⚠️ Boas Práticas

### ✅ FAÇA:
- Criar branches para cada feature
- Escrever mensagens de commit descritivas
- Fazer pull antes de push
- Revisar código antes de merge
- Manter `main` sempre estável

### ❌ NÃO FAÇA:
- Push diretamente em `main` (use PR)
- Fazer commits grandes demais
- Escrever mensagens vagas ("fix" ou "update")
- Ignorar conflitos de merge
- Fazer rebase em `main` compartilhada

---

## 🚨 Se Algo Der Errado

### Erro: "Permission denied (publickey)"
```bash
# Verificar SSH
ssh -T git@github.com

# Se falhar, gerar nova SSH key
ssh-keygen -t ed25519 -C "seu.email@example.com"
```

### Erro: "fatal: refusing to merge unrelated histories"
```bash
# Ao fazer pull inicial
git pull origin main --allow-unrelated-histories
```

### Erro: "Updates were rejected"
```bash
# Alguém fez push antes de você
git pull origin main
# Resolver conflitos se houver
git push origin main
```

### Erro: "branch is ahead of origin by X commits"
```bash
# Você tem commits locais que não estão no remoto
git push origin seu-branch-name
```

---

## 📚 Links Úteis

- GitHub Docs: https://docs.github.com/
- Pro Git Book: https://git-scm.com/book/
- SSH Setup: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## 🎓 Tutorial Interativo

Se quiser testar antes com a Isa, faça um teste:

```bash
# 1. Crie um repositório de teste vazio no GitHub
# 2. Você faz primeiro push
# 3. Isa clona e faz uma mudança pequenininha
# 4. Isa faz um PR
# 5. Você aprova e faz merge
# 6. Você atualiza seu local
# 7. Você deleta o repositório de teste
```

---

## ✨ Pronto para Compartilhar?

Agora o projeto está:

✅ Organizado em pasta `/docs`  
✅ Com `.gitignore` correto  
✅ Com múltiplas branches  
✅ Pronto para colaboração  

**Próximo passo**: Executar os passos 1-5 acima para colocar no GitHub! 🚀

---

**Versão deste guia**: 1.0  
**Data**: 24/11/2025  
**Compatível com**: Git 2.30+, GitHub/GitLab
