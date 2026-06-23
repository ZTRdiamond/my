// Konfigurasi visual untuk setiap jenis kontainer (Ikon SVG, Kelas Tailwind, dsb)
const containerConfigs = {
  note: {
    wrapperClass: 'bg-sky-50/60 dark:bg-sky-950/20 border-sky-500 dark:border-sky-400 text-sky-800 dark:text-sky-300',
    titleClass: 'text-sky-800 dark:text-sky-300',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`
  },
  info: {
    wrapperClass: 'bg-sky-50/60 dark:bg-sky-950/20 border-sky-500 dark:border-sky-400 text-sky-800 dark:text-sky-300',
    titleClass: 'text-sky-800 dark:text-sky-300',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`
  },
  tip: {
    wrapperClass: 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300',
    titleClass: 'text-emerald-800 dark:text-emerald-300',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A7 7 0 0 0 4 8c0 1.3.5 2.6 1.5 3.5.7.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`
  },
  warning: {
    wrapperClass: 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-500 dark:border-amber-400 text-amber-800 dark:text-amber-300',
    titleClass: 'text-amber-800 dark:text-amber-300',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  },
  caution: {
    wrapperClass: 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-500 dark:border-amber-400 text-amber-800 dark:text-amber-300',
    titleClass: 'text-amber-800 dark:text-amber-300',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  },
  danger: {
    wrapperClass: 'bg-red-50/60 dark:bg-red-950/20 border-red-500 dark:border-red-400 text-red-800 dark:text-red-300',
    titleClass: 'text-red-800 dark:text-red-300',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
  }
};

export default function markdownItDocusaurusContainer(md) {
  const minMarkers = 3;
  const markerChar = 58; // Kode karakter ':'

  function containerBlock(state, startLine, endLine, silent) {
    let pos;
    let nextLine;
    let token;
    let autoClosed = false;
    let start = state.bMarks[startLine] + state.tShift[startLine];
    let max = state.eMarks[startLine];

    // Cek apakah baris diawali dengan ':'
    if (state.src.charCodeAt(start) !== markerChar) { return false; }

    // Hitung jumlah penanda ':'
    pos = start;
    while (pos < max && state.src.charCodeAt(pos) === markerChar) {
      pos++;
    }

    const markerCount = pos - start;
    if (markerCount < minMarkers) { return false; }

    const markup = state.src.slice(start, pos);
    const params = state.src.slice(pos, max).trim();

    // Pecah parameter untuk memisahkan TIPE kontainer dan JUDUL kustom
    const paramWords = params.split(' ');
    const name = paramWords[0].toLowerCase();
    
    const validTypes = Object.keys(containerConfigs);
    if (!validTypes.includes(name)) { return false; }

    // Judul kustom adalah teks sisa setelah nama tipe kontainer
    const title = params.slice(name.length).trim();

    if (silent) { return true; }

    // Cari baris penutup ':::'
    nextLine = startLine;
    for (;;) {
      nextLine++;
      if (nextLine >= endLine) {
        // Jika tidak ditutup manual, sistem akan otomatis menutupnya di akhir dokumen
        break;
      }

      start = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];

      if (state.src.charCodeAt(start) !== markerChar) { continue; }

      pos = start;
      while (pos < max && state.src.charCodeAt(pos) === markerChar) {
        pos++;
      }

      // Validasi kecocokan jumlah marker penutup
      if (pos - start >= markerCount) {
        const remaining = state.src.slice(pos, max).trim();
        if (remaining === '' || remaining.split('').every(char => char === ':')) {
          autoClosed = true;
          break;
        }
      }
    }

    // Token Pembuka Kontainer
    token = state.push(`container_${name}_open`, 'div', 1);
    token.markup = markup;
    token.block = true;
    token.meta = { name, title };
    token.map = [startLine, nextLine];

    const oldParentType = state.parentType;
    state.parentType = 'container';
    state.line = startLine + 1;

    // Tokenisasi rekursif untuk memproses markdown di dalam kontainer secara utuh
    state.md.block.tokenize(state, startLine + 1, nextLine);

    state.parentType = oldParentType;
    state.line = nextLine + (autoClosed ? 1 : 0);

    // Token Penutup Kontainer
    token = state.push(`container_${name}_close`, 'div', -1);
    token.markup = markup;
    token.block = true;

    return true;
  }

  // Daftarkan rule block ke parser markdown-it
  md.block.ruler.before('fence', 'docusaurus_containers', containerBlock, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  });

  // Daftarkan aturan renderer untuk HTML pembuka dan penutup
  const validTypes = Object.keys(containerConfigs);
  validTypes.forEach(type => {
    md.renderer.rules[`container_${type}_open`] = (tokens, idx) => {
      const token = tokens[idx];
      const { name, title } = token.meta;
      const config = containerConfigs[name];
      
      // Jika judul kustom kosong, tampilkan nama tipe default dalam huruf besar (e.g. NOTE)
      const displayTitle = title || name.toUpperCase();

      return `
        <div class="my-6 p-5 border-l-4 rounded-r-2xl ${config.wrapperClass} not-prose transition-all duration-200" role="alert">
          <div class="flex items-center gap-2 font-bold text-xs tracking-wider uppercase mb-2 ${config.titleClass}">
            ${config.icon}
            <span>${displayTitle}</span>
          </div>
          <div class="prose prose-sm dark:prose-invert max-w-none text-current leading-relaxed">
      `.trim();
    };

    md.renderer.rules[`container_${type}_close`] = () => {
      return `
          </div>
        </div>
      `.trim();
    };
  });
}