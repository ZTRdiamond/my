import { cache } from '../services/cache.js';
import { buildSeoOptions } from '../services/seo.js';

export const renderBlogIndex = (req, res) => {
  const activePosts = cache.blogs.filter(b => !b.draft);
  const allTags = [...new Set(activePosts.flatMap(post => post.tags))];

  res.render('layouts/base', {
    page: 'blog',
    seo: buildSeoOptions({ title: 'Blog Publications', canonical: '/blog' }),
    posts: activePosts,
    tags: allTags
  });
};

export const renderBlogPost = (req, res, next) => {
  const { slug } = req.params;
  const post = cache.blogs.find(b => b.slug === slug && !b.draft);

  if (!post) {
    return next();
  }

  res.render('layouts/base', {
    page: 'post',
    seo: buildSeoOptions({
      title: post.title,
      description: post.description,
      ogImage: post.cover || undefined,
      ogType: 'article', // Menandakan bahwa halaman ini bertipe artikel
      canonical: `/blog/${slug}`,
      publishedTime: post.createdAt.toISOString(), // Tanggal rilis artikel
      modifiedTime: post.updatedAt.toISOString(),  // Tanggal update artikel
      tags: post.tags                              // Daftar tag kategori
    }),
    post
  });
};