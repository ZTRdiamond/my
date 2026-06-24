import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { cache } from './cache.js';
import { parseMarkdown } from './parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    // ==========================================
    // Pelindung (Guard Clause) untuk Vercel Warm Start
    // ==========================================
    // Jika container Vercel dalam kondisi 'warm' (hangat/masih aktif), 
    // langsung gunakan cache memori yang sudah ada tanpa membaca ulang disk.
    if (
      cache.blogs && cache.blogs.length > 0 && 
      cache.docs && cache.docs.length > 0
    ) {
      return;
    }

    const dataDir = path.join(ROOT_DIR, 'data');

    // ==========================================
    // 1. Load config JSON secara PARALEL (Bersamaan)
    // ==========================================
    const [config, navigation, socials, projects] = await Promise.all([
      readJsonFile(path.join(dataDir, 'config.json')),
      readJsonFile(path.join(dataDir, 'navigation.json')),
      readJsonFile(path.join(dataDir, 'socials.json')),
      readJsonFile(path.join(dataDir, 'projects.json')),
    ]);

    cache.config = config || {};
    cache.navigation = navigation || [];
    cache.socials = socials || [];
    cache.projects = projects || [];

    // ==========================================
    // 2. Pencarian File (Globbing) secara PARALEL
    // ==========================================
    const [blogFiles, docFiles] = await Promise.all([
      glob(path.join(ROOT_DIR, 'content/blog/**/*.md'), { nodir: true, absolute: true }),
      glob(path.join(ROOT_DIR, 'content/docs/**/*.md'), { nodir: true, absolute: true })
    ]);

    // ==========================================
    // 3. Membaca & Mem-parsing BLOG secara PARALEL
    // ==========================================
    const blogsParsed = await Promise.all(
      blogFiles.map(async (file) => {
        const content = await fs.readFile(file, 'utf-8');
        const parsed = parseMarkdown(content, file);

        if (!parsed.slug) {
          parsed.slug = path.basename(file, '.md');
        }
        return parsed;
      })
    );

    cache.blogs = blogsParsed.sort((a, b) => {
      if ((a.pinned ?? false) !== (b.pinned ?? false)) {
        return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // ==========================================
    // 4. Membaca & Mem-parsing DOCS secara PARALEL
    // ==========================================
    const docsParsed = await Promise.all(
      docFiles.map(async (file) => {
        const content = await fs.readFile(file, 'utf-8');
        const parsed = parseMarkdown(content, file);

        if (!parsed.slug) {
          parsed.slug = path.basename(file, '.md');
        }
        return parsed;
      })
    );

    cache.docs = docsParsed;

    console.log(
      `Content initialized successfully. Loaded ${cache.blogs.length} posts & ${cache.docs.length} docs.`
    );
  } catch (error) {
    console.error('Failure initializing application memory cache', error);
    throw error;
  }
}