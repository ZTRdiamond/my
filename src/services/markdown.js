import MarkdownIt from 'markdown-it';
import markdownItAnchor from './../libs/markdown/GithubAnchor.js';
import markdownItToc from './../libs/markdown/TableOfContent.js';
import markdownItMultimdTable from 'markdown-it-multimd-table';
import markdownItAdmonition from './../libs/markdown/AdmonitionContainer.js';
import markdownItMacCodeblock from "./../libs/markdown/MacCodeBlock.js"
import markdownItMediaPlayer from './../libs/markdown/MultiMediaPlayer.js'
import markdownItTabs from './../libs/markdown/Tabs.js';
import markdownItBacktick from "./../libs/markdown/HighlightBacktick.js"
import { figure } from '@mdit/plugin-figure';
import { imgLazyload } from '@mdit/plugin-img-lazyload';
import { tab } from '@mdit/plugin-tab';
import dokapi from './../libs/markdown/Dokapi.js';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

md.use(markdownItBacktick);
md.use(markdownItMediaPlayer);
md.use(markdownItAnchor);
md.use(markdownItToc, {
  containerClass: 'my-8'
});
md.use(markdownItMultimdTable, {
  multiline: true,
  rowspan: true,
  headerless: true
});

// Configure Container plugins
md.use(markdownItAdmonition);

// Add remaining specifications
md.use(markdownItMacCodeblock);
md.use(figure);
md.use(imgLazyload);
md.use(tab);
md.use(dokapi);
md.use(markdownItTabs);

export default md;