---
title: System Architecture & Developer Reference Manual
description: Panduan teknis arsitektur sistem, siklus caching startup asinkronus, custom Markdown-it parser, dan optimasi Vercel Serverless.
slug: system-architecture
---

[[toc]]

## 1. Pendahuluan

Situs portofolio personal, blog, dan basis pengetahuan (*knowledge base*) ini dibangun menggunakan Node.js dengan framework **Express** dan template engine **EJS**. Desain arsitektur aplikasi ini mengedepankan efisiensi tinggi, performa maksimal, dan kemudahan deployment dengan menerapkan prinsip **Zero-Database Overhead**.

Sistem ini tidak menggunakan database eksternal ataupun sistem manajemen konten (CMS) tradisional. Seluruh artikel blog dan dokumen teknis disimpan dalam bentuk file flat Markdown (`.md`) lokal. Seluruh file tersebut dipindai, diparsing frontmatter-nya, dan dikompilasi menjadi dokumen HTML utuh **hanya satu kali** pada saat aplikasi melakukan booting awal (*application bootstrap*), lalu disimpan langsung ke dalam memori RAM (*In-Memory Cache*).

### Spesifikasi Kunci Sistem:
- **Runtime Environment**: Node.js (ESM - ECMAScript Modules).
- **Backend Framework**: Express.js (Minimal, Fast, Unopinionated).
- **Template Engine**: EJS (Embedded JavaScript templates) menggunakan pola *dynamic inclusion layout*.
- **Markdown Compiler**: `markdown-it` yang diperluas dengan *custom block plugin* penanganan daftar isi (*Table of Contents*) interaktif bergaya Docusaurus.
- **Visual Design**: Tailwind CSS dengan mode gelap (*dark mode*) bawaan berbasis class.

---

## 2. Struktur Direktori Proyek

Aplikasi ini menggunakan pola arsitektur berbasis modul layanan (*Service-Based Module*) yang memisahkan tanggung jawab penanganan rute, logika bisnis, rendering Markdown, dan penyimpanan cache.

```text
├── content/                     # Sumber konten tulisan (.md)
│   ├── blog/                    # File tulisan artikel blog
│   └── docs/                    # File panduan teknis & dokumentasi
├── data/                        # Penyimpanan data statis (.json)
│   ├── config.json              # Konfigurasi parameter global web
│   ├── navigation.json          # Schema menu navigasi header
│   ├── projects.json            # Daftar proyek portofolio kustom
│   └── socials.json             # Daftar tautan akun sosial media
├── public/                      # Aset statis client-side
│   ├── css/                     # File style CSS kustom (bila ada)
│   ├── js/                      # File JavaScript client-side (bila ada)
│   ├── images/                  # Aset gambar utama & sampul tulisan
│   └── favicon/                 # Logo ikon browser (favicon.ico)
├── src/                         # Sumber kode utama aplikasi backend
│   ├── app.js                   # Entrypoint server Express & bootstrap initializer
│   ├── controllers/             # Handler fungsional rute endpoint
│   │   ├── blogController.js    # Logika indeks & baca postingan blog
│   │   ├── pageController.js    # Logika landing page, portfolio, & dokumentasi
│   │   └── projectController.js # API endpoint penyaji data proyek
│   ├── middlewares/             # Middleware fungsional Express
│   │   ├── errorHandler.js      # Penanganan status error 404 & 500
│   │   └── locals.js            # Injeksi variabel data global EJS
│   ├── routes/                  # Pemetaan rute url endpoint
│   │   ├── index.js             # Central router hub
│   │   ├── blog.js              # Endpoint navigasi blog
│   │   └── pages.js             # Endpoint navigasi beranda & dokumentasi
│   └── services/                # Logika bisnis & modul utilities
│       ├── cache.js             # Penyimpanan cache global di memori (RAM)
│       ├── contentLoader.js     # Pemindai direktori & inisialisasi boot
│       ├── markdown.js          # Parser kompilasi Markdown-It & registrasi plugin
│       ├── parser.js            # Pengurai frontmatter & perhitungan reading-time
│       └── seo.js               # Helper penyusun objek metadata SEO
└── views/                       # File tampilan antarmuka EJS
    ├── layouts/                 # Kerangka layout pembungkus utama
    │   └── base.ejs             # Wrapper base layout interaktif
    ├── pages/                   # Konten halaman spesifik yang di-include
    │   ├── 404.ejs              # Tampilan kesalahan halaman tidak ditemukan
    │   ├── 500.ejs              # Tampilan kesalahan fatal server internal
    │   ├── blog.ejs             # Indeks blog (dilengkapi client-side search)
    │   ├── doc.ejs              # Tampilan baca berkas dokumentasi
    │   ├── docs.ejs             # Indeks seluruh daftar dokumentasi
    │   ├── home.ejs             # Landing page personal & portofolio
    │   └── post.ejs             # Tampilan baca tulisan blog
    └── partials/                # Potongan modul antarmuka reusable
        ├── footer.ejs           # Komponen footer 3-kolom
        ├── navbar.ejs           # Komponen sticky blurred header navbar
        ├── post-card.ejs        # Komponen kartu postingan blog
        ├── project-card.ejs     # Komponen kartu portofolio proyek
        └── seo.ejs              # Komponen meta tag optimasi SEO
```

