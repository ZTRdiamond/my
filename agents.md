# Agents Context: Personal Portfolio Blog

## 1. Ringkasan Proyek

Proyek ini adalah website personal portfolio + blog statis yang di-render secara server-side menggunakan Express.js dan EJS. Konten blog dan dokumentasi ditulis dalam Markdown dengan frontmatter YAML, lalu di-parse menjadi HTML saat aplikasi diinisialisasi atau saat cold start di Vercel.

- **Nama:** `personal-portfolio-blog`
- **Author:** ZTRdiamond / Fatahillah Al Makarim
- **Runtime:** Node.js ESM
- **Framework:** Express.js 4.x
- **Template Engine:** EJS
- **Deployment Target:** Vercel (`@vercel/node`)
- **Repository:** https://github.com/ztrdiamond/my

## 2. Struktur Folder & Tanggung Jawab

```
my/
├── src/
│   ├── app.js                      # Entry point Express + cold-start guard
│   ├── controllers/                # Logic render halaman
│   │   ├── blogController.js       # /blog dan /blog/:slug
│   │   ├── pageController.js       # /, /docs, /docs/:slug
│   │   └── projectController.js    # /api/projects
│   ├── routes/                     # Definisi routing
│   │   ├── index.js                # Root router
│   │   ├── pages.js                # Static-ish pages
│   │   └── blog.js                 # Blog routes
│   ├── services/                   # Core services
│   │   ├── cache.js                # In-memory cache sederhana
│   │   ├── contentLoader.js        # Load JSON + parse Markdown ke cache
│   │   ├── markdown.js             # Konfigurasi markdown-it + plugin
│   │   ├── parser.js               # parseMarkdown() & reading time
│   │   └── seo.js                  # Builder SEO meta tag
│   ├── middlewares/
│   │   ├── locals.js               # Inject navigation, socials, config, currentPath
│   │   └── errorHandler.js         # 404 & 500 handlers
│   └── libs/markdown/              # Custom markdown-it plugins
│       ├── AdmonitionContainer.js  # ::: note/info/tip/warning/caution/danger
│       ├── GithubAnchor.js         # Heading anchor link
│       ├── TableOfContent.js       # [[toc]] dropdown
│       ├── MacCodeBlock.js         # Mac-style code block + copy + wrap
│       ├── MultiMediaPlayer.js     # Video/audio HTML5 media
│       ├── Tabs.js                 # Tab group markdown
│       ├── HighlightBacktick.js    # Inline code styling
│       ├── Dokapi.js               # Dokapi custom plugin
│       └── css/dokapi.css          # Stylesheet untuk Dokapi
├── views/                          # Template EJS
│   ├── layouts/base.ejs            # Layout utama
│   ├── pages/                      # Konten halaman dinamis
│   │   ├── home.ejs
│   │   ├── blog.ejs
│   │   ├── post.ejs
│   │   ├── docs.ejs
│   │   ├── doc.ejs
│   │   ├── 404.ejs                 # (KOSONG — perlu diisi)
│   │   └── 500.ejs                 # (KOSONG — perlu diisi)
│   └── partials/                   # Komponen reusable
│       ├── seo.ejs
│       ├── navbar.ejs
│       ├── footer.ejs
│       ├── post-card.ejs
│       └── project-card.ejs
├── public/                         # Static assets
│   ├── css/styles.css
│   ├── favicon.ico
│   └── images/
├── content/                          # Konten Markdown
│   ├── blog/                         # Artikel blog
│   └── docs/                         # Dokumentasi
├── data/                             # Data konfigurasi JSON
│   ├── config.json
│   ├── navigation.json
│   ├── projects.json
│   └── socials.json
├── package.json
└── vercel.json
```

## 3. Cara Kerja Aplikasi

### Inisialisasi Data

Saat aplikasi start (lokal) atau cold start (Vercel), `initializeApplicationData()` di `src/services/contentLoader.js` melakukan:

1. Load 4 file JSON di `data/` secara paralel.
2. Cari semua file `.md` di `content/blog/` dan `content/docs/`.
3. Parse masing-masing dengan `gray-matter` + `markdown-it`.
4. Simpan hasil ke `cache` object in-memory.

### Request Lifecycle

1. `compression()`
2. `injectLocals` → inject `navigation`, `socials`, `config`, `currentPath`
3. `ensureDataInitialized` → guard cold-start Vercel
4. Router → controller → `res.render('layouts/base', { page, ... })`
5. Layout memuat partials dan `views/pages/<page>.ejs`
6. Error handler 404/500

### Static Assets

Saat ini static file di-serve di path `/static`:

```js
app.use("/static", express.static(path.resolve('public')));
```

Artinya:
- `public/css/styles.css` → diakses via `/static/css/styles.css`
- `public/favicon.ico` → diakses via `/static/favicon.ico`
- `public/images/...` → diakses via `/static/images/...`

> ⚠️ `vercel.json` saat ini memiliki routes untuk `/css/...`, `/js/...`, dst tanpa prefix `/static`. Ini perlu diselaraskan.

## 4. Konvensi Penulisan Kode

### JavaScript

