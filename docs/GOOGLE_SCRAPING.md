# 🔍 Google Scraping - Guia de Uso

## O que foi adicionado?

Um novo botão **"Buscar no Google 🔍"** foi adicionado ao modo de busca da aplicação. Este botão permite buscar artigos/resultados diretamente no Google usando scraping (sem afetar o código existente do Share Linx).

---

## 📋 Funcionalidades

### ✅ Busca no Google com Scraping
- **Botão independente**: Não afeta a busca do Share Linx
- **Scraping automático**: Extrai títulos, URLs e descrições dos resultados do Google
- **Seleção simples**: Clique em um resultado para selecioná-lo
- **Reutilização**: Use o resultado selecionado como base para formatação (local ou IA)

---

## 🚀 Como usar

### 1. Mudar para o modo "Buscar artigo no Share Linx"
```
Modo de uso: [Buscar artigo no Share Linx] ↓
```

### 2. Digitar um termo para buscar
```
[Digite um termo para buscar...]
```

### 3. Clicar em "Buscar no Google 🔍"
- A busca irá levar alguns segundos (dependendo da conexão)
- Resultados serão exibidos abaixo do campo de busca

### 4. Selecionar um resultado
- Clique em qualquer resultado para selecioná-lo (ficará destacado)
- O título, URL e descrição serão armazenados

### 5. Usar o artigo selecionado
- Clique em **"Usar artigo selecionado"**
- Escolha entre **Formatar com IA** ou **Usar formatador local**
- O conteúdo será automaticamente preenchido no formulário

---

## 🔧 Arquitetura

### Arquivos modificados:

#### 1. **main.js**
- Adicionado handler `search-google` que:
  - Faz requisição HTTP ao Google
  - Usa `cheerio` para fazer parsing do HTML
  - Extrai títulos, URLs e descrições
  - Retorna lista de até 10 resultados

#### 2. **renderer.js**
- Adicionado listener para o botão "Buscar no Google"
- Função `searchGoogle` que:
  - Valida o termo de busca
  - Chama o handler `search-google`
  - Exibe resultados na interface
  - Permite seleção de um resultado

#### 3. **preload.js**
- Exposto novo método: `window.electronAPI.searchGoogle(query)`

#### 4. **index.html**
- Adicionado botão com ID `searchGoogleBtn`
- Botão com estilo Google (azul)
- Mensagem informativa ao lado

---

## ⚙️ Detalhes Técnicos

### Bibliotecas usadas:
- **axios**: Para fazer requisições HTTP
- **cheerio**: Para parsing e extração de HTML

### Seletores CSS utilizados:
- `div[data-sokoban-container]` - Seletor primário do Google
- `div.Gx5Zad` - Seletor alternativo (fallback)

### Limitações:
- ⚠️ Google pode bloquear requisições repetidas (rate limiting)
- ⚠️ Mudanças no HTML do Google podem quebrar os seletores
- ⚠️ Máximo de 10 resultados por busca (configurável em `main.js`)

---

## 🧪 Testando

1. **Digite um termo comum** (ex: "como resetar senha")
2. **Clique em "Buscar no Google 🔍"**
3. **Veja os resultados** aparecerem em 5-10 segundos
4. **Selecione um resultado** (ficará com fundo destacado)
5. **Clique em "Usar artigo selecionado"**
6. **Escolha o método de formatação** (IA ou local)

---

## 📝 Exemplo de resultado

```
Buscar no Google 🔍
├─ Como resetar senha no Windows
│  └─ https://support.microsoft.com/...
├─ Recuperar senha do Windows 10
│  └─ https://www.techspot.com/...
└─ [mais resultados...]
```

---

## 🔄 Integração com o fluxo existente

O novo botão de scraping se integra perfeitamente com o fluxo existente:

```
1. Buscar no Google 🔍 (novo!)
         ↓
2. Selecionar resultado
         ↓
3. "Usar artigo selecionado"
         ↓
4. Escolher formatação (IA ou Local)
         ↓
5. Preencher formulário e visualizar preview
         ↓
6. Copiar ou baixar resultado
```

---

## 💡 Próximas melhorias (opcional)

- [ ] Filtrar por domínio (ex: apenas sites internos)
- [ ] Extrair conteúdo completo da página (não só titulo/URL)
- [ ] Cache de resultados
- [ ] Suporte para busca por tipo de documento
- [ ] Análise de relevância automática

---

## ❓ Troubleshooting

### "❌ Erro ao buscar no Google: timeout"
- Google pode estar bloqueando a requisição
- Tente novamente em alguns segundos
- Use um termo mais específico

### "🌐 Resultados do Google (0 encontrados)"
- Os seletores CSS podem ter mudado
- Verifique o console (F12) para mais detalhes
- Reporte para ajuste dos seletores

### "Resultado selecionado não aparece no preview"
- Clique em "Usar artigo selecionado"
- Escolha o método de formatação
- Os campos do formulário devem ser preenchidos

---

## 📞 Suporte

Se encontrar problemas, verifique:
1. Console do DevTools (F12) - Logs detalhados
2. Terminal da aplicação - Logs do Node.js
3. Conectividade com a internet
4. Se o Google está bloqueando a requisição