---

## 3. Siklus Caching Startup Asinkronus

Untuk mengoptimalkan kecepatan respon server, sistem ini mengeliminasi pemanggilan sistem operasi I/O (*fs.readFile*) saat melayani request dari klien. Sebagai gantinya, data diinisialisasi sepenuhnya pada saat server memulai siklus booting pertama kali.

### Bagan Siklus Inisialisasi Memori (*Bootstrap Caching*):

```text
  [ Aplikasi Dijalankan (Bootstrap) ]
                  │
                  ▼
  [ Panggil initializeApplicationData() ]
                  │
  ┌───────────────┴───────────────┐
  ▼                               ▼
[ Baca Berkas JSON ]            [ Glob Scan *.md di content/ ]
(config, navigation,            (blog/ & docs/)
 projects, socials)               │
  │                               ▼
  │                             [ Loop: Membaca Isi Berkas ]
  │                               │
  │                               ▼
  │                             [ Penguraian Frontmatter ]
  │                             (Menggunakan gray-matter)
  │                               │
  │                               ▼
  │                             [ Kompilasi Konten ke HTML ]
  │                             (Menggunakan custom markdown-it)
  │                               │
  │                               ▼
  │                             [ Hitung Estimasi Membaca ]
  │                             (Menggunakan parser.js)
  │                               │
  │                               ▼
  │                             [ Urutkan Post (Pinned & Date) ]
  │                               │
  ▼                               ▼
  └───────────────┬───────────────┘
                  │
                  ▼
  [ Masukkan ke Objek Global cache.js ]
                  │
                  ▼
  [ Nyalakan Server Express (Listening) ]
```

:::info
Ketika dideploy ke **Vercel Serverless**, siklus booting ini dipicu secara instan setiap kali terjadi fase *Cold Start* (wadah kontainer dinyalakan kembali setelah masa idel). Proses ini dieksekusi secara asinkronus dalam waktu singkat (di bawah 150 milidetik untuk ratusan dokumen), menjaga *Cold Start latency* tetap minimal.
:::

---

## 4. Mekanisme Layouting Dinamis EJS

Aplikasi ini menggunakan pola **Dynamic Page Inclusion** yang sangat ramah terhadap runtime serverless. Seluruh halaman spesifik di bawah `views/pages/` dipanggil secara dinamis di dalam kerangka dasar `views/layouts/base.ejs`.

### Potongan Struktur Layout `base.ejs`:

```html
<body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col min-h-screen">
  
  <%- include('../partials/navbar') %>

  <!-- Content Render Area -->
  <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
    <%- include('../pages/' + page) %>
  </main>

  <%- include('../partials/footer') %>

</body>
```

### Keunggulan Desain Layout Ini:
- **Satu Sumber Validitas (Single Source of Truth)**: Semua pustaka script CSS (Tailwind), inisialisasi modul ikon (Lucide), metadata optimasi SEO, serta sistem pendeteksi visual tema gelap (*dark mode*) dipusatkan hanya pada file `base.ejs`.
- **Bebas Redundansi**: File halaman di dalam `views/pages/` hanya berisi tag markup data spesifik, tanpa perlu mengulang tag struktur HTML dasar (`<html>`, `<head>`, `<body>`).
- **Sederhana**: Controller hanya perlu merender `layouts/base` dan mengirimkan string nama halaman ke parameter `page`.

