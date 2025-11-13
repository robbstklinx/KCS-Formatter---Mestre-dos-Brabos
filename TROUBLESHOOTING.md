# 🔧 Troubleshooting - Scraping Multi-fonte

## Problema: "Nenhum resultado encontrado" (ainda)

Se mesmo com a versão multi-fonte você não está conseguindo resultados, siga este guia:

---

## 1️⃣ Verificar Conectividade

### Teste no navegador
1. Abra seu navegador favorito
2. Tente acessar:
   - `https://www.google.com`
   - `https://duckduckgo.com`
   - `https://www.bing.com`
3. Se nenhum funcionar → **Problema de internet**

### Se algum funcionou
- Se Google funcionou mas Scraper não: Vá para #2
- Se DuckDuckGo/Bing funcionaram: É bloqueio específico do Google

---

## 2️⃣ Verificar Logs Detalhados

### Abrir DevTools (F12)
1. Clique em "Buscar 🔍 Multi-fonte"
2. Pressione `F12` para abrir DevTools
3. Vá para aba **Console**
4. Procure por mensagens:
   - `✅ DuckDuckGo: Encontrados 8 resultados` → **DuckDuckGo funcionando!**
   - `⚠️ Google bloqueado: Error...` → **Google foi bloqueado**
   - `📍 Tentativa 3: Bing Search...` → **Testando Bing agora**

### Terminal (onde npm start rodou)
1. Verifique o terminal
2. Procure por:
   ```
   📍 Tentativa 1: Google com headers completos...
   ⚠️ Google bloqueado ou indisponível: ...
   📍 Tentativa 2: DuckDuckGo (alternativa)...
   ✅ DuckDuckGo: Encontrados 8 resultados
   ```

---

## 3️⃣ Problemas Comuns & Soluções

### Problema: "Timeout"
```
❌ Erro geral ao buscar: Error: timeout of 15000ms exceeded
```

**Causa:** Conexão lenta ou servidores indisponíveis
**Solução:**
- Tente novamente em alguns segundos
- Verifique sua velocidade de internet
- Feche outros programas que usam internet

---

### Problema: "429 Too Many Requests"
```
⚠️ Google bloqueado: Error: 429 Too Many Requests
```

**Causa:** Fez muitas requisições muito rápido
**Solução:**
- **Aguarde 5-10 minutos** (bloqueio temporário do Google)
- Volte a tentar
- Use DuckDuckGo/Bing enquanto espera

---

### Problema: "403 Forbidden"
```
⚠️ Bing error: Error: 403 Forbidden
```

**Causa:** Bloqueio por IP ou região
**Solução:**
- Use VPN para mudar localização
- Tente de outra rede/WiFi
- Espere um pouco antes de tentar novamente

---

### Problema: "0 resultados mesmo que deveria ter"
```
🔍 Buscando em múltiplas fontes...
(10-15 segundos depois)
❌ Nenhum resultado encontrado.
```

**Causa:** 
- Seletores CSS mudaram no Google/DuckDuckGo/Bing
- Termo muito genérico ou inválido

**Solução:**
- Tente um termo mais específico
- Use o Share Linx em vez disso
- Reporte se achar que é problema nosso

---

## 4️⃣ Testes de Diagnóstico

### Teste 1: Verificar cada fonte isoladamente

Abra o DevTools e coloque isto no **console** (F12):

```javascript
// Teste Google
fetch('https://www.google.com/search?q=teste', {
  headers: { 'User-Agent': 'Mozilla/5.0...' }
}).then(r => console.log('Google:', r.status)).catch(e => console.log('Google erro:', e.message))

// Teste DuckDuckGo
fetch('https://duckduckgo.com/html/?q=teste').then(r => console.log('DDG:', r.status)).catch(e => console.log('DDG erro:', e.message))

// Teste Bing
fetch('https://www.bing.com/search?q=teste').then(r => console.log('Bing:', r.status)).catch(e => console.log('Bing erro:', e.message))
```

Resultado esperado:
- 200 = Funcionando
- 403/429 = Bloqueado
- erro = Problema de conexão

---

### Teste 2: Verificar se Electron consegue fazer requisições

Coloque isto no **console do DevTools**:

```javascript
// Verificar se API está funcionando
window.electronAPI.searchGoogle('teste').then(r => {
  console.log('Resultado:', r);
  console.log('Itens:', r.items?.length || 0);
}).catch(e => {
  console.error('Erro ao chamar API:', e);
})
```

---

## 5️⃣ Se Nada Funcionar

### Opção 1: Usar Share Linx
- Volta para usar o Share Linx que você já tem configurado
- Scraping é um "bonus", não é crítico

### Opção 2: Reportar Problema
Colete estas informações:
1. **Logs do console** (F12) - copie e paste aqui
2. **Logs do terminal** (onde npm start rodou) - copie e paste aqui
3. **Termo que tentou buscar**
4. **Seu país/região** (alguns bloqueiam por localização)
5. **Se funciona em VPN** (indica problema de localização)

### Opção 3: Alternativa Temporária
Enquanto aguarda correção:
1. Faça busca manual no Google
2. Copie o link do resultado
3. Cole no preview do KCS Formatter
4. Use o formatador local

---

## 6️⃣ Para Desenvolvedores

### Ver todos os logs detalhados

Abra terminal onde npm start está rodando e procure por:

```
🔍 Buscando: "seu termo"
📍 Tentativa 1: Google com headers completos...
  [headers enviados]
  [resposta HTML primeiros 500 chars]
  [seletores testados]
⚠️ Google bloqueado: [erro específico]
📍 Tentativa 2: DuckDuckGo...
  [mesma coisa]
✅ DuckDuckGo: Encontrados 8 resultados
  [items retornados]
```

### Ativar debug mode

Edite `src/main.js` e procure por `console.log`:

```javascript
// Adicione isto pra ver mais detalhes:
console.log('HTML recebido:', response.data.substring(0, 1000));
console.log('Seletores testados:', selectors);
console.log('Elementos encontrados:', $('seletor').length);
```

---

## ✅ Checklist de Diagnóstico

- [ ] Testou conectividade no navegador (Google, DDG, Bing)
- [ ] Abriu DevTools (F12) e viu os logs
- [ ] Verificou console.log do terminal
- [ ] Tentou com termo diferente/mais específico
- [ ] Aguardou 5-10 minutos se recebeu "429 Too Many Requests"
- [ ] Testou com VPN (se acha que é bloqueio por localização)
- [ ] Tentou novamente em horário diferente
- [ ] Confirmou que Share Linx ainda funciona

---

## 📞 Suporte

Se depois de tudo isso ainda não funcionar:

1. **Collect all logs** (console + terminal)
2. **Screenshot da mensagem de erro**
3. **Seu termo de busca**
4. **Seu país/região**
5. **Se funciona com VPN**

E reporte o problema! 🐛

