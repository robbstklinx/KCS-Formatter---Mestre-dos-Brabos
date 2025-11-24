# 🔑 GUIA RÁPIDO: 5 Minutos para Compartilhar no GitHub

**Tempo total**: ~5 minutos  
**Dificuldade**: 🟢 Fácil

---

## ⏱️ Passo 1: Criar Repositório (2 min)

### 1.1 Vá para GitHub

Abra: https://github.com/new

### 1.2 Preencha:

```
Repository name:  kcs-formatter-app
Description:      Aplicação Electron para formatação KCS
Visibility:       Private (private/public conforme preferir)
Initialize:       ❌ NÃO marque nada
```

### 1.3 Clique "Create repository"

Pronto! Você terá uma página com:

```
git@github.com:seu-usuario/kcs-formatter-app.git
```

**Copie essa URL** (é a que você vai usar)

---

## ⏱️ Passo 2: Conectar Repositório Local (1 min)

### 2.1 Abra PowerShell na pasta do projeto:

```powershell
cd "c:\Users\jose.mcorreia\OneDrive - Linx SA\Área de Trabalho\Projects\Formatador KCS\kcs_formatter_app_3.0"
```

### 2.2 Adicione o repositório remoto:

```bash
git remote add origin git@github.com:seu-usuario/kcs-formatter-app.git
```

(Substitua `seu-usuario` pelo seu username do GitHub)

### 2.3 Verifique que funcionou:

```bash
git remote -v
```

Você deve ver:
```
origin  git@github.com:seu-usuario/kcs-formatter-app.git (fetch)
origin  git@github.com:seu-usuario/kcs-formatter-app.git (push)
```

---

## ⏱️ Passo 3: Fazer o Push (2 min)

### 3.1 Push da branch main (versão estável):

```bash
git push -u origin main
```

Esperado:
```
✅ Create pull request at https://github.com/seu-usuario/kcs-formatter-app/pull/new/main
```

### 3.2 Push da branch feature (em desenvolvimento):

```bash
git push -u origin feature/kcs-enhancements
```

Esperado:
```
✅ Create pull request at https://github.com/seu-usuario/kcs-formatter-app/pull/new/feature/kcs-enhancements
```

---

## ✅ Pronto!

Seu repositório está online em:

```
https://github.com/seu-usuario/kcs-formatter-app
```

---

## 👥 Compartilhar com Isa (1 min extra)

### No GitHub, vá em:

**Settings → Collaborators → Add people**

- Coloque o username da Isa
- Clique "Add collaborator"

Isa receberá um email de convite.

---

## 📝 Comandos Resumidos (copiar e colar)

### Se não tiver SSH key:

```bash
ssh-keygen -t ed25519 -C "seu.email@example.com"
cat ~/.ssh/id_ed25519.pub
```

(Copiar a saída e adicionar em GitHub → Settings → SSH keys → New SSH key)

### Conectar + Push:

```bash
cd "c:\Users\jose.mcorreia\OneDrive - Linx SA\Área de Trabalho\Projects\Formatador KCS\kcs_formatter_app_3.0"
git remote add origin git@github.com:SEU_USERNAME/kcs-formatter-app.git
git push -u origin main
git push -u origin feature/kcs-enhancements
```

(Substitua `SEU_USERNAME` pelo seu usuario)

---

## 🆘 Se Algo Der Errado

### Erro: "Permission denied (publickey)"

```bash
ssh -T git@github.com
```

Se falhar, adicione SSH key ao GitHub (ver seção anterior).

### Erro: "remote already exists"

```bash
git remote remove origin
git remote add origin git@github.com:seu-usuario/kcs-formatter-app.git
```

### Erro: "Updates were rejected"

```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

---

## 📊 O que está sendo feito push?

```
✅ src/                    (código-fonte)
✅ public/                 (assets)
✅ docs/                   (documentação)
✅ .gitignore              (configuração)
✅ package.json            (dependências)
✅ README.md               (introdução)
✅ .git/                   (histórico de commits)

❌ node_modules/           (instalação local, será ignorado)
❌ dist/                   (build local, será ignorado)
```

---

## 🎯 Após o Push

Isa pode:

```bash
# 1. Clonar o repositório
git clone git@github.com:seu-usuario/kcs-formatter-app.git

# 2. Instalar dependências
cd kcs-formatter-app
npm install

# 3. Rodar o projeto
npm start

# 4. Fazer alterações em uma nova branch
git checkout -b feature/isa-melhorias

# 5. Fazer commit
git add .
git commit -m "🎨 Melhorias visuais no formulário"

# 6. Fazer push
git push origin feature/isa-melhorias

# 7. Criar Pull Request no GitHub
# (GitHub vai oferecer um link direto)
```

---

## 📱 Próxima Etapa (Opcional)

Se quiser fazer isso automático com CI/CD:

- Adicione GitHub Actions
- Configure tests automáticos
- Deploy automático

Mas por enquanto, apenas colaboração Git já está ótimo!

---

## ✨ Resumo

```
🟢 GitHub criado
🟢 Remoto conectado
🟢 Push feito
🟢 Isa pode colaborar

Tudo em ~5 minutos!
```

---

**Pronto?** Execute os comandos acima agora! 🚀

Dúvidas? Veja: `docs/GIT_COMPARTILHAMENTO.md`
