// Helper untuk merubah teks heading menjadi ID URL slug yang ramah SEO
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export default function markdownItGithubAnchor(md, options = {}) {
  const originalHeadingOpen = md.renderer.rules.heading_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const level = parseInt(token.tag.slice(1));
    
    let slug = token.attrGet('id');
    if (!slug) {
      const inlineToken = tokens[idx + 1];
      if (inlineToken && inlineToken.type === 'inline') {
        slug = slugify(inlineToken.content);
        token.attrSet('id', slug);
      }
    }

    // Menambahkan 'pl-6 md:pl-8' untuk mendorong teks heading ke dalam secara aman
    let headingClasses = 'group flex items-center relative font-bold text-slate-900 dark:text-slate-100 scroll-mt-24 transition-all duration-200 hover:underline hover:underline-offset-4 hover:decoration-slate-300 dark:hover:decoration-slate-700 pl-6 md:pl-8';
    
    if (token.tag === 'h1') {
      headingClasses += ' text-3xl md:text-4xl mt-10 mb-6';
    } else if (token.tag === 'h2') {
      headingClasses += ' text-2xl md:text-3xl mt-8 mb-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-2 w-full';
    } else if (token.tag === 'h3') {
      headingClasses += ' text-xl md:text-2xl mt-6 mb-3';
    } else if (token.tag === 'h4') {
      headingClasses += ' text-lg md:text-xl mt-4 mb-2';
    } else {
      headingClasses += ' text-base mt-4 mb-2';
    }

    const existingClasses = token.attrGet('class') || '';
    token.attrSet('class', `${existingClasses} ${headingClasses}`.trim());

    const renderedOpen = originalHeadingOpen(tokens, idx, options, env, self);

    if (slug) {
      // Mengubah posisi koordinat dari '-left-6' menjadi 'left-0' agar berada di dalam padding heading
      const anchorHtml = `
        <a class="absolute left-0 md:left-1 text-slate-350 dark:text-slate-600 hover:text-sky-500 dark:hover:text-sky-400 select-none focus:outline-none flex items-center justify-center no-underline w-5 h-5" href="#${slug}" aria-hidden="true" title="Direct link to heading" style="text-decoration: none !important;">
          <!-- Default: Menampilkan karakter '#' -->
          <span class="group-hover:hidden text-slate-300 dark:text-slate-600 font-medium">#</span>
          
          <!-- Hover: Berubah menjadi Icon Link SVG -->
          <span class="hidden group-hover:inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="align-middle"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          </span>
        </a>
      `.trim();
      
      return renderedOpen + '\n' + anchorHtml;
    }

    return renderedOpen;
  };
}