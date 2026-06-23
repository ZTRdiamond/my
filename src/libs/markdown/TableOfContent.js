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

// Helper untuk mengambil teks bersih dari token inline (menghindari tag markdown lain di dalam heading)
function getHeadingText(inlineToken) {
  if (!inlineToken.children) {
    return inlineToken.content;
  }
  return inlineToken.children
    .reduce((acc, child) => {
      if (child.type === 'text' || child.type === 'code_inline') {
        return acc + child.content;
      }
      return acc;
    }, '');
}

export default function markdownItDocusaurusToc(md, options = {}) {
  const containerClass = options.containerClass || 'my-6';

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

    // Langkah A: Cari dan kumpulkan semua heading (h2, h3, h4)
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === 'heading_open') {
        const level = parseInt(token.tag.slice(1)); // h2 -> 2, h3 -> 3, dsb.
        
        if (level > 1 && level < 5) {
          const inlineToken = tokens[i + 1];
          if (inlineToken && inlineToken.type === 'inline') {
            const text = getHeadingText(inlineToken);
            const slug = slugify(text);

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

// Helper perakitan komponen HTML Dropdown
function buildTocDropdownHtml(headings, containerClass) {
  if (headings.length === 0) {
    return '';
  }

  let html = `
  <div class="${containerClass} not-prose">
    <details class="group border border-sky-100 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 rounded-2xl overflow-hidden transition-all duration-300" open>
      
      <!-- Summary Toggle Header -->
      <summary class="flex items-center justify-between px-5 py-4 cursor-pointer font-bold text-sm text-sky-800 dark:text-sky-300 select-none hover:bg-sky-50 dark:hover:bg-sky-950/50 transition-all duration-300 focus:outline-none">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-sky-500"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
          <span>Table of Content</span>
        </div>
        <span class="transition-transform duration-300 group-open:rotate-180 text-sky-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </span>
      </summary>

      <!-- Panel Submenu Lists -->
      <div class="px-5 pb-5 pt-2 border-t border-sky-100/50 dark:border-sky-900/30 bg-white dark:bg-slate-900/40">
        <nav class="space-y-1 border-l-2 border-slate-200/60 dark:border-slate-800 pl-4">
  `;

  headings.forEach((heading) => {
    let indentClass = '';
    // Mengubah slate-750 menjadi slate-700 untuk kompatibilitas Tailwind bawaan
    let textStyle = 'font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400';
    
    if (heading.level === 3) {
      indentClass = 'pl-4 border-l border-slate-100 dark:border-slate-800/60 mt-1';
      textStyle = 'text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400';
    } else if (heading.level === 4) {
      indentClass = 'pl-8 border-l border-slate-100 dark:border-slate-800/60 mt-1';
      textStyle = 'text-xs font-light text-slate-400 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-400';
    }

    html += `
      <div class="${indentClass} py-1">
        <a href="#${heading.slug}" class="block text-sm transition-colors duration-200 ${textStyle}">
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