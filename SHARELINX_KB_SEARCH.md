# 📚 Busca Share Linx KB - Versão Escopo Restrito

## O que mudou?

A busca agora é **focada apenas na base de conhecimento do Share Linx** em vez de buscar em todo o Google/DuckDuckGo/Bing.

---

## 🎯 Escopo da Busca

### Antes ❌
```
Buscava em:
- Google (todo internet)
- DuckDuckGo (todo internet)
- Bing (todo internet)
```

### Depois ✅
```
Busca somente em:
1. Share Linx API (Confluence REST) - Oficial
2. Google (apenas share.linx.com.br) - Fallback
3. DuckDuckGo (apenas share.linx.com.br) - Fallback
```

---

## 📍 URL Base da KB

```
https://share.linx.com.br/pages/viewpage.action?pageId=71895657
```

Todos os resultados agora vêm dessa página ou do domínio `share.linx.com.br`.

---

## 🌐 Estratégias de Busca

### 1️⃣ **Share Linx Confluence API** (Primária)
- Usa a **REST API do Confluence**
- Busca via CQL (Confluence Query Language)
- Retorna resultados oficiais da KB
- **Mais rápido e confiável**

```
URL: https://share.linx.com.br/rest/api/search
Parâmetro: cql=text~"termo" AND space=KB
```

### 2️⃣ **Google Scoped** (Fallback)
- Limita busca ao `site:share.linx.com.br`
- Funciona se Confluence API falhar
- Pode encontrar páginas indexadas pelo Google

```
URL: https://www.google.com/search?q=site:share.linx.com.br termo
```

### 3️⃣ **DuckDuckGo Scoped** (Último Recurso)
- Limita busca ao `site:share.linx.com.br`
- Sempre funciona (DuckDuckGo não bloqueia)
- Resultados menos precisos

```
URL: https://duckduckgo.com/html/?q=site:share.linx.com.br termo
```

---

## 🚀 Como Usar

### Passo a Passo

1. **Abra a aplicação** (já está rodando)
2. **Selecione modo "Buscar artigo no Share Linx"**
3. **Digite um termo** (ex: "como gerar nota fiscal")
4. **Clique "Buscar KB 📚"**
5. **Aguarde alguns segundos** (mais rápido agora!)
6. **Veja os resultados** da base de conhecimento
7. **Clique em um resultado** para selecionar
8. **Clique "Usar artigo selecionado"** para aplicar formatação

---

## 📊 Fluxo de Execução

```
Usuário clica "Buscar KB 📚"
    ↓
1. Tenta Confluence API (https://share.linx.com.br/rest/api/search)
    ├─ Sucesso? → Retorna resultados
    └─ Falha? → Próxima fonte
    ↓
2. Tenta Google (site:share.linx.com.br)
    ├─ Sucesso? → Retorna resultados
    └─ Falha? → Próxima fonte
    ↓
3. Tenta DuckDuckGo (site:share.linx.com.br)
    ├─ Sucesso? → Retorna resultados
    └─ Falha? → Erro
    ↓
Resultado final exibe qual fonte foi usada
```

---

## ✨ Melhorias

✅ **Escopo restrito** - Apenas Share Linx, sem "ruído" de outras páginas  
✅ **Mais rápido** - Confluence API é mais rápida que scraping do Google  
✅ **Mais confiável** - Fallbacks garantem que sempre funciona  
✅ **Resultados relevantes** - Base de conhecimento oficial apenas  
✅ **Sem bloqueio** - Mesmo que Google bloqueie, DuckDuckGo funciona  

---

## 🔧 Detalhes Técnicos

### Confluence REST API
- **Endpoint**: `/rest/api/search`
- **Parâmetro**: `cql` (CQL = Confluence Query Language)
- **Formato**: `text~"termo" AND space=KB`
- **Limite**: 10 resultados por busca

### Extração de Dados
- **Título**: `result.title`
- **URL**: `result.url` (prefixado com `https://share.linx.com.br`)
- **Descrição**: `result.excerpt` ou `result.content.body`
- **Source**: `Share Linx KB`

### Tratamento de HTML
- Remove tags HTML da descrição
- Limita a 150 caracteres
- Preserva formatação importante

---

## 🎨 Interface Atualizada

### Botão
```
Buscar KB 📚
[Botão azul (cor Share Linx)]
```

### Resultado
```
📚 Resultados da Base de Conhecimento (8 encontrados)
Fonte: Share Linx KB
Clique em um resultado para usar no artigo.

[Resultado 1] Share Linx KB
[Resultado 2] Share Linx KB
...
```

---

## ⚙️ Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| **main.js** | Handler reescrito com 3 estratégias de escopo Share Linx |
| **renderer.js** | UI atualizada com labels de "KB" e "Base de Conhecimento" |
| **index.html** | Botão agora diz "Buscar KB 📚" com tooltip |

---

## 🧪 Testando

### Teste 1: Busca Simples
1. Digite: "backup"
2. Clique "Buscar KB 📚"
3. Deveria aparecer artigos sobre backup

### Teste 2: Busca Específica
1. Digite: "como gerar nota fiscal"
2. Clique "Buscar KB 📚"
3. Deveria aparecer artigos sobre nota fiscal

### Teste 3: Verificar Fonte
1. Abra DevTools (F12) → Console
2. Faça uma busca
3. Verifique qual fonte foi usada:
   ```
   Share Linx KB (primária)
   Share Linx (Google) - fallback
   Share Linx (DuckDuckGo) - fallback
   ```

---

## 📝 Exemplo de Log

```
🔍 Buscando: "backup do sistema"
📍 Tentativa 1: Share Linx (Base de Conhecimento)...
📍 URL: https://share.linx.com.br/rest/api/search?cql=text~"backup do sistema"...
✅ Share Linx KB: Encontrados 5 resultados
```

---

## ⚠️ Limitações

- ⏱️ Confluence API pode ser lenta (5-10 segundos)
- 🔐 Requer acesso ao Share Linx (não privado)
- 📄 Limitado a 10 resultados por busca
- 🌐 Requer conexão com a internet

---

## 💡 Próximas Melhorias

- [ ] Cache de resultados recentes
- [ ] Suporte a filtros por tipo de documento
- [ ] Ordenação por relevância
- [ ] Busca por tags/etiquetas
- [ ] Preview do conteúdo completo

---

## 🔗 Links Úteis

- **Base de Conhecimento**: https://share.linx.com.br/pages/viewpage.action?pageId=71895657
- **Documentação Confluence**: https://confluence.atlassian.com/
- **CQL Reference**: https://confluence.atlassian.com/doc/confluence-query-language-cql

---

## 📞 Se Não Funcionar

### 1. Verifique Logs (F12 Console)
```
Procure por:
✅ Share Linx KB: Encontrados X resultados
⚠️ Share Linx error: [erro específico]
```

### 2. Teste Conectividade
```
Abra no navegador:
https://share.linx.com.br/rest/api/search?cql=text~"teste"
```

### 3. Verifique Acesso
```
Você tem acesso à base de conhecimento?
Tente acessar manualmente: https://share.linx.com.br
```

### 4. Tente Fallback Manual
```
Use "Buscar no Share Linx" (outro botão)
Ou acesse a KB diretamente no navegador
```

