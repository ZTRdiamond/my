import { cache } from './cache.js';

export function buildSeoOptions(customOptions = {}) {
  const defaults = {
    title: cache.config.siteTitle || cache.config.siteName,
    description: cache.config.siteDescription,
    canonical: cache.config.siteUrl,
    ogImage: cache.config.avatar,
    ogType: 'website'
  };

  const finalTitle = customOptions.title 
    ? `${customOptions.title} | ${cache.config.siteName}` 
    : defaults.title;

  return {
    title: finalTitle,
    description: customOptions.description || defaults.description,
    canonical: customOptions.canonical ? `${cache.config.siteUrl}${customOptions.canonical}` : defaults.canonical,
    ogTitle: finalTitle,
    ogDescription: customOptions.description || defaults.description,
    ogImage: customOptions.ogImage || defaults.ogImage,
    ogType: customOptions.ogType || defaults.ogType,
    
    // Injeksi parameter metadata khusus artikel blog (bernilai null jika diakses dari homepage)
    publishedTime: customOptions.publishedTime || null,
    modifiedTime: customOptions.modifiedTime || null,
    author: customOptions.author || cache.config.fullName || null,
    tags: customOptions.tags || []
  };
}