import { cache } from '../services/cache.js';
import { buildSeoOptions } from '../services/seo.js';

export const renderHome = (req, res) => {
  const featuredProjects = cache.projects.filter(p => p.featured);
  const latestPosts = cache.blogs.filter(b => !b.draft).slice(0, 6);

  res.render('layouts/base', {
    page: 'home',
    seo: buildSeoOptions(),
    projects: featuredProjects,
    posts: latestPosts
  });
};

export const renderDocsIndex = (req, res) => {
  res.render('layouts/base', {
    page: 'docs',
    seo: buildSeoOptions({ title: 'Documentation Index', canonical: '/docs' }),
    docs: cache.docs
  });
};

export const renderDocDetail = (req, res, next) => {
  const { slug } = req.params;
  const document = cache.docs.find(d => d.slug === slug);

  if (!document) {
    return next();
  }

  res.render('layouts/base', {
    page: 'doc',
    seo: buildSeoOptions({
      title: document.title,
      description: document.description,
      canonical: `/docs/${slug}`
    }),
    doc: document
  });
};