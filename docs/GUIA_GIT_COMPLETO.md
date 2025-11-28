# 📚 Guia Completo de Git - KCS Formatter 3.0.5

**Versão**: 3.0.5  
**Data**: Novembro 2025  
**Equipe**: Mestre dos Brabos

---

## 📋 Índice

1. [Configuração Inicial](#configuração-inicial)
2. [Comando Básicos](#comandos-básicos)
3. [Workflow de Branches](#workflow-de-branches)
4. [Pull Requests e Code Review](#pull-requests-e-code-review)
5. [Solução de Problemas](#solução-de-problemas)
6. [Referência Rápida](#referência-rápida)

---

## 🔧 Configuração Inicial

### **Clone o Repositório**

```bash
git clone git@github.com:robbstklinx/KCS-Formatter---Mestre-dos-Brabos.git
cd KCS-Formatter---Mestre-dos-Brabos
```

### **Configure suas Credenciais**

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@example.com"

# Verificar configuração
git config --list
```

### **Configure SSH (Recomendado)**

```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu.email@example.com"

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar no GitHub: Settings → SSH and GPG keys → New SSH key
```

---

## 📖 Comandos Básicos

### **1. Verificar Status**

```bash
git status
```

**O que faz**: Mostra o estado atual do repositório (arquivos modificados, novos, deletados)

**Exemplo de saída**:
```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update the index)
  modified:   src/main.js

Untracked files:
  (use "git add <file>..." to include in what will be committed)
  src/novo-arquivo.js
```

---

### **2. Ver Histórico de Commits**

```bash
# Ver últimos commits
git log

# Ver últimos 5 commits em uma linha
git log --oneline -5

# Ver commits de um arquivo específico
git log src/main.js

# Ver commits com gráfico de branches
git log --graph --oneline --all
```

**O que faz**: Exibe o histórico de commits com autor, data e mensagem

---

### **3. Adicionar Alterações (Stage)**

```bash
# Adicionar um arquivo específico
git add src/main.js

# Adicionar todos os arquivos modificados
git add .

# Adicionar alterações interativamente
git add -p
```

**O que faz**: Marca arquivos para serem inclusos no próximo commit

**Diferença**:
- `git add arquivo.js` → Adiciona apenas esse arquivo
- `git add .` → Adiciona TODOS os arquivos modificados

---

### **4. Fazer Commit**

```bash
# Commit simples
git commit -m "feat: adicionar nova funcionalidade"

# Commit com descrição detalhada
git commit -m "feat: adicionar busca avançada" -m "Descrição mais detalhada do que foi feito"

# Alterar o último commit (antes de fazer push)
git commit --amend
```

**O que faz**: Salva um "snapshot" das alterações com uma mensagem descritiva

**Convenção de mensagens**:
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `refactor:` - Reorganização de código
- `style:` - Formatação
- `test:` - Testes

---

### **5. Enviar Alterações (Push)**

```bash
# Enviar commits para a branch remota
git push origin main

# Primeira vez em uma branch nova
git push -u origin nome-da-branch

# Forçar push (CUIDADO: pode sobrescrever histórico)
git push origin main --force
```

**O que faz**: Envia seus commits para o servidor (GitHub)

---

### **6. Baixar Alterações (Pull)**

```bash
# Baixar e mesclar alterações
git pull origin main

# Ver o que vai ser baixado sem mesclar
git fetch origin main
git log ..origin/main
```

**O que faz**: Busca alterações do servidor e integra ao seu código

**Pull = Fetch + Merge**

---

### **7. Criar Branch**

```bash
# Criar branch local
git branch nome-da-branch

# Criar e fazer checkout simultaneamente
git checkout -b nome-da-branch

# Versão mais nova do Git
git switch -c nome-da-branch

# Criar branch a partir de outra branch (ex: de enhancements)
git checkout -b isabelly origin/feature/kcs-enhancements
```

**O que faz**: Cria uma cópia isolada do código para trabalhar

---

### **8. Trocar de Branch**

```bash
# Ir para outra branch
git checkout main

# Versão mais nova
git switch main

# Ver todas as branches
git branch -a

# Ver branches remotas
git branch -r
```

**O que faz**: Muda para outra branch

---

### **9. Mesclar Branches (Merge)**

```bash
# Mesclar outra branch na atual
git merge feature/kcs-enhancements

# Mesclar com mensagem customizada
git merge feature/kcs-enhancements -m "Merge das novas features"

# Abrir merge manualmente se houver conflitos
git merge --abort  # Cancelar merge
```

**O que faz**: Integra alterações de uma branch em outra

---

### **10. Deletar Branch**

```bash
# Deletar branch local
git branch -d nome-da-branch

# Forçar deleção
git branch -D nome-da-branch

# Deletar branch remota
git push origin --delete nome-da-branch
```

**O que faz**: Remove uma branch que não é mais necessária

---

## 🌿 Workflow de Branches

### **Estrutura de Branches do Projeto**

```
main (PRODUÇÃO - v3.0.5)
  ↑
  └─── feature/kcs-enhancements (STAGING - versão em desenvolvimento)
        ↑
        ├─── isabelly (Branch da Isabelly)
        └─── sua-branch (Suas alterações)
```

---

### **Passo a Passo: Fluxo Recomendado**

#### **1️⃣ Clonar e Entrar no Projeto**

```bash
git clone git@github.com:robbstklinx/KCS-Formatter---Mestre-dos-Brabos.git
cd KCS-Formatter---Mestre-dos-Brabos
npm install
```

#### **2️⃣ Criar sua Branch de Desenvolvimento**

```bash
# Começar da main (produção)
git checkout main
git pull origin main

# Criar sua branch
git checkout -b minha-feature

# Enviar para o servidor
git push -u origin minha-feature
```

#### **3️⃣ Fazer Alterações**

```bash
# Ver status
git status

# Fazer as modificações nos arquivos...

# Adicionar alterações
git add .

# Commit
git commit -m "feat: descrição do que foi feito"
```

#### **4️⃣ Enviar para Revisão (Pull Request)**

```bash
# Enviar sua branch
git push origin minha-feature

# Vá no GitHub e crie um Pull Request:
# 1. Clique em "Compare & pull request"
# 2. Escolha: minha-feature → main
# 3. Adicione descrição
# 4. Clique "Create pull request"
```

#### **5️⃣ Receber Aprovação e Mesclar**

```bash
# Se aprovado no GitHub, você pode fazer merge local:
git checkout main
git pull origin main
git merge minha-feature
git push origin main
```

---

## 🔍 Pull Requests e Code Review

### **Criar um Pull Request**

1. **No GitHub**:
   - Vá para o repositório
   - Clique em "Pull requests"
   - Clique em "New pull request"
   - Compare: `minha-feature` → `main`
   - Adicione título e descrição
   - Clique "Create pull request"

### **O que Verificar em um Code Review**

- ✅ Código segue o padrão do projeto
- ✅ Sem console.log ou código de debug
- ✅ Funcionalidade funciona sem erros
- ✅ Não quebra funcionalidades existentes
- ✅ Mensagens de commit são claras

### **Pedir Mudanças**

```bash
# Se receber feedback, faça as alterações:
git add .
git commit -m "fix: ajustes conforme code review"
git push origin minha-feature

# O PR se atualiza automaticamente
```

---

## ⚠️ Solução de Problemas

### **Problema 1: Conflitos no Merge**

**Situação**: Dois branches modificaram o mesmo arquivo

```bash
# Tentar merge
git merge feature/kcs-enhancements

# Git mostra conflitos:
# CONFLICT (content): Merge conflict in src/main.js

# 1. Abrir o arquivo e resolver manualmente
# 2. Procurar por:
<<<<<<< HEAD
seu código
=======
código da outra branch
>>>>>>> feature/kcs-enhancements

# 3. Manter o código correto e deletar os marcadores

# 4. Adicionar e commitar
git add .
git commit -m "fix: resolver conflitos de merge"
git push origin main
```

---

### **Problema 2: Commitar na Branch Errada**

```bash
# Se commitar em main ao invés de sua-branch:

# 1. Desfazer o commit (mantendo alterações)
git reset --soft HEAD~1

# 2. Trocar de branch
git checkout -b correcao

# 3. Fazer commit novamente
git add .
git commit -m "feat: sua mensagem"
git push -u origin correcao
```

---

### **Problema 3: Descartar Alterações Locais**

```bash
# Descartar alterações em um arquivo
git restore src/main.js

# Descartar TODAS as alterações (CUIDADO!)
git reset --hard HEAD

# Descartar commits locais (não enviados)
git reset --hard origin/main
```

---

### **Problema 4: Reverter um Commit**

```bash
# Se já fez push com erro:

# Criar um novo commit que desfaz o anterior
git revert <commit-hash>

# Ver o hash do commit errado
git log --oneline

# Exemplo:
git revert 3d3c6c9
git push origin main
```

---

### **Problema 5: Recuperar Branch Deletada**

```bash
# Ver commits recentes, mesmo de branches deletadas
git reflog

# Recriar a branch
git checkout -b branch-recuperada <commit-hash>
```

---

## 📋 Referência Rápida

| Comando | O que faz |
|---------|-----------|
| `git status` | Ver status atual |
| `git log --oneline -5` | Ver últimos 5 commits |
| `git add .` | Adicionar todos os arquivos |
| `git commit -m "mensagem"` | Salvar alterações |
| `git push origin main` | Enviar para servidor |
| `git pull origin main` | Baixar alterações |
| `git branch -a` | Ver todas as branches |
| `git checkout -b nova-branch` | Criar e entrar em branch |
| `git merge outra-branch` | Mesclar branches |
| `git reset --hard HEAD` | Descartar alterações |
| `git revert <hash>` | Desfazer commit |
| `git remote -v` | Ver repositório remoto |
| `git stash` | Guardar alterações temporariamente |
| `git stash pop` | Recuperar alterações guardadas |

---

## 🚀 Workflow Final (Resumo)

```bash
# 1. Começar
git checkout main
git pull origin main
git checkout -b minha-feature
git push -u origin minha-feature

# 2. Trabalhar
# ... fazer alterações ...
git add .
git commit -m "feat: descrição"
git push origin minha-feature

# 3. Revisar (no GitHub: Pull Request)
# ... esperar aprovação ...

# 4. Mesclar
git checkout main
git pull origin main
git merge minha-feature
git push origin main

# 5. Limpar
git branch -d minha-feature
git push origin --delete minha-feature
```

---

## 📞 Dúvidas Comuns

**P: Qual é a diferença entre `git pull` e `git fetch`?**  
R: `git fetch` apenas baixa, `git pull` baixa E mescla automaticamente.

**P: Posso mudar a mensagem de um commit?**  
R: Sim! Use `git commit --amend` antes de fazer push.

**P: É seguro usar `--force`?**  
R: Não! Apenas use se realmente souber o que está fazendo. Evite em branches compartilhadas.

**P: Como voltar um arquivo para a versão anterior?**  
R: Use `git checkout <commit-hash> -- arquivo.js`

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte este guia
2. Veja o `TROUBLESHOOTING.md`
3. Abra uma issue no GitHub

---

**Versão**: 3.0.5  
**Última atualização**: Novembro 2025  
**Mantido por**: Equipe Mestre dos Brabos
