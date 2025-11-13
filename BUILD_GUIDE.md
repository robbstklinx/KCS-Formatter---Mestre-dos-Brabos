# 📦 Guia de Empacotamento - KCS Formatter

## Comando para Empacotar

```bash
npm run build
```

Isso é tudo que você precisa! 🎉

---

## O que Acontece?

Quando você roda `npm run build`:

1. **electron-builder** lê as configurações do `package.json`
2. **Compila a aplicação** incluindo todos os arquivos necessários
3. **Cria instalador** (.exe) para Windows
4. **Gera pasta `dist/`** com os arquivos de distribuição

---

## 📂 Saída Esperada

Após rodar `npm run build`, você terá:

```
dist/
├── KCS Formatter - Mestre dos Brabos 1.0.0.exe  ← Instalador
└── [outros arquivos de suporte]
```

O arquivo `.exe` é o **instalador completo** da aplicação!

---

## 🚀 Como Distribuir

1. **Rode o build:**
   ```bash
   npm run build
   ```

2. **Encontre o .exe em `dist/`:**
   ```
   dist/KCS Formatter - Mestre dos Brabos 1.0.0.exe
   ```

3. **Distribua o arquivo:**
   - Envie por email
   - Coloque em um servidor
   - Compartilhe via USB
   - Coloque em um repositório

4. **Usuário final executa o .exe:**
   - Clica duplo no arquivo
   - Segue as instruções de instalação
   - Aplicação é instalada e pronta para usar

---

## 📋 Configurações de Build

Seu `package.json` já está configurado com:

### ✅ Produto
- **Nome:** KCS Formatter - Mestre dos Brabos
- **Versão:** 1.0.0
- **Ícone:** mestredosbrabosicon.ico

### ✅ Instalador Windows (NSIS)
- **Tipo:** NSIS (instalador profissional)
- **One-click:** Desativado (permite escolher diretório)
- **Atalho desktop:** Sim
- **Atalho menu Iniciar:** Sim
- **Nome do atalho:** KCS Formatter

### ✅ Arquivos Incluídos
- `src/` (código-fonte)
- `public/` (ícones, assets)
- `package.json`

---

## 🔄 Fluxo Completo

```
Desenvolvimento
    ↓
npm run build
    ↓
electron-builder processa
    ↓
Cria dist/KCS-Formatter-1.0.0.exe
    ↓
Distribui o .exe
    ↓
Usuário executa .exe
    ↓
Instalador NSIS abre
    ↓
Usuário choose diretório
    ↓
Aplicação instalada
    ↓
Atalhos criados (Desktop + Menu Iniciar)
    ↓
Pronto para usar!
```

---

## 📊 Informações do Build

| Aspecto | Valor |
|--------|-------|
| **App ID** | com.linx.mestredosbrabos.kcsformatter |
| **Nome Produto** | KCS Formatter - Mestre dos Brabos |
| **Versão** | 1.0.0 |
| **Output** | dist/ |
| **Instalador** | NSIS (.exe) |
| **Ícone** | mestredosbrabosicon.ico |
| **Diretório Instalação** | Customizável pelo usuário |

---

## 🛠️ Se Precisar Customizar

### Aumentar Versão
Edite `package.json`:
```json
"version": "1.0.1"  ← Mude aqui
```

### Mudar Nome do App
```json
"productName": "Novo Nome Aqui"
```

### Mudar Ícone
Coloque um novo `.ico` em `public/mestredosbrabosicon.ico`

### Mudar Configurações de Instalação
Edite a seção `"nsis"` do `package.json`

---

## 📝 Requisitos para Build

✅ Node.js instalado (já tem)  
✅ npm instalado (já tem)  
✅ electron-builder (já está em dependencies)  
✅ Arquivos necessários presentes (já estão)  

---

## ⚡ Comandos Úteis

```bash
# Iniciar em modo desenvolvimento
npm start

# Criar build/instalador
npm run build

# Build sem empacotar (apenas teste)
npm run build -- --dir
```

---

## 📦 O que o Instalador Faz

Quando o usuário executa o `.exe`:

1. **Extrai arquivos** em `%LocalAppData%/Programs/KCS Formatter`
2. **Cria atalho** na área de trabalho
3. **Cria entrada** no Menu Iniciar
4. **Registra** para desinstalação via Painel de Controle
5. **Pronto para executar!**

---

## 🔐 Distribuição Segura

### Assinatura de Código (Opcional)
Para distribuição empresarial, você pode assinar o executável:

```json
"win": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "senha",
  "signingHashAlgorithms": ["sha256"]
}
```

---

## 🧪 Teste o Instalador

1. Após rodar `npm run build`:
   ```bash
   dist/KCS\ Formatter\ -\ Mestre\ dos\ Brabos\ 1.0.0.exe
   ```

2. Execute em uma máquina limpa/virtual para testar
3. Verifique:
   - Instalação completa
   - Atalhos criados
   - App funciona normalmente
   - Desinstalação funciona

---

## 📝 Exemplo de Execução

```bash
# 1. Navegue até o projeto
cd "c:\Users\jose.mcorreia\OneDrive - Linx SA\Área de Trabalho\Projects\Formatador KCS\kcs_formatter_app_3.0"

# 2. Rode o build
npm run build

# 3. Aguarde alguns minutos...
# Output:
# building electron-builder app...
# file created: dist/KCS Formatter - Mestre dos Brabos 1.0.0.exe

# 4. Seu instalador está pronto!
ls dist/
# Resultado:
# KCS Formatter - Mestre dos Brabos 1.0.0.exe
```

---

## ✅ Checklist Pré-Build

- [ ] Código testado e funcionando
- [ ] `.env` configurado com credenciais
- [ ] Versão no `package.json` correta
- [ ] Ícone em `public/mestredosbrabosicon.ico`
- [ ] Nenhuma dependência faltando

---

## 🎉 Pronto!

Seu KCS Formatter está pronto para ser empacotado e distribuído!

```bash
npm run build
```

Depois é só compartilhar o `.exe` com seus usuários! 🚀

