import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { cache } from './cache.js';
import { parseMarkdown } from './parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// base project root (INI KUNCI DI VERCEL)
const ROOT_DIR = process.cwd();

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
    // =========================
    // 1. Load config JSON
    // =========================
    const dataDir = path.join(ROOT_DIR, 'data');

    cache.config = (await readJsonFile(path.join(dataDir, 'config.json'))) || {};
    cache.navigation = (await readJsonFile(path.join(dataDir, 'navigation.json'))) || [];
    cache.socials = (await readJsonFile(path.join(dataDir, 'socials.json'))) || [];
    cache.projects = (await readJsonFile(path.join(dataDir, 'projects.json'))) || [];

    // =========================
    // 2. BLOG POSTS (Markdown)
    // =========================
    const blogPattern = path.join(ROOT_DIR, 'content/blog/**/*.md');

    const blogFiles = await glob(blogPattern, {
      nodir: true,
      absolute: true
    });

    const blogsParsed = [];

    for (const file of blogFiles) {
      const content = await fs.readFile(file, 'utf-8');
      const parsed = parseMarkdown(content, file);

      if (!parsed.slug) {
        parsed.slug = path.basename(file, '.md');
      }

      blogsParsed.push(parsed);
    }

    cache.blogs = blogsParsed.sort((a, b) => {
      if ((a.pinned ?? false) !== (b.pinned ?? false)) {
        return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // =========================
    // 3. DOCUMENTATION
    // =========================
    const docPattern = path.join(ROOT_DIR, 'content/docs/**/*.md');

    const docFiles = await glob(docPattern, {
      nodir: true,
      absolute: true
    });

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

    console.log(
      `Content initialized successfully. Loaded ${cache.blogs.length} posts & ${cache.docs.length} documentation files.`
    );
  } catch (error) {
    console.error('Failure initializing application memory cache', error);
    throw error;
  }
}