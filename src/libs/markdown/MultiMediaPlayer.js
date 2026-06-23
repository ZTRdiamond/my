export default function markdownItSimpleMedia(md) {
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const src = token.attrGet('src') || '';
    const alt = md.utils.escapeHtml(token.content || '');

    // Ekstrak ekstensi dari URL
    const urlWithoutQuery = src.split('?')[0];
    const ext = urlWithoutQuery.substring(urlWithoutQuery.lastIndexOf('.') + 1).toLowerCase();

    const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'm4v'];
    const audioExts = ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'];

    // 1. Render sebagai VIDEO jika formatnya cocok
    if (videoExts.includes(ext)) {
      return `
        <video controls class="max-w-full my-6 rounded-lg w-full">
          <source src="${src}">
        </video>
      `.trim();
    }

    // 2. Render sebagai AUDIO jika formatnya cocok
    if (audioExts.includes(ext)) {
      return `
        <audio controls class="max-w-md w-full my-6">
          <source src="${src}">
        </audio>
      `.trim();
    }

    // 3. Render sebagai GAMBAR STANDAR jika bukan video/audio
    return `<img src="${src}" alt="${alt}" loading="lazy" class="max-w-full h-auto rounded-lg my-6" />`;
  };
}