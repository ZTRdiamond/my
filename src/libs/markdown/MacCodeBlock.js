import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';

// Cache untuk menghindari pemuatan ulang bahasa yang sama
const loadedLanguages = new Set(['markup', 'css', 'clike', 'javascript']);

// Peta alias bahasa agar kompatibel dengan penamaan di Prism
const languageMap = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  sh: 'bash',
  bash: 'bash',
  html: 'markup',
  xml: 'markup',
  svg: 'markup',
  md: 'markdown',
  yml: 'yaml',
  golang: 'go',
  rs: 'rust'
};

function highlightWithPrism(code, lang, md) {
  if (!lang) {
    return md.utils.escapeHtml(code);
  }

  const prismLang = languageMap[lang] || lang;

  try {
    // Muat komponen bahasa secara dinamis jika belum ada di cache
    if (!loadedLanguages.has(prismLang)) {
      loadLanguages([prismLang]);
      loadedLanguages.add(prismLang);
    }
  } catch (e) {
    // Abaikan jika bahasa tidak didukung atau gagal dimuat oleh komponen Prism
  }

  const grammar = Prism.languages[prismLang];
  if (grammar) {
    return Prism.highlight(code, grammar, prismLang);
  }

  // Fallback ke teks biasa jika bahasa tidak terdaftar di Prism
  return md.utils.escapeHtml(code);
}

export default function markdownItMacCodeBlock(md) {
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const code = token.content;
    const info = token.info ? token.info.trim() : '';
    const parts = info.split(/\s+/);
    const lang = parts[0] || 'text';
    
    let title = '';
    const titleMatch = info.match(/title="([^"]+)"/);
    if (titleMatch) {
      title = titleMatch[1];
    } else {
      title = lang.toUpperCase();
    }

    // Memproses syntax highlighting di sisi server menggunakan Prism.js
    const highlightedCode = highlightWithPrism(code, lang, md);

    // Skrip Inline untuk Salin (Copy)
    const copyScript = `
      const pre = this.closest('.code-container').querySelector('pre');
      const codeText = pre.querySelector('code').innerText;
      navigator.clipboard.writeText(codeText);
      const copyIcon = this.querySelector('.copy-icon');
      const checkIcon = this.querySelector('.check-icon');
      copyIcon.classList.add('hidden');
      checkIcon.classList.remove('hidden');
      setTimeout(() => {
        copyIcon.classList.remove('hidden');
        checkIcon.classList.add('hidden');
      }, 2000);
    `.replace(/\s+/g, ' ').trim();

    // Skrip Inline untuk Word-Wrap Toggle
    const wrapScript = `
      const pre = this.closest('.code-container').querySelector('pre');
      const isWrapped = pre.classList.toggle('whitespace-pre-wrap');
      pre.classList.toggle('whitespace-pre');
      const wrapIcon = this.querySelector('.wrap-icon');
      const unwrapIcon = this.querySelector('.unwrap-icon');
      if (isWrapped) {
        wrapIcon.classList.add('hidden');
        unwrapIcon.classList.remove('hidden');
        this.setAttribute('title', 'Unwrap Code');
      } else {
        wrapIcon.classList.remove('hidden');
        unwrapIcon.classList.add('hidden');
        this.setAttribute('title', 'Wrap Code');
      }
    `.replace(/\s+/g, ' ').trim();

    return `
      <div class="code-container relative border border-slate-200/80 dark:border-slate-800/80 rounded-2xl my-6 bg-[#1e1e2e] dark:bg-[#11111b] shadow-md overflow-hidden not-prose transition-all duration-300">
        <!-- Header Mac Terminal Style -->
        <div class="flex items-center justify-between px-4 py-3 bg-[#181825]/90 dark:bg-[#11111b]/90 border-b border-slate-800/30 select-none">
          <!-- Dot Mac Tiga Warna -->
          <div class="flex items-center gap-1.5 w-1/4">
            <span class="w-3 h-3 rounded-full bg-rose-500/90 block"></span>
            <span class="w-3 h-3 rounded-full bg-amber-400/90 block"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-500/90 block"></span>
          </div>
          <!-- Judul File -->
          <div class="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 text-center flex-grow max-w-[50%] truncate">
            ${title}
          </div>
          <!-- Kontrol Kanan -->
          <div class="flex items-center gap-1.5 w-1/4 justify-end">
            <button onclick="${wrapScript}" class="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/60 hover:border-slate-700 text-slate-400 hover:text-slate-100 transition-all duration-200 focus:outline-none" title="Wrap Code">
              <svg class="wrap-icon w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M3 12h15a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H3"/><path d="m7 14-4 4 4 4"/></svg>
              <svg class="unwrap-icon w-3.5 h-3.5 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <button onclick="${copyScript}" class="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/60 hover:border-slate-700 text-slate-400 hover:text-slate-100 transition-all duration-200 focus:outline-none" title="Copy Code">
              <svg class="copy-icon w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <svg class="check-icon w-3.5 h-3.5 hidden text-emerald-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
          </div>
        </div>
        <!-- Area Teks Kode dengan Token Prism -->
        <pre class="p-4 m-0 bg-transparent text-sm font-mono whitespace-pre overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"><code class="language-${lang}">${highlightedCode}</code></pre>
      </div>
    `.trim();
  };
}