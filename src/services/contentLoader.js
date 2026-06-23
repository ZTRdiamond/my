import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import { cache } from './cache.js';
import { parseMarkdown } from './parser.js';

async function readJsonFile(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error loading JSON file: ${filePath}`, error);
    return null;
  }
}

export async function initializeApplicationData() {
  try {
    // 1. Load System Settings and Configurations
    const dataDir = path.resolve('data');
    cache.config = await readJsonFile(path.join(dataDir, 'config.json')) || {};
    cache.navigation = await readJsonFile(path.join(dataDir, 'navigation.json')) || [];
    cache.socials = await readJsonFile(path.join(dataDir, 'socials.json')) || [];
    cache.projects = await readJsonFile(path.join(dataDir, 'projects.json')) || [];

    // 2. Discover and Parse Blog Posts
    const blogFiles = await glob('content/blog/**/*.md');
    const blogsParsed = [];
    for (const file of blogFiles) {
      const content = await fs.readFile(file, 'utf-8');
      const parsed = parseMarkdown(content, file);
      
      // Enforce slug generation from filename if frontmatter is empty
      if (!parsed.slug) {
        parsed.slug = path.basename(file, '.md');
      }
      
      blogsParsed.push(parsed);
    }

    // Sort: Pinned posts come first, then sort by newest date
    cache.blogs = blogsParsed.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    // 3. Discover and Parse Technical Documentation
    const docFiles = await glob('content/docs/**/*.md');
    const docsParsed = [];
    for (const file of docFiles) {
      const content = await fs.readFile(file, 'utf-8');
      const parsed = parseMarkdown(content, file);
      
      if (!parsed.slug) {
        parsed.slug = path.basename(file, '.md');
      }
      
      docsParsed.push(parsed);
    }
    cache.docs = docsParsed;

    console.log(`Content initialized successfully. Loaded ${cache.blogs.length} posts & ${cache.docs.length} documentation files.`);
  } catch (error) {
    console.error('Failure initializing application memory cache', error);
    throw error;
  }
}