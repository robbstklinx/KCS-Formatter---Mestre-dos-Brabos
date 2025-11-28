# KCS Formatter 3.0.5

> Aplicação Electron para formatação automática de artigos segundo metodologia KCS (Linx Microvix)  
> **Branch Principal**: `main` | **Última Atualização**: Novembro 2025

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Compilar para produção
npm run build
```

## 📁 Estrutura do Projeto

```
kcs_formatter_app_3.0/
├── src/
│   ├── main.js              # Processo principal (Electron)
│   ├── renderer.js          # Frontend (UI)
│   ├── preload.js           # Bridge IPC seguro
│   ├── formatter.js         # Parser local
│   ├── kcs-validator.js     # Validação KCS
│   ├── kcs-helpers.js       # Funções utilitárias
│   ├── public/
│   │   ├── index.html       # UI principal
│   │   ├── styles.css       # Estilos
│   │   └── [assets]
│   └── .env                 # Variáveis de ambiente
├── docs/
│   ├── README.md            # Documentação principal
│   ├── INTEGRATION_SUMMARY.md
│   ├── RESULTADO_INTEGRACAO.md
│   ├── BUILD_GUIDE.md
│   ├── TROUBLESHOOTING.md
│   └── [+17 docs]
├── package.json
└── .gitignore
```

## 🔑 Configuração

Crie um arquivo `.env` em `src/`:

```env
# OpenAI (opcional)
OPENAI_API_KEY=sk_...

# Copilot (alternativa)
COPILOT_API_KEY=...
COPILOT_ENDPOINT=https://api.openai.com/v1

# Share Linx (Base de conhecimento)
SHARE_API_KEY=...
SHARE_API_URL=https://share.linx.com.br/...
```

## 📚 Documentação

Toda a documentação está em `/docs`:

| Arquivo | Descrição |
|---------|-----------|
| [LEIA_ME_PRIMEIRO.md](docs/LEIA_ME_PRIMEIRO.md) | **COMECE AQUI** |
| [GUIA_GIT_COMPLETO.md](docs/GUIA_GIT_COMPLETO.md) | **⭐ Guia Git (v3.0.5)** |
| [INTEGRATION_SUMMARY.md](docs/INTEGRATION_SUMMARY.md) | Integração técnica KCS |
| [RESULTADO_INTEGRACAO.md](docs/RESULTADO_INTEGRACAO.md) | Guia visual dos resultados |
| [BUILD_GUIDE.md](docs/BUILD_GUIDE.md) | Como compilar |
| [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Solução de problemas |
| [GIT_COMPARTILHAMENTO.md](docs/GIT_COMPARTILHAMENTO.md) | Compartilhamento em equipe |

## ✨ Recursos

✅ Parser inteligente de conteúdo  
✅ Formatação automática com IA (OpenAI/Copilot)  
✅ Validação KCS silenciosa (DevTools)  
✅ Detecção automática de módulo  
✅ Geração automática de tags  
✅ Extração de URLs  
✅ Medição de qualidade do conteúdo  
✅ Busca na base de conhecimento (Share Linx)  

## 🔐 Validação KCS

A aplicação valida automaticamente:
- Título no padrão "Linx Microvix - [Módulo] - Como [ação]"
- Módulo contra lista de 16 módulos
- Descrição (10-500 chars, começa com "Para")
- Solução (mínimo 1 passo)
- Links (máx 5 URLs válidas)
- Tags (máx 6, lowercase)

## 🛠️ Desenvolvimento

### Branches

```bash
# Branch principal (estável)
main (v3.0.3)

# Feature branch (experimental)
feature/kcs-enhancements (v3.0.4 em desenvolvimento)
```

### Fazer alterações

```bash
# 1. Criar nova branch
git checkout -b feature/sua-feature

# 2. Fazer alterações
# ... editar arquivos ...

# 3. Commit
git add .
git commit -m "Descrição da mudança"

# 4. Push
git push origin feature/sua-feature
```

## 📊 Commits Recentes

```
ddf72d0 - Guia visual resultado - Validação KCS silenciosa
fb1d14e - Documentação técnica da integração de validação KCS
ef1fa1e - Integração de validação KCS silenciosa - Análise técnica em DevTools
aaa6225 - v3.0.3: Estado funcional - Parser inteligente, Copilot support
```

## 🔄 Versão Atual

- **Versão**: 3.0.4
- **Branch**: feature/kcs-enhancements
- **Status**: ✅ Validação KCS integrada e funcionando
- **Last Update**: 2025-11-24

## 👥 Colaboradores

- **José Mcorreia** - Developer principal
- **Isa** - Revisora frontend

## 📝 License

Ver [LICENSE](docs/LICENSE)

---

**Para começar, leia [docs/LEIA_ME_PRIMEIRO.md](docs/LEIA_ME_PRIMEIRO.md)**
