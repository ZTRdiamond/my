export default function markdownItOceanTabs(md) {
  // ==========================================
  // TAHAP 1: PARSING BLOCK (Depth Tracker)
  // ==========================================
  md.block.ruler.before('fence', 'ocean_tabs', (state, startLine, endLine, silent) => {
    let start = state.bMarks[startLine] + state.tShift[startLine];
    let max = state.eMarks[startLine];
    let lineText = state.src.slice(start, max).trim();

    if (!lineText.startsWith(';;tabs')) return false;

    let markerCount = 0;
    for (let i = 0; i < lineText.length; i++) {
      if (lineText[i] === ';') markerCount++;
      else break;
    }
    if (markerCount < 2) return false;

    if (silent) return true;

    let nextLine = startLine;
    let depth = 1; 
    let autoClosed = false;
    
    while (++nextLine < endLine) {
      start = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      let currentLineText = state.src.slice(start, max).trim();

      if (currentLineText.startsWith(';;tabs')) {
        depth++;
      } else if (currentLineText.match(/^;{2,}$/)) {
        depth--;
        if (depth === 0) {
          autoClosed = true;
          break;
        }
      }
    }

    const content = state.getLines(startLine + 1, nextLine, state.tShift[startLine], false);
    state.line = nextLine + (autoClosed ? 1 : 0);

    const token = state.push('ocean_tabs', 'div', 0);
    token.content = content;
    token.block = true;
    token.map = [startLine, state.line];

    return true;
  });

  // ==========================================
  // TAHAP 2: RENDERING & SPLIT TABS CERDAS
  // ==========================================
  let tabCounter = 0;

  md.renderer.rules.ocean_tabs = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const rawContent = token.content; 
    
    tabCounter++;
    const groupId = `ocean-group-${tabCounter}`;

    const lines = rawContent.split('\n');
    const tabs = [];
    let currentTab = null;
    let depth = 0; 
    let localTabIndex = 0; // PENYELESAI MASALAH: Penghitung ID tab internal

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimLine = line.trim();

      if (trimLine.startsWith(';;tabs')) {
        depth++;
      } else if (trimLine.match(/^;{2,}$/)) {
        if (depth > 0) depth--;
      }

      // Potong dan buat Tab BARU
      if (depth === 0 && trimLine.startsWith('@tab')) {
        const title = trimLine.replace(/^@tab\s+/, '').trim();
        localTabIndex++; // Tambah index setiap menemukan @tab baru
        
        currentTab = { 
          id: `tab-${tabCounter}-${localTabIndex}`, // MEMASANG ID UNIK SECARA BENAR
          title: title, 
          contentLines: [] 
        };
        tabs.push(currentTab);
        continue; 
      }

      // Masukkan baris teks ke dalam Tab
      if (currentTab) {
        currentTab.contentLines.push(line);
      }
    }

    if (tabs.length === 0) return '';

    // ==========================================
    // UI BUILDER HTML
    // ==========================================
    let html = `<div class="ocean-tabs my-6 rounded-2xl border border-sky-100 dark:border-sky-900/60 bg-white dark:bg-slate-900 shadow-sm overflow-hidden not-prose transition-all duration-300 w-full">`;
    
    // Header Navigasi Tombol
    html += `<div class="flex overflow-x-auto border-b border-sky-100 dark:border-sky-900/60 bg-sky-50/50 dark:bg-slate-900/50 scrollbar-hide" role="tablist">`;
    
    tabs.forEach((tab, index) => {
      const isActive = index === 0;
      const activeClass = isActive 
        ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white dark:bg-slate-900' 
        : 'border-transparent text-slate-500 hover:text-sky-500 hover:bg-sky-50 dark:text-slate-400 dark:hover:text-sky-300 dark:hover:bg-slate-800/40';
      
      html += `
        <button class="tab-btn relative whitespace-nowrap px-6 py-3.5 text-sm font-semibold border-b-2 transition-all duration-200 focus:outline-none ${activeClass}" 
          role="tab" onclick="switchOceanTab(this, '${groupId}', '${tab.id}')" data-group="${groupId}">
          ${tab.title}
        </button>
      `;
    });
    html += `</div>`;

    // Area Konten Panes
    html += `<div class="p-5 sm:p-6 bg-white dark:bg-slate-900">`;
    tabs.forEach((tab, index) => {
      const isActive = index === 0;
      const displayClass = isActive ? 'block animate-fade-in' : 'hidden';
      
      const tabMarkdownText = tab.contentLines.join('\n');
      const renderedMarkdown = md.render(tabMarkdownText, env);
      
      html += `
        <div id="${tab.id}" class="tab-pane ${displayClass} prose prose-slate dark:prose-invert prose-sky max-w-none" role="tabpanel" data-group="${groupId}">
          ${renderedMarkdown}
        </div>
      `;
    });
    html += `</div></div>`;

    // ==========================================
    // JAVASCRIPT CLICK LISTENER
    // ==========================================
    const script = `
      <script>
        if (typeof window.switchOceanTab !== 'function') {
          window.switchOceanTab = function(btn, groupId, tabId) {
            // Matikan semua tombol di grup yang sama
            const allBtns = document.querySelectorAll('.tab-btn[data-group="' + groupId + '"]');
            allBtns.forEach(b => {
              b.className = 'tab-btn relative whitespace-nowrap px-6 py-3.5 text-sm font-semibold border-b-2 transition-all duration-200 focus:outline-none border-transparent text-slate-500 hover:text-sky-500 hover:bg-sky-50 dark:text-slate-400 dark:hover:text-sky-300 dark:hover:bg-slate-800/40';
            });
            // Aktifkan tombol yang diklik
            btn.className = 'tab-btn relative whitespace-nowrap px-6 py-3.5 text-sm font-semibold border-b-2 transition-all duration-200 focus:outline-none border-sky-500 text-sky-600 dark:text-sky-400 bg-white dark:bg-slate-900';
            
            // Sembunyikan semua pane konten di grup yang sama
            const allPanes = document.querySelectorAll('.tab-pane[data-group="' + groupId + '"]');
            allPanes.forEach(p => { 
              p.classList.add('hidden'); 
              p.classList.remove('block', 'animate-fade-in'); 
            });
            
            // Tampilkan pane konten berdasarkan ID
            const activePane = document.getElementById(tabId);
            if (activePane) { 
              activePane.classList.remove('hidden'); 
              activePane.classList.add('block', 'animate-fade-in'); 
            }
          }
        }
      </script>
    `;

    return html + script;
  };
}