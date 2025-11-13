// ===== preload.js =====
const { contextBridge, ipcRenderer } = require('electron');

// Ponte segura entre front-end e Electron
contextBridge.exposeInMainWorld('electronAPI', {
  askAI: (prompt) => ipcRenderer.invoke('ask-ai', prompt),
  searchShare: (query) => ipcRenderer.invoke('search-share', query),
  searchGoogle: (query) => ipcRenderer.invoke('search-google', query),
  extractArticleContent: (url) => ipcRenderer.invoke('extract-article-content', url),
  openArticleWindow: (url, title) => ipcRenderer.invoke('open-article-window', url, title)
});
