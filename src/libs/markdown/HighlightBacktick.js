export default function markdownItInlineHighlight(md, options = {}) {
  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    
    // Penjelasan kelas tambahan:
    // - before:content-none & after:content-none: Memaksa menghapus backtick bawaan dari Tailwind Typography (prose)
    // - bg-tint & text-blued: Tema paper (biru tinta lembut) sesuai design UI
    // - border-blue/25: Garis tepi halus untuk mempertegas kedalaman
    const highlightClasses = 'bg-tint text-blued px-1.5 py-0.5 rounded-md font-mono text-[0.9em] border border-blue/25 before:content-none after:content-none inline-block align-baseline';

    const existingClasses = token.attrGet('class') || '';
    token.attrSet('class', `${existingClasses} ${highlightClasses}`.trim());

    // Merender tag dengan kelas baru dan memastikan tidak ada karakter backtick tambahan di dalam konten
    return `<code${self.renderAttrs(token)}>${md.utils.escapeHtml(token.content)}</code>`;
  };
}