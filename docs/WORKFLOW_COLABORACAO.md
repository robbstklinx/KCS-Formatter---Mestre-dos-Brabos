# 🚀 Workflow de Colaboração - Isabelly + Team

**Versão**: 3.0.5  
**Data**: Novembro 2025  
**Equipe**: Mestre dos Brabos

---

## 📋 Estrutura de Branches

```
🔒 main (PRODUÇÃO - Estável v3.0.5)
  ↑
  └─── 🔄 feature/kcs-enhancements (STAGING - Em desenvolvimento)
        ↑
        ├─── 👤 isabelly (Branch da Isabelly)
        └─── 👤 sua-branch (Suas alterações)
```

### **O que cada branch faz:**

| Branch | Função | Quem usa | Quando fazer merge |
|--------|--------|---------|-------------------|
| `main` | **Produção** - Versão estável | Publicação | Após teste completo |
| `feature/kcs-enhancements` | **Staging** - Integração | Time inteiro | Antes de subir para main |
| `isabelly` | **Dev** - Trabalho da Isabelly | Isabelly | Após code review |
| `sua-branch` | **Dev** - Seu trabalho | Você | Após code review |

---

## 🎯 Passo a Passo: Fluxo Recomendado

### **Fase 1: Setup Inicial (FAZER UMA VEZ)**

#### **Isabelly (no computador dela):**

```bash
# 1. Clonar o repositório
git clone git@github.com:robbstklinx/KCS-Formatter---Mestre-dos-Brabos.git
cd KCS-Formatter---Mestre-dos-Brabos

# 2. Instalar dependências
npm install

# 3. Fazer checkout para a branch dela (usando enhancements como base)
git checkout -b isabelly origin/feature/kcs-enhancements

# 4. Enviar para o servidor (primeira vez)
git push -u origin isabelly
```

**Resultado esperado:**
```
✅ Branch 'isabelly' criada a partir de 'feature/kcs-enhancements'
✅ Enviada para o servidor
✅ Pronta para trabalhar
```

---

### **Fase 2: Trabalho Diário (REPETIR)**

#### **Isabelly faz alterações:**

```bash
# 1. Ir para sua branch
git checkout isabelly

# 2. Atualizar com últimas mudanças (se houver)
git pull origin isabelly

# 3. Fazer alterações nos arquivos...
# ... editar src/renderer.js, public/index.html, etc ...

# 4. Ver o que foi modificado
git status

# 5. Adicionar alterações
git add .

# 6. Fazer commit com mensagem clara
git commit -m "feat: adicionar novo componente de busca"

# 7. Enviar para o servidor
git push origin isabelly
```

**Exemplo de mensagens**:
```
✅ "feat: adicionar filtro avançado"
✅ "fix: corrigir validação de tags"
✅ "docs: atualizar README"
❌ "mudanças" (muito vago)
❌ "kkk" (não informativo)
```

---

### **Fase 3: Code Review (ANTES DE FAZER MERGE)**

#### **Você (revisando o trabalho da Isabelly):**

1. **No GitHub** - Vá para:
   ```
   https://github.com/robbstklinx/KCS-Formatter---Mestre-dos-Brabos/pulls
   ```

2. **Clique em "New pull request"**

3. **Preencha assim:**
   ```
   Compare: isabelly
   Base: feature/kcs-enhancements
   ```

4. **Clique em "Files changed"** e revise:
   - ✅ Código segue o padrão
   - ✅ Sem console.log ou debug
   - ✅ Funciona sem erros
   - ✅ Sem conflitos

5. **Se estiver OK**: Clique "Merge pull request"
   
6. **Se houver problema**: Deixe comentário e pedir ajuste

#### **Se houver feedback para Isabelly:**

```bash
# Isabelly faz os ajustes
git add .
git commit -m "fix: ajustes conforme code review"
git push origin isabelly

# PR se atualiza automaticamente! Não precisa criar novo.
```

---

### **Fase 4: Subir para Staging (feature/kcs-enhancements)**

#### **Você confirma que tudo está pronto:**

```bash
# 1. Ir para a branch de staging
git checkout feature/kcs-enhancements

# 2. Atualizar
git pull origin feature/kcs-enhancements

# 3. Mesclar a branch de Isabelly
git merge isabelly

# 4. Se tiver conflitos, resolver manualmente
# ... abrir arquivos e corrigir ...

# 5. Enviar
git push origin feature/kcs-enhancements
```

---

### **Fase 5: Subir para Produção (main)**

#### **APENAS quando tudo está testado e pronto:**

```bash
# 1. Ir para main
git checkout main

# 2. Atualizar
git pull origin main

# 3. Mesclar enhancements
git merge feature/kcs-enhancements

# 4. Enviar para produção
git push origin main

# 5. Tag com versão (opcional)
git tag -a v3.0.5 -m "Release v3.0.5"
git push origin v3.0.5
```

---

## 📊 Exemplo Prático Completo

### **Cenário: Isabelly adiciona novo recurso de busca**

#### **Dia 1 - Isabelly começa:**

