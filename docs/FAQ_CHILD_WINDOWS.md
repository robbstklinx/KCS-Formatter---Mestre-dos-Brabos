# ❓ FAQ - Janelas Child (v3.0.2)

## 🎯 Perguntas Frequentes

---

### **P: Como abrir um artigo em janela child?**
A: Clique no botão `🔗 Abrir` que aparece ao lado de cada artigo nos resultados de busca.

---

### **P: A janela child bloqueia a janela principal?**
A: Não! A janela principal continua funcionando normalmente. Você pode deixar múltiplas janelas abertas simultaneamente.

---

### **P: Como fechar a janela child?**
A: Clique no botão "X" no canto superior direito da janela child. A janela principal não é afetada.

---

### **P: Funciona a tecla Ctrl+F para localizar?**
A: Sim! Pressione `Ctrl+F` para abrir o localizador de texto nativo do navegador. Funciona perfeitamente.

---

### **P: Como aumentar o zoom?**
A: Use `Ctrl++` para aumentar e `Ctrl+-` para diminuir. Use `Ctrl+0` para resetar ao tamanho normal.

---

### **P: Posso clicar em links dentro da janela child?**
A: Links internos (do mesmo domínio) funcionam normalmente. Links externos abrem no seu navegador padrão.

---

### **P: O que aparece no clique direito?**
A: Um menu completo com:
- Copiar/Colar/Recortar
- Selecionar Tudo
- Localizar na página
- Recarregar
- Inspecionar elemento

---

### **P: Como recarregar a página se ela carregar mal?**
A: Pressione `F5` ou `Ctrl+Shift+R` (para recarregar sem cache).

---

### **P: Posso ter 2 ou mais janelas abertas ao mesmo tempo?**
A: Sim! Abra quantas janelas quiser. Cada uma é independente.

---

### **P: Como copiar um trecho de texto da janela?**
A: 
1. Selecione o texto com mouse/teclado
2. Pressione `Ctrl+C` ou clique direito → Copiar
3. Volte ao editor principal
4. Pressione `Ctrl+V` para colar

---

### **P: A janela child tem DevTools?**
A: Sim, você pode acessar via clique direito → Inspecionar. Útil para debug (produção não abre automaticamente).

---

### **P: Posso abrir PDFs em janela child?**
A: Sim, se a URL aponta para um PDF ou HTML renderizado.

---

### **P: E se a página tiver JavaScript?**
A: JavaScript é executado normalmente (em ambiente seguro/sandboxed).

---

### **P: Qual é o tamanho padrão da janela?**
A: 1000px de largura × 700px de altura. Você pode redimensionar.

---

### **P: A janela lembra do tamanho anterior?**
A: Não, mas você pode redimensionar a cada vez que abrir. (Isso pode ser melhorado em futuras versões).

---

### **P: Funciona em URLs com autenticação?**
A: Sim, se você já está autenticado no Share Linx, a janela child herda a sessão.

---

### **P: Posso salvar a página como PDF?**
A: Você pode usar a opção de print (clique direito → imprimir como PDF), mas não há botão de salvamento direto.

---

### **P: Como voltar/avançar entre páginas?**
A: Use `Alt+Seta Esquerda` (voltar) ou `Alt+Seta Direita` (avançar) se a página souber de navegação anterior.

---

### **P: A segurança é garantida?**
A: Sim! A janela child roda em sandboxed mode:
- Sem acesso a filesystem
- Sem acesso a APIs do Electron
- Sem acesso a senhas/dados confidenciais
- Validação de URL antes de abrir

---

### **P: Consigo abrir qualquer site?**
A: A aplicação foi projetada para o Share Linx, mas funciona com HTTPS válidas. URLs inválidas são bloqueadas.

---

### **P: Qual navegador é usado?**
A: Chromium/Blink (engine do Electron, mesmo que Google Chrome).

---

