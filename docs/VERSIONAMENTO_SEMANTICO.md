# 📦 Versionamento Semântico (Semantic Versioning)

## 🎯 Formato: `MAJOR.MINOR.PATCH`

```
3.0.5
│ │ │
│ │ └─ PATCH (3.0.0 → 3.0.5)
│ └──── MINOR (3.0.0 → 3.1.0)
└────── MAJOR (3.0.0 → 4.0.0)
```

---

## 📋 Quando Usar Cada Um?

### 🔴 **PATCH** (Versão Atual - Seu caso!)

**Incrementar quando:** Bug fixes, correções pequenas, melhorias internas

**Exemplos:**
- 3.0.4 → **3.0.5** ✅ Ctrl+F agora faz scroll automático (melhoria pequena)
- 3.0.5 → 3.0.6 ✅ Corrigir typo na UI
- 3.0.6 → 3.0.7 ✅ Otimizar performance do finder
- 3.0.7 → 3.0.8 ✅ Remover console.log esquecido

**Compatibilidade:** 100% compatível com versão anterior
**Impacto:** Nenhum (usuário não vê mudança)
**Quebra alguma coisa?** Não

---

### 🟡 **MINOR** (Você usaria quando)

**Incrementar quando:** Novas features (funcionalidades novas), mas compatível com versão anterior

**Exemplos:**
- 3.0.7 → **3.1.0** ✅ Adicionar modo escuro (nova feature)
- 3.1.0 → 3.2.0 ✅ Adicionar opção de salvar artigos (nova feature)
- 3.2.0 → 3.3.0 ✅ Integrar com novo serviço de IA
- 3.3.0 → 3.4.0 ✅ Adicionar busca avançada com filtros

**Compatibilidade:** 100% compatível (versão anterior continua funcionando)
**Impacto:** Novo recurso, mas opcional
**Quebra alguma coisa?** Não

---

### 🔵 **MAJOR** (Você usaria quando)

**Incrementar quando:** Mudanças que **QUEBRAM compatibilidade** com versão anterior

**Exemplos:**
- 3.4.0 → **4.0.0** ❌ Mudar formato de arquivo de .json para .xml (quebra compatibilidade)
- 4.0.0 → 5.0.0 ❌ Remover suporte a Windows 7 (quebra compatibilidade)
- 5.0.0 → 6.0.0 ❌ Reescrever API completamente (interface muda)
- 6.0.0 → 7.0.0 ❌ Alterar estrutura do banco de dados (dados antigos não funcionam)

**Compatibilidade:** ⚠️ NÃO compatível (quebra coisas)
**Impacto:** Grande - usuários precisam atualizar arquivos/configuração
**Quebra alguma coisa?** SIM

---

## 📊 Seu Projeto: 3.0.x

Você está em versão **3**, então:

```
3.0.4 (Atual)
   ↓ Ctrl+F melhorado
3.0.5 ✅ Isso mesmo!
   ↓ Adicionar modo escuro (nova feature)
3.1.0 ✅ Próximo passo
   ↓ Adicionar mais features
3.2.0 ✅ Depois
   ↓ Reescrever tudo (QUEBRA COMPATIBILIDADE)
4.0.0 ✅ Só aí!
```

---

## 🎯 Seu Caso Específico

### Melhorias Recentes (Ctrl+F V2.0)

```javascript
// O que foi feito:
- ✅ Ctrl+F agora faz scroll automático
- ✅ Texto é selecionado
- ✅ Navegação com Enter/Shift+Enter
- ✅ Botões Anterior/Próximo
- ✅ Contador de resultados
- ✅ Barra de URL com cópia
```

**Tipo de mudança?** PATCH (melhoria interna)

**Razão:**
- ✅ Sem novas funcionalidades principais
- ✅ Comportamento melhorado (não quebra compatibilidade)
- ✅ Interface compatível
- ✅ Usuário não precisa alterar nada

**Versão correta:**
```
3.0.4 → 3.0.5 ✅ CORRETO!
```

---

## 📈 Exemplos de Progressão Real

### Projeto: KCS Formatter