```bash
# Setup
git clone git@github.com:robbstklinx/KCS-Formatter---Mestre-dos-Brabos.git
cd KCS-Formatter---Mestre-dos-Brabos
npm install
git checkout -b isabelly origin/feature/kcs-enhancements
git push -u origin isabelly

# Trabalho
# ... edita src/renderer.js para adicionar busca ...
git add src/renderer.js
git commit -m "feat: adicionar componente de busca avançada"
git push origin isabelly
```

#### **Dia 2 - Você revisa:**

```bash
# No GitHub - New PR: isabelly → feature/kcs-enhancements
# Clica em "Files changed"
# Vê as alterações
# Aprova ou pede ajustes
# Clica "Merge pull request" ✅
```

#### **Dia 3 - Você integra:**

```bash
git checkout feature/kcs-enhancements
git pull origin feature/kcs-enhancements
git merge isabelly
git push origin feature/kcs-enhancements

# Testa tudo...

# Se tudo OK:
git checkout main
git pull origin main
git merge feature/kcs-enhancements
git push origin main
```

---

## 🔄 Sincronizar Branches

### **Se Isabelly quer pegar atualizações de `enhancements`:**

```bash
# Isabelly faz isso periodicamente
git checkout isabelly
git pull origin feature/kcs-enhancements
git push origin isabelly
```

---

## ⚠️ Cenários Especiais

### **Cenário 1: Conflito ao fazer merge**

```bash
# Tentou fazer merge e teve conflito:
git merge feature/kcs-enhancements
# CONFLICT: Merge conflict in src/main.js

# 1. Abrir o arquivo
# 2. Procurar por:
#    <<<<<<< HEAD
#    seu-codigo
#    =======
#    codigo-da-outra-branch
#    >>>>>>>

# 3. Editar e manter o correto

# 4. Resolver
git add .
git commit -m "fix: resolver conflitos de merge"
git push origin isabelly
```

---

### **Cenário 2: Desfazer um commit (antes de fazer push)**

```bash
# Commitar errado
git commit -m "erro: mensagem errada"

# Desfazer (mantém alterações)
git reset --soft HEAD~1

# Refazer
git commit -m "feat: mensagem correta"
git push origin isabelly
```

---

### **Cenário 3: Desfazer um push (já enviado)**

```bash
# Enviou e quer desfazer:
git log --oneline

# Encontra o commit anterior
# Reverte criando novo commit que desfaz
git revert <hash-do-commit-errado>
git push origin isabelly

# Ou (se ninguém mais usou):
git reset --hard <commit-anterior>
git push origin isabelly --force
```

---

## 📋 Checklist: Antes de Fazer Merge para Main

- [ ] Todos os testes passam
- [ ] Sem console.log ou código de debug
- [ ] Sem merge conflicts
- [ ] Code review aprovado
- [ ] Documentação atualizada
- [ ] Sem breaking changes (se possível)
- [ ] Versão atualizada em `package.json`
- [ ] Changelog atualizado

---

## 🎓 Dicas Importantes

### **✅ BOM:**
```bash
git commit -m "feat: adicionar filtro por categoria"
git commit -m "fix: corrigir bug na validação"
git commit -m "docs: atualizar guia de instalação"
```

### **❌ RUIM:**
```bash
git commit -m "mudanças"
git commit -m "fix"
git commit -m "kkk"
git commit -m "correção final (espero que funcione)"
```

---

## 🚨 NUNCA Faça Isso

❌ **Não faça push direto em `main`** - Use Pull Request!  
❌ **Não use `--force` em branches compartilhadas** - Pode perder código!  
❌ **Não commite `node_modules` ou `.env` com senhas**  
❌ **Não delete branches remotas sem avisar**  

---

## 📞 Fluxo de Comunicação

1. **Isabelly** termina tarefa → Faz commit e push para `isabelly`
2. **Você** recebe notificação → Revisa no GitHub
3. **Você** aprova → Clica "Merge pull request"
4. **Isabelly** puxa update → `git pull origin feature/kcs-enhancements`
5. **Você** testa tudo → Se OK, faz merge para `main`
6. **Equipe** puxa `main` → Todos trabalham com versão atualizada

---

## 🔗 Referência Rápida

| Ação | Comando |
|------|---------|
| Clonar projeto | `git clone ...` |
| Criar branch | `git checkout -b nome` |
| Ver status | `git status` |
| Adicionar arquivos | `git add .` |
| Fazer commit | `git commit -m "msg"` |
| Enviar | `git push origin branch` |
| Atualizar | `git pull origin branch` |
| Mesclar | `git merge outra-branch` |
| Ver histórico | `git log --oneline` |
| Desfazer alterações | `git restore arquivo.js` |
| Ver branches | `git branch -a` |

---

## 📞 Dúvidas?

Veja:
1. `GUIA_GIT_COMPLETO.md` - Referência detalhada de todos os comandos
2. `TROUBLESHOOTING.md` - Solução de problemas comuns
3. `GIT_COMPARTILHAMENTO.md` - Mais detalhes sobre colaboração

---

**Versão**: 3.0.5  
**Última atualização**: Novembro 2025  
**Mantido por**: Equipe Mestre dos Brabos
