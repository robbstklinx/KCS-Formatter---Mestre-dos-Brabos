/**
 * KCS Finder - Sistema de busca avançado para janelas child
 * Ctrl+F com suporte a scroll, seleção e navegação
 */

window.__KcsFinder = {
  visible: false,
  matches: [],
  currentIndex: -1,

  /**
   * Escapar caracteres especiais de regex
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },

  /**
   * Limpar highlights antigos
   */
  clearHighlights() {
    document.querySelectorAll('.__kcs-highlight').forEach(el => {
      const parent = el.parentNode;
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }
      parent.removeChild(el);
    });
  },

  /**
   * Encontrar e fazer highlight das palavras
   */
  findAndHighlight(searchTerm) {
    this.clearHighlights();
    this.matches = [];
    this.currentIndex = -1;

    if (!searchTerm.trim()) {
      const countEl = document.getElementById('__kcs-finder-count');
      if (countEl) countEl.textContent = '0 resultados';
      return;
    }

    const escapedTerm = this.escapeRegex(searchTerm);
    const regex = new RegExp('(' + escapedTerm + ')', 'gi');
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    const nodesToReplace = [];

    while ((node = walker.nextNode())) {
      regex.lastIndex = 0;
      if (regex.test(node.textContent)) {
        nodesToReplace.push(node);
      }
    }

    // Substituir nós com spans highlights
    nodesToReplace.forEach(node => {
      const text = node.textContent;
      const parts = text.split(new RegExp('(' + escapedTerm + ')', 'gi'));

      const fragment = document.createDocumentFragment();
      parts.forEach(part => {
        if (part.toLowerCase() === searchTerm.toLowerCase()) {
          const span = document.createElement('span');
          span.className = '__kcs-highlight';
          span.textContent = part;
          span.style.backgroundColor = 'yellow';
          span.style.color = 'black';
          fragment.appendChild(span);
          this.matches.push(span);
        } else if (part) {
          fragment.appendChild(document.createTextNode(part));
        }
      });

      node.parentNode.replaceChild(fragment, node);
    });

    // Atualizar contador
    const count = this.matches.length;
    const countEl = document.getElementById('__kcs-finder-count');
    if (countEl) {
      countEl.textContent = `${count} resultado${count !== 1 ? 's' : ''}`;
    }

    // Selecionar primeiro resultado
    if (this.matches.length > 0) {
      this.selectMatch(0);
    }
  },

  /**
   * Selecionar e scrollar para um resultado
   */
  selectMatch(index) {
    if (index < 0 || index >= this.matches.length) return;

    // Remover seleção anterior
    this.matches.forEach(el => {
      el.style.backgroundColor = 'yellow';
      el.style.color = 'black';
    });

    // Selecionar novo
    this.currentIndex = index;
    const match = this.matches[index];
    match.style.backgroundColor = '#FF6B6B';
    match.style.color = 'white';
    match.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Selecionar texto
    const range = document.createRange();
    range.selectNodeContents(match);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  },

  /**
   * Inicializar o finder
   */
  init() {
    if (document.getElementById('__kcs-finder')) return;

    const finder = document.createElement('div');
    finder.id = '__kcs-finder';
    finder.innerHTML = `
      <div style="display: flex; gap: 10px; align-items: center; width: 100%; padding: 8px; font-size: 14px; border: 1px solid #ccc; 
        background: #fff; color: #333; position: fixed; top: 0; left: 0; 
        z-index: 999999; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <input id="__kcs-finder-input" type="text" placeholder="Buscar na página (Enter para próximo, Esc para fechar)..." 
          style="flex: 1; padding: 6px 8px; font-size: 14px; border: 1px solid #ccc; 
          background: white; color: #333; border-radius: 3px;">
        <span id="__kcs-finder-count" style="font-size: 12px; color: #666; min-width: 60px;">0 resultados</span>
        <button id="__kcs-finder-prev" style="padding: 4px 8px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">← Anterior</button>
        <button id="__kcs-finder-next" style="padding: 4px 8px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">Próximo →</button>
      </div>
    `;
    document.body.insertBefore(finder, document.body.firstChild);
    this.visible = true;

    const input = document.getElementById('__kcs-finder-input');
    const that = this;

    // Enter: próximo resultado
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (that.matches.length > 0) {
          let nextIndex = that.currentIndex + 1;
          if (nextIndex >= that.matches.length) {
            nextIndex = 0;
          }
          that.selectMatch(nextIndex);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        that.close();
      } else if (e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        if (that.matches.length > 0) {
          let prevIndex = that.currentIndex - 1;
          if (prevIndex < 0) {
            prevIndex = that.matches.length - 1;
          }
          that.selectMatch(prevIndex);
        }
      }
    });

    // Enquanto digita
    input.addEventListener('input', e => {
      that.findAndHighlight(e.target.value);
    });

    // Botão Anterior
    document.getElementById('__kcs-finder-prev').addEventListener('click', () => {
      if (that.matches.length > 0) {
        let prevIndex = that.currentIndex - 1;
        if (prevIndex < 0) {
          prevIndex = that.matches.length - 1;
        }
        that.selectMatch(prevIndex);
      }
    });

    // Botão Próximo
    document.getElementById('__kcs-finder-next').addEventListener('click', () => {
      if (that.matches.length > 0) {
        let nextIndex = that.currentIndex + 1;
        if (nextIndex >= that.matches.length) {
          nextIndex = 0;
        }
        that.selectMatch(nextIndex);
      }
    });

    input.focus();
  },

  /**
   * Fechar o finder
   */
  close() {
    const finder = document.getElementById('__kcs-finder');
    if (finder) finder.remove();
    this.visible = false;
    this.clearHighlights();
  },

  /**
   * Toggle (abrir/fechar)
   */
  toggle() {
    if (this.visible) {
      this.close();
    } else {
      this.init();
    }
  }
};