```
1.0.0 ✅ Lançamento inicial
   ↓ (correção de bug)
1.0.1 ✅ Bug fix
   ↓ (novo suporte a mais templates)
1.1.0 ✅ Nova feature menor
   ↓ (novo suporte a IA)
1.2.0 ✅ Nova feature
   ↓ (reescrever parser inteiro - quebra compatibilidade)
2.0.0 ✅ MAJOR - nova arquitetura

2.0.0 
   ↓ (bug)
2.0.1 ✅ Patch
   ↓ (bug)
2.0.2 ✅ Patch
   ↓ (nova feature)
2.1.0 ✅ Minor
   ↓ (nova feature)
2.2.0 ✅ Minor
   ↓ (major refactor)
3.0.0 ✅ MAJOR

3.0.0
   ↓ (melhorias child windows)
3.0.1 ✅ Patch
   ↓ (validação KCS)
3.0.2 ✅ Patch
   ↓ (Ctrl+F melhorado)
3.0.3 ✅ Patch
   ↓ (mais melhorias Ctrl+F)
3.0.4 → 3.0.5 ✅ Seu caso AGORA
```

---

## ✅ Checklist: O Que É O Quê?

### É PATCH se:
- [ ] Corrige bug
- [ ] Melhora performance
- [ ] Melhora interface (sem quebra)
- [ ] Otimiza código
- [ ] Adiciona logging/debug
- [ ] Remove código morto
- [ ] Corrige typo
- [ ] Melhora CSS/UI
- [ ] Atualiza dependência menor

**→ Versão: X.X.+1**

### É MINOR se:
- [ ] Adiciona nova feature/funcionalidade
- [ ] Adiciona novo comando
- [ ] Adiciona novo modo
- [ ] Adiciona novo integração
- [ ] Expande funcionalidade existente (compatível)
- [ ] Adiciona novo formato suportado
- [ ] Adiciona novo atalho/comando

**→ Versão: X.+1.0**

### É MAJOR se:
- [ ] Remove feature/comando
- [ ] Muda formato de arquivo
- [ ] Altera API completamente
- [ ] Quebra compatibilidade para trás
- [ ] Reescreve componente inteiro
- [ ] Requer ação do usuário (migração)
- [ ] Altera estrutura de dados
- [ ] Drop de suporte a plataforma

**→ Versão: +1.0.0**

---

## 🔧 Próximas Decisões Para Você

### Cenário 1: Bug no Ctrl+F encontrado
```
3.0.5 → 3.0.6 ✅ PATCH (apenas correção)
```

### Cenário 2: Adicionar busca por regex
```
3.0.5 → 3.1.0 ✅ MINOR (nova feature)
```

### Cenário 3: Remover suporte a IE11
```
3.0.5 → 4.0.0 ✅ MAJOR (quebra compatibilidade)
```

### Cenário 4: Adicionar tema escuro
```
3.0.5 → 3.1.0 ✅ MINOR (nova feature)
```

### Cenário 5: Reescrever parser KCS
```
3.0.5 → 4.0.0 ✅ MAJOR (quebra compatibilidade)
```

---

## 🎁 Bonus: Pre-Release

Se você quiser versões de teste:

```
3.0.5-alpha    ← Versão alfa (muito beta)
3.0.5-beta     ← Versão beta (testando)
3.0.5-rc1      ← Release Candidate 1 (quase pronto)
3.0.5-rc2      ← Release Candidate 2
3.0.5          ← Release final (PROD)
```

**No package.json:**
```json
{
  "version": "3.0.5-beta"
}
```

---

## 📚 Referência Oficial

Veja em: https://semver.org/

**Resumo SemVer:**
- MAJOR quando você faz mudanças incompatíveis na API
- MINOR quando você adiciona funcionalidade em um modo compatível com o passado
- PATCH quando você faz correções de bugs compatíveis

---

## 💡 Recomendação Para Seu Projeto

**Você está fazendo certo!**

```
3.0.4 (estado atual)
   ↓ Ctrl+F melhorado
3.0.5 ✅ CORRETO - É apenas melhoria
   ↓ Próxima melhoria/bug fix
3.0.6 ✅ Se for outro patch
   ↓ Quando adicionar nova feature grande
3.1.0 ✅ Aí sim! Nova feature (ex: modo escuro)
   ↓ Mais patches
3.1.1, 3.1.2, 3.1.3...
   ↓ Quando fizer grande mudança/quebra
4.0.0 ✅ Só quando necessário
```

**Dica:** Não se apresse para mudar MAJOR. Mantenha versão 3 o máximo possível! Versão 4 é para mudanças REAIS de compatibilidade.