### **P: Funciona offline?**
A: Não, você precisa de conexão internet. Tenta-se carregar URLs externas.

---

### **P: Como relatar bugs da janela child?**
A: Abra uma issue no repositório Git do projeto com:
1. Screenshots
2. Passos para reproduzir
3. URL que causou o problema
4. Versão do app

---

### **P: Posso personalizar o tamanho/posição?**
A: Não por UI. Se precisar, deve editar `main.js` na função `createArticleWindow()`.

---

### **P: Como habilitaré DevTools em produção?**
A: DevTools está desabilitado em produção. Para ativar, descomente a linha em `main.js`:
```javascript
// childWindow.webContents.openDevTools();
```

---

### **P: Qual é a diferença entre recarregar e recarregar cache?**
A:
- **Recarregar (F5)**: Recarrega do cache local (mais rápido)
- **Recarregar Cache (Ctrl+Shift+R)**: Baixa versão nova do servidor (mais lento, garante última versão)

---

### **P: Funciona em Mac/Linux?**
A: O código está pronto para Mac/Linux, mas o app foi testado em Windows. Feedback bem-vindo!

---

## 🎯 Dicas e Truques

### Dica 1: Localizar e Copiar
```
1. Abrir artigo (🔗 Abrir)
2. Pressionar Ctrl+F
3. Digitar termo a procurar
4. Navegar com Enter/Setas
5. Duplo clique para selecionar palavra
6. Ctrl+C para copiar
```

### Dica 2: Múltiplas Janelas
```
1. Abrir Artigo A (🔗 Abrir)
2. Voltar ao editor principal
3. Buscar novo termo
4. Abrir Artigo B (🔗 Abrir)
5. Agora tem 2 janelas lado a lado
```

### Dica 3: Aumentar Zoom para Ler Melhor
```
1. Abrir artigo
2. Pressionar Ctrl++ várias vezes
3. Ler conteúdo maior
4. Pressionar Ctrl+0 para resetar quando terminar
```

### Dica 4: Rapidez
```
🔗 Abrir → [Ctrl+F] → Digitar termo → Copiar → Cola no editor
```

---

## 🚨 Problemas Comuns

### ❌ "Janela não abre"
**Solução:**
- Verifique sua conexão internet
- Confirme que a URL é válida (começa com http://)
- Tente recarregar a página original

### ❌ "Ctrl+F não funciona"
**Solução:**
- Use F3 como alternativa
- Tente Cmd+F se em Mac
- Verifique se a página carregou completamente

### ❌ "Página em branco"
**Solução:**
- Pressione F5 para recarregar
- Tente Ctrl+Shift+R para recarregar sem cache
- Verifique firewall/proxy

### ❌ "Não consigo copiar"
**Solução:**
- Selecione o texto primeiro (arrastar mouse)
- Pressione Ctrl+C
- Se não funcionar, try clique direito → Copiar
- Verifique se o texto não é imagem

### ❌ "A janela ficou muito pequena/grande"
**Solução:**
- Arrastar borda para redimensionar
- Fechar e abrir novamente (volta ao tamanho padrão 1000x700)

---

## ✅ Checklist de Funcionalidades

Ao abrir janela child, confirme que você consegue:

- [ ] Ver o conteúdo da página
- [ ] Aumentar/diminuir zoom (Ctrl +/-)
- [ ] Localizar texto (Ctrl+F)
- [ ] Copiar trechos (Ctrl+C)
- [ ] Colar no editor (Ctrl+V)
- [ ] Recarregar página (F5)
- [ ] Inspecionar elementos (Clique D → Inspecionar)
- [ ] Redimensionar janela (arrastar bordas)
- [ ] Fechar sem afetar editor (X no canto)

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique este FAQ
2. Veja `FEATURE_CHILD_WINDOWS.md` para detalhes técnicos
3. Reporte no repositório Git com detalhes

---

**Última atualização:** v3.0.2
**Status:** ✅ Pronto para uso