- Selalu gunakan **ES Modules** (`import`/`export`).
- `package.json` telah mengatur `"type": "module"`.
- Hindari CommonJS (`require`/`module.exports`).
- Controller mengembalikan `next()` jika data tidak ditemukan.
- Middleware error selalu menerima 4 argumen untuk error handler (`err, req, res, next`).

### Markdown Frontmatter

Setiap file `.md` di `content/` boleh memiliki frontmatter YAML:

```yaml
---
title: "Judul Artikel"
description: "Deskripsi singkat"
slug: slug-kustom
tags:
  - Tag1
  - Tag2
createdAt: 2026-06-28
updatedAt: 2026-06-28
written: "Nama Penulis"
cover: "https://url-gambar.jpg"
pinned: false
draft: false
---
```

Field wajib minimal: `title`.
Field opsional: sisanya akan fallback ke default di `parseMarkdown()`.

### Markdown Extensions

Plugin custom yang tersedia:

- `[[toc]]` → Table of Contents dropdown.
- `::: tip/info/warning/danger ... :::` → Admonition block.
- Code block dengan fence + language → Mac-style code block dengan copy & wrap toggle.
- Heading otomatis mendapat anchor link.
- Tab group (`@tab` syntax dari `@mdit/plugin-tab`).
- Lazy loading gambar.
- Figure caption.

### Views EJS

- Semua halaman render ke `layouts/base` dengan properti `page`.
- Layout akan melakukan `<%- include('../pages/' + page) %>`.
- Partials di-include dari `views/partials/`.
- Gunakan `currentPath` untuk styling navigasi aktif.
- Gunakan Tailwind CSS classes. Dark mode pakai class `.dark` di `<html>`.

## 5. Environment & Scripts

```bash
# Install dependencies
npm install

# Jalankan lokal dengan auto-reload (Node.js --watch)
npm run dev

# Jalankan tanpa watch
npm start
```

Environment variables yang digunakan:

- `PORT` → port server lokal (default: 3000)
- `NODE_ENV` → jika `production`, listener lokal tidak dijalankan (untuk Vercel)

## 6. Deployment

Deploy ke Vercel. Konfigurasi ada di `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.js",
      "use": "@vercel/node",
      "config": { "includeFiles": "content/**" }
    }
  ],
  "routes": [...]
}
```

Catatan deployment:
- File `content/**` harus di-include agar tersedia di runtime Vercel.
- Cold start ditangani oleh `ensureDataInitialized` middleware.

## 7. SEO & Meta Tag

`src/services/seo.js` membangun objek SEO yang di-pass ke `views/partials/seo.ejs`.

Untuk halaman blog detail, tipe `ogType: 'article'` akan mengeluarkan meta tag:
- `article:published_time`
- `article:modified_time`
- `article:author`
- `article:tag`

## 8. Cache

`src/services/cache.js` adalah plain object yang menyimpan:

```js
{
  blogs: [],
  docs: [],
  projects: [],
  socials: [],
  navigation: [],
  config: {}
}
```

Cache ini diisi sekali saat inisialisasi dan tidak di-refresh otomatis. Untuk update konten, server perlu restart.

## 9. Known Issues

Lihat hasil scan terbaru untuk daftar bug yang terdeteksi. Beberapa isu kunci:

- ✅ `views/pages/404.ejs` dan `views/pages/500.ejs` kosong. *(FIXED)*
- ✅ Path favicon di `app.js` tidak cocok dengan struktur folder. *(FIXED)*
- ✅ `helmet` ter-install tapi tidak digunakan. *(FIXED — dengan CSP yang memperbolehkan inline scripts/styles)*
- ✅ Static assets di Vercel routes dan Express app belum konsisten. *(FIXED — serve static di root & `/static`)*
- ❌ Beberapa class Tailwind tidak valid (`slate-850`).
- ❌ Prism.js dynamic language loading bisa memperlambat cold start.
- ❌ Tidak ada `robots.txt` / `sitemap.xml`.
- ❌ CDN Lucide versi lama (`0.321.0`).

## 10. Aturan Kontribusi untuk Agent

Jika kamu (agent) diminta memodifikasi proyek ini:

1. **Jangan ubah arsitektur besar** tanpa konfirmasi user.
2. **Selalu pertahankan ESM** — jangan introduce `require`.
3. **Jika menambah plugin markdown**, daftarkan di `src/services/markdown.js`.
4. **Jika menambah route**, daftarkan di `src/routes/index.js`.
5. **Jika menambah data JSON**, load di `src/services/contentLoader.js`.
6. **Test lokal** dengan `npm run dev` setelah perubahan signifikan.
7. **Jangan commit langsung** kecuali user meminta.
8. **Gunakan bahasa Indonesia** untuk komentar jika proyek ini sedang dikelola dalam bahasa Indonesia; dokumentasi teknis boleh bilingual.

## 11. Kontak & Informasi Pemilik

- **Nama:** Fatahillah Al Makarim
- **GitHub:** https://github.com/ztrdiamond
- **Site URL:** https://ztrdiamond.is-a.dev
- **Avatar:** https://ztrdiamond.vercel.app/static/images/profile/ztrdiamond.webp
