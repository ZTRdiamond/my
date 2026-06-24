// Helper untuk merubah teks heading menjadi ID URL slug yang ramah SEO
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Ganti spasi dengan tanda hubung (-)
    .replace(/[^\w\-]+/g, '')       // Hapus semua karakter non-word
    .replace(/\-\-+/g, '-');        // Cegah tanda hubung ganda
}

// Helper yang ditingkatkan untuk mengekstrak teks bersih dari semua jenis token inline secara aman
function getHeadingText(inlineToken) {
  if (!inlineToken.children || inlineToken.children.length === 0) {
    return inlineToken.content || '';
  }
  return inlineToken.children
    .map(child => {
      // Ambil isi konten dari tipe token apa pun yang memiliki atribut content (termasuk emoji, html, text, dll.)
      if (child.content) {
        return child.content;
      }
      // Jika mendeteksi baris baru (softbreak/hardbreak), ganti dengan spasi agar teks tidak menyatu rapat
      if (child.type === 'softbreak' || child.type === 'hardbreak') {
        return ' ';
      }
      return '';
    })
    .join('');
}

export default function markdownItDocusaurusToc(md, options = {}) {
  const containerClass = options.containerClass || 'my-6';
  
  // Konfigurasi level heading minimum dan maksimum yang ingin ditampilkan (Bawaan: H1 s.d H6)
  const minLevel = options.minLevel !== undefined ? options.minLevel : 1;
  const maxLevel = options.maxLevel !== undefined ? options.maxLevel : 6;

  // 1. Block Rule untuk mendeteksi [[toc]] secara mandiri
  md.block.ruler.before('paragraph', 'docusaurus_toc_block', (state, startLine, endLine, silent) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const lineText = state.src.slice(pos, max).trim();

    if (lineText !== '[[toc]]') {
      return false;
    }

    if (silent) {
      return true;
    }

    state.line = startLine + 1;

    // Buat token kustom block untuk TOC
    const token = state.push('docusaurus_toc_block', 'div', 0);
    token.map = [startLine, state.line];
    
    return true;
  });

  // 2. Core Rule untuk mengumpulkan heading & memasang ID Anchor pada fase Parsing
  md.core.ruler.push('docusaurus_toc_collect', (state) => {
    const tokens = state.tokens;
    const headings = [];

    // Langkah A: Cari dan kumpulkan semua heading berdasarkan rentang level yang dikonfigurasi
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === 'heading_open') {
        const level = parseInt(token.tag.slice(1)); // h1 -> 1, h2 -> 2, dsb.
        
        if (level >= minLevel && level <= maxLevel) {
          const inlineToken = tokens[i + 1];
          if (inlineToken && inlineToken.type === 'inline') {
            const text = getHeadingText(inlineToken);
            // Tambahkan fallback acak jika slugify menghasilkan string kosong agar navigasi tidak rusak
            const slug = slugify(text) || `heading-${Math.random().toString(36).substring(2, 7)}`;

            // Pasang ID Anchor secara aman sebelum masuk fase render
            token.attrSet('id', slug);

            headings.push({ level, text, slug });
          }
        }
      }
    }

    // Langkah B: Simpan data headings ke dalam token docusaurus_toc_block yang ditemukan
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'docusaurus_toc_block') {
        tokens[i].meta = { headings };
      }
    }
  });

  // 3. Renderer Rule untuk membuat tampilan list dropdown
  md.renderer.rules.docusaurus_toc_block = (tokens, idx, opts, env, self) => {
    const token = tokens[idx];
    const headings = (token.meta && token.meta.headings) || [];

    // Render komponen dropdown jika heading ditemukan
    return buildTocDropdownHtml(headings, containerClass);
  };
}

// Helper perakitan komponen HTML Dropdown dengan bingkai Biru dan warna teks yang diredam lembut
function buildTocDropdownHtml(headings, containerClass) {
  if (headings.length === 0) {
    return '';
  }

  let html = `
  <div class="${containerClass} not-prose">
    <!-- Mengembalikan bingkai dan latar belakang Biru (Sky Blue) yang sudah benar sebelumnya -->
    <details class="group border border-sky-100 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-950/20 rounded-2xl overflow-hidden transition-all duration-300" open>
      
      <!-- Summary Toggle Header (Menggunakan warna biru beraksen lembut di mode gelap) -->
      <summary class="flex items-center justify-between px-5 py-4 cursor-pointer font-bold text-sm text-sky-800 dark:text-sky-400/90 select-none hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-all duration-300 focus:outline-none">
        <div class="flex items-center gap-2">
          <!-- Mengembalikan warna ikon biru sebelumnya -->
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-sky-500 dark:text-sky-400/80"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
          <span>Table of Content</span>
        </div>
        <span class="transition-transform duration-300 group-open:rotate-180 text-sky-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </span>
      </summary>

      <!-- Panel Submenu Lists -->
      <div class="px-5 pb-5 pt-2 border-t border-sky-100/50 dark:border-sky-900/30 bg-white dark:bg-slate-900/40">
        <nav class="space-y-1 pl-2">
  `;

  headings.forEach((heading) => {
    let indentClass = 'pl-0';
    // Base style dengan hover biru (sky) yang interaktif
    let textStyle = 'block transition-colors duration-200 hover:text-sky-500 dark:hover:text-sky-400';
    
    switch (heading.level) {
      case 1:
        indentClass = 'pl-0';
        // Mengubah warna putih mencolok (slate-100) menjadi putih abu-abu yang lebih adem (slate-300)
        textStyle += ' text-sm font-bold text-slate-800 dark:text-slate-300';
        break;
      case 2:
        indentClass = 'pl-2 border-l-2 border-slate-200/85 dark:border-slate-800/80';
        // Mengubah dark:text-slate-300 menjadi slate-300 dengan sedikit transparansi agar lebih redup
        textStyle += ' text-sm font-semibold text-slate-700 dark:text-slate-300/90';
        break;
      case 3:
        indentClass = 'pl-6 border-l border-slate-200/60 dark:border-slate-800/40 mt-1';
        // Teks level 3 menggunakan slate-400 yang lebih lembut dibanding level di atasnya
        textStyle += ' text-xs font-medium text-slate-500 dark:text-slate-400';
        break;
      case 4:
        indentClass = 'pl-10 border-l border-slate-100/50 dark:border-slate-900/30 mt-1';
        // Menggunakan slate-400 dengan opasitas 80% agar kontrasnya pas dan tidak terlalu terang
        textStyle += ' text-xs font-light text-slate-400 dark:text-slate-400/80';
        break;
      case 5:
        indentClass = 'pl-12 border-l border-dashed border-slate-100/50 dark:border-slate-900/20 mt-1';
        textStyle += ' text-[11px] font-light text-slate-400/80 dark:text-slate-500';
        break;
      case 6:
        indentClass = 'pl-16 border-l border-dashed border-slate-100/50 dark:border-slate-900/20 mt-1';
        textStyle += ' text-[10px] font-light text-slate-400/60 dark:text-slate-550';
        break;
    }

    html += `
      <div class="${indentClass} py-1">
        <a href="#${heading.slug}" class="${textStyle}">
          ${heading.text}
        </a>
      </div>
    `;
  });

  html += `
        </nav>
      </div>
    </details>
  </div>
  `;

  return html;
}