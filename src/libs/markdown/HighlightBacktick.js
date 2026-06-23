export default function markdownItInlineHighlight(md, options = {}) {
  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    
    // Penjelasan kelas tambahan:
    // - before:content-none & after:content-none: Memaksa menghapus backtick bawaan dari Tailwind Typography (prose)
    // - bg-cyan-50 dark:bg-cyan-950/40: Warna latar biru laut muda yang cerah
    // - shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]: Efek shadow dalam (inner shadow) yang tipis dan presisi
    // - border border-cyan-100/80 dark:border-cyan-900/30: Garis tepi halus untuk mempertegas kedalaman shadow
    const highlightClasses = 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200 px-1.5 py-0.5 rounded-md font-mono text-[0.9em] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] border border-cyan-100/80 dark:border-cyan-900/30 before:content-none after:content-none inline-block align-baseline';

    const existingClasses = token.attrGet('class') || '';
    token.attrSet('class', `${existingClasses} ${highlightClasses}`.trim());

    // Merender tag dengan kelas baru dan memastikan tidak ada karakter backtick tambahan di dalam konten
    return `<code${self.renderAttrs(token)}>${md.utils.escapeHtml(token.content)}</code>`;
  };
}