---

## 5. Kustom Markdown-It Compiler

Parser Markdown dikonfigurasi secara kustom pada file `src/services/markdown.js` untuk menyediakan rendering tulisan teknis yang estetis dan interaktif.

### Blok Logika Kustom Docusaurus Table of Contents (TOC)

Aplikasi ini tidak lagi menggunakan plugin default `markdown-it-toc-done-right` karena memiliki kelemahan membungkus tag `<p>` di sekitar daftar isi. Kita menggantinya dengan **Block-Level Rule Plugin** kustom yang memproses sintaks `[[toc]]` secara mandiri:

```javascript
md.block.ruler.before('paragraph', 'docusaurus_toc_block', (state, startLine, endLine, silent) => {
  const pos = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];
  const lineText = state.src.slice(pos, max).trim();

  // Pastikan baris hanya berisi instruksi tag [[toc]]
  if (lineText !== '[[toc]]') return false;
  if (silent) return true;

  state.line = startLine + 1;
  const token = state.push('docusaurus_toc_block', 'div', 0);
  token.map = [startLine, state.line];
  return true;
});
```

Aturan ini kemudian dirender secara dinamis dengan mengumpulkan seluruh heading (h2, h3, h4) pada dokumen untuk menyusun dropdown berjenjang interaktif dengan dominasi warna Biru Laut Muda (`sky-400`/`sky-500`):

```javascript
md.renderer.rules.docusaurus_toc_block = (tokens, idx, opts, env, self) => {
  const headings = [];
  // Ekstrak seluruh heading dokumen...
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.slice(1));
      if (level > 1 && level < 5) {
        const inlineToken = tokens[i + 1];
        if (inlineToken && inlineToken.type === 'inline') {
          const text = inlineToken.content;
          const slug = slugify(text);
          token.attrSet('id', slug); // Pasang ID anchor secara presisi
          headings.push({ level, text, slug });
        }
      }
    }
  }
  return buildTocDropdownHtml(headings); // Render HTML details/summary
};
```

---

## 6. Integrasi Serverless & Optimasi Vercel

Situs ini dioptimalkan penuh agar dapat dideploy ke **Vercel Free Plan** menggunakan file konfigurasi integrasi `vercel.json` di root direktori.

### Manajemen Aset Statis yang Efisien

Untuk memastikan performa aplikasi yang maksimal pada infrastruktur serverless, aset statis seperti CSS kustom, JavaScript client, berkas ikon, dan gambar tulisan diarahkan secara langsung ke folder publik melalui konfigurasi rute di `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/css/(.*)",
      "dest": "/public/css/$1"
    },
    {
      "src": "/js/(.*)",
      "dest": "/public/js/$1"
    },
    {
      "src": "/images/(.*)",
      "dest": "/public/images/$1"
    },
    {
      "src": "/favicon/(.*)",
      "dest": "/public/favicon/$1"
    },
    {
      "src": "/(.*)",
      "dest": "src/app.js"
    }
  ]
}
```

:::danger
Pola penulisan rute di atas menjamin bahwa ketika aset statis diakses (misal `/images/hero.webp`), Vercel akan langsung menyajikannya melalui CDN global edge server terdekat secara instan, tanpa perlu menghidupkan dan membebani serverless container Express utama.
:::

---

## 7. Praktik Terbaik Pengembangan (*Developer Best Practices*)

Untuk menjaga performa situs web tetap optimal dengan skor Lighthouse tinggi (target 95+), ikuti panduan pengembangan berikut:

1. **Optimasi Gambar**: Selalu kompres gambar ke format modern seperti `.webp` atau `.avif` sebelum diletakkan di folder `/public/images/`. Hindari penggunaan format gambar mentah berukuran besar di atas 300KB.
2. **Pola Penulisan Kode**: Hindari penggunaan library pihak ketiga yang besar pada client-side. Utamakan penggunaan vanilla JavaScript murni dan manfaatkan class utilitas dari Tailwind CSS daripada menulis CSS kustom yang panjang.
3. **Penyimpanan Berkas Konten**: Selalu sertakan frontmatter standar dengan slug yang unik dan relevan pada setiap file tulisan baru di folder `content/blog/` atau `content/docs/`. Jalankan kembali server lokal Anda setelah menambahkan dokumen baru untuk memperbarui kondisi data cache pada memori runtime.