import matter from 'gray-matter';
import md from './markdown.js';

export function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export function parseMarkdown(fileContent, filePath) {
  const { data, content } = matter(fileContent);
  const html = md.render(content);
  const readingTime = calculateReadingTime(content);

  return {
    title: data.title || 'Untitled',
    description: data.description || '',
    slug: data.slug || '',
    tags: data.tags || [],
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    written: data.written || "Unknown",
    pinned: data.pinned || false,
    draft: data.draft || false,
    cover: data.cover || '',
    readingTime,
    html,
    raw: content,
    path: filePath
  };
}