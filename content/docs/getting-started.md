---
title: Pengenalan Sistem Blog dan Seluruh Fiturnya
description: Pelajari cara menggunakan seluruh fitur yang tersedia pada sistem blog modern, mulai dari pembuatan artikel, tabel isi otomatis, kontainer informasi, tabs, media player, code block interaktif, hingga navigasi anchor.
slug: getting-started
---

[[toc]]

# Selamat Datang

Sistem blog ini dirancang untuk mempermudah proses penulisan artikel, dokumentasi, tutorial, catatan proyek, hingga knowledge base tanpa perlu menulis HTML secara manual. Seluruh komponen yang tersedia dapat digunakan langsung melalui sintaks Markdown yang sederhana sehingga penulis dapat lebih fokus pada isi konten dibandingkan dengan aspek teknis tampilan.

Dokumentasi ini berfungsi sebagai pengenalan lengkap terhadap seluruh fitur yang tersedia. Setiap bagian akan menjelaskan fungsi, tujuan penggunaan, contoh implementasi, studi kasus, serta praktik terbaik yang dapat diterapkan saat membuat artikel.

---

## Mengenal Struktur Dasar Artikel Blog

Setiap artikel pada sistem blog diawali dengan sebuah blok metadata yang dikenal sebagai **Frontmatter**. Bagian ini ditulis menggunakan format YAML dan ditempatkan di bagian paling atas file Markdown, diapit oleh tiga tanda strip (`---`).

Frontmatter berfungsi sebagai pusat konfigurasi artikel. Informasi yang dituliskan di dalamnya tidak akan ditampilkan sebagai isi artikel, melainkan digunakan oleh sistem blog untuk mengatur bagaimana artikel tersebut diproses, ditampilkan, diindeks, dan dikelompokkan.

Contoh Frontmatter:

```yaml
---
title: Building Zero-Database In-Memory Caching in Modern Node.js APIs
description: Cara membangun sistem caching di memori internal Node.js untuk optimasi response time tanpa overhead infrastruktur database tambahan.
slug: in-memory-caching
tags:
  - nodejs
  - performance
  - api
createdAt: 2026-06-21
updatedAt: 2026-06-21
cover: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80
pinned: false
draft: false
---
```

Meskipun terlihat sederhana, setiap properti memiliki peran penting dalam sistem blog.

---

### 1.0 Title

Properti `title` digunakan sebagai judul utama artikel.

```yaml
title: Building Zero-Database In-Memory Caching in Modern Node.js APIs
```

Nilai ini biasanya digunakan pada:

- Judul halaman artikel.
- Tab browser.
- Hasil pencarian internal.
- Preview media sosial.
- Metadata SEO.

Ketika artikel dirender, title akan menjadi identitas utama yang pertama kali dilihat pembaca.

#### Contoh

```yaml
title: Mengenal Redis Caching untuk Backend Modern
```

Hasil yang ditampilkan:

```text
Mengenal Redis Caching untuk Backend Modern
```

#### Praktik Terbaik

Gunakan judul yang:

- Menjelaskan isi artikel.
- Tidak terlalu pendek.
- Tidak terlalu panjang.
- Mengandung kata kunci utama topik.

Contoh yang baik:

```yaml
title: Membuat REST API Rate Limiter Menggunakan Express dan Redis
```

Contoh yang kurang informatif:

```yaml
title: Tutorial Redis
```

---

#### Description

Properti `description` berisi ringkasan singkat isi artikel.

```yaml
description: Cara membangun sistem caching di memori internal Node.js untuk optimasi response time tanpa overhead infrastruktur database tambahan.
```

Description biasanya digunakan untuk:

- Meta Description SEO.
- Cuplikan artikel pada halaman daftar blog.
- Preview saat artikel dibagikan ke media sosial.
- Hasil pencarian internal.

#### Contoh

```yaml
description: Panduan lengkap membangun cache in-memory berperforma tinggi menggunakan Node.js.
```

Pada halaman daftar artikel, sistem dapat menampilkan:

```text
Panduan lengkap membangun cache in-memory berperforma tinggi menggunakan Node.js.
```

di bawah judul artikel.

#### Praktik Terbaik

Disarankan:

- 100–160 karakter.
- Menjelaskan inti artikel.
- Mengandung kata kunci utama.

Hindari:

```yaml
description: Artikel tentang cache.
```

karena terlalu umum dan tidak memberikan gambaran isi artikel.

---

### 1.1 Slug

Slug digunakan untuk membentuk URL artikel.

```yaml
slug: in-memory-caching
```

Ketika artikel dipublikasikan, URL yang dihasilkan dapat berupa:

```text
/blog/in-memory-caching
```

Slug yang baik membuat URL:

- Mudah dibaca.
- Mudah dibagikan.
- Lebih ramah SEO.

#### Contoh

```yaml
slug: express-rate-limiter
```

Menghasilkan:

```text
/blog/express-rate-limiter
```

#### Praktik Terbaik

Gunakan:

```yaml
slug: nodejs-memory-cache
```

Hindari:

```yaml
slug: Artikel Final Fix Revisi Terbaru
```

karena mengandung spasi dan tidak konsisten.

---

### 1.3 Tags

Tags digunakan untuk mengelompokkan artikel berdasarkan topik tertentu.

```yaml
tags:
  - nodejs
  - performance
  - api
```

Satu artikel dapat memiliki banyak tag sekaligus.

#### Fungsi Tags

Tags membantu sistem untuk:

- Membuat halaman kategori.
- Menampilkan artikel terkait.
- Menyediakan fitur pencarian berdasarkan topik.
- Mengorganisir konten dalam jumlah besar.

#### Studi Kasus

Misalnya tersedia artikel:

```yaml
tags:
  - nodejs
  - redis
  - caching
```

dan artikel lain:

```yaml
tags:
  - nodejs
  - performance
  - optimization
```

Sistem dapat menampilkan keduanya saat pengguna membuka halaman tag:

```text
/nodejs
```

karena memiliki tag yang sama.

#### Praktik Terbaik

Gunakan tag yang:

- Relevan.
- Konsisten.
- Tidak terlalu banyak.

Contoh:

```yaml
tags:
  - javascript
  - nodejs
  - backend
```

lebih baik dibanding:

```yaml
tags:
  - coding
  - tutorial
  - belajar
  - artikel
  - keren
  - random
```

---

### 1.4 Created At

Properti `createdAt` menunjukkan tanggal artikel pertama kali dibuat atau dipublikasikan.

```yaml
createdAt: 2026-06-21
```

Informasi ini biasanya ditampilkan sebagai:

```text
21 Juni 2026
```

di halaman artikel.

#### Kegunaan

- Memberi konteks waktu kepada pembaca.
- Membantu mengurutkan artikel.
- Menampilkan artikel terbaru.

#### Studi Kasus

Artikel tentang framework tertentu yang dibuat pada tahun 2022 mungkin sudah tidak relevan pada tahun 2026.

Dengan menampilkan tanggal publikasi, pembaca dapat menilai relevansi informasi tersebut.

---

### 1.5 Updated At

Properti `updatedAt` menunjukkan kapan artikel terakhir diperbarui.

```yaml
updatedAt: 2026-06-21
```

Sangat berguna untuk dokumentasi teknis yang sering mengalami perubahan.

#### Studi Kasus

Misalnya artikel:

```text
Panduan Express.js
```

ditulis pada tahun 2024.

Kemudian diperbarui pada tahun 2026 karena adanya perubahan API.

Informasi:

```yaml
updatedAt: 2026-06-21
```

memberitahu pembaca bahwa konten masih aktif dipelihara.

---

### 1.6 Cover

Properti `cover` digunakan untuk menentukan gambar utama artikel.

```yaml
cover: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80
```

Gambar ini biasanya digunakan sebagai:

- Thumbnail artikel.
- Banner halaman.
- Preview Open Graph.
- Preview media sosial.

#### Studi Kasus

Pada halaman daftar artikel:

```text
[ Gambar Cover ]

Building Zero-Database In-Memory Caching in Modern Node.js APIs
```

Cover akan menjadi elemen visual pertama yang menarik perhatian pembaca.

#### Praktik Terbaik

Gunakan gambar yang:

- Relevan dengan topik.
- Resolusi tinggi.
- Tidak terlalu besar ukuran filenya.

Disarankan menggunakan lebar minimal:

```text
1200px
```

agar tetap tajam saat dibagikan ke media sosial.

---

### 1.7 Pinned

Properti `pinned` menentukan apakah artikel akan diprioritaskan dalam daftar artikel.

```yaml
pinned: false
```

Jika diubah menjadi:

```yaml
pinned: true
```

artikel dapat ditampilkan di bagian:

```text
Artikel Pilihan
```

atau ditempatkan di urutan paling atas meskipun bukan artikel terbaru.

#### Studi Kasus

Artikel berikut sering dijadikan pinned:

- Panduan Memulai.
- FAQ.
- Dokumentasi Utama.
- Pengumuman Penting.

---

### 1.8 Draft

Properti `draft` digunakan untuk menandai status publikasi artikel.

```yaml
draft: false
```

Nilai ini berarti artikel siap ditampilkan kepada publik.

Apabila diubah menjadi:

```yaml
draft: true
```

sistem dapat menyembunyikan artikel dari:

- Halaman blog.
- Sitemap.
- Hasil pencarian.
- Feed RSS.

#### Studi Kasus

Saat masih menulis artikel:

```yaml
draft: true
```

Setelah selesai:

```yaml
draft: false
```

Artikel akan otomatis muncul pada situs.

---

### 1.9 Contoh Frontmatter Lengkap

Berikut contoh konfigurasi artikel yang siap dipublikasikan:

```yaml
---
title: Building Zero-Database In-Memory Caching in Modern Node.js APIs
description: Cara membangun sistem caching di memori internal Node.js untuk optimasi response time tanpa overhead infrastruktur database tambahan.
slug: in-memory-caching
tags:
  - nodejs
  - performance
  - api
createdAt: 2026-06-21
updatedAt: 2026-06-21
cover: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80
pinned: false
draft: false
---
```

Dengan memahami Frontmatter, penulis dapat mengontrol bagaimana artikel ditampilkan, diorganisir, ditemukan oleh pembaca, serta diproses oleh sistem blog tanpa perlu menulis konfigurasi tambahan di luar file Markdown.

## Mengenal Struktur Dasar Artikel Dokumentasi

Sebelum membuat konten, setiap halaman artikel biasanya diawali dengan bagian metadata yang disebut sebagai Frontmatter.

Contoh:

```yaml
---
title: Pengenalan Sistem Blog dan Seluruh Fiturnya
description: Pelajari seluruh fitur yang tersedia pada sistem blog.
slug: getting-started
---
```

Metadata tersebut digunakan oleh sistem untuk mengelola artikel secara otomatis.

### 1.1 Title

Properti `title` digunakan sebagai judul utama artikel.

Contoh:

```yaml
title: Cara Membuat REST API dengan Express
```

Title biasanya digunakan untuk:

- Judul halaman.
- Judul pada daftar artikel.
- Meta title SEO.
- Preview saat dibagikan ke media sosial.

#### Praktik Terbaik

Gunakan judul yang:

- Jelas.
- Singkat.
- Menjelaskan isi artikel.

Contoh yang baik:

```yaml
title: Cara Deploy Aplikasi Node.js ke VPS
```

Contoh yang kurang baik:

```yaml
title: Tutorial
```

---

### 1.2 Description

Description merupakan ringkasan singkat isi artikel.

Contoh:

```yaml
description: Panduan lengkap melakukan deployment aplikasi Node.js ke server VPS.
```

Fungsi description:

- Meta description SEO.
- Cuplikan artikel.
- Preview halaman.

Disarankan menggunakan 100–160 karakter agar tetap optimal pada mesin pencari.

---

### 1.3 Slug

Slug menentukan alamat URL artikel.

Contoh:

```yaml
slug: deploy-nodejs-vps
```

Maka URL artikel dapat menjadi:

```text
/blog/deploy-nodejs-vps
```

#### Tips Penulisan Slug

Gunakan:

```yaml
slug: cara-menggunakan-tabs
```

Hindari:

```yaml
slug: Artikel Final Revisi Banget Fix
```

---

## Table of Contents Otomatis

Sistem menyediakan generator daftar isi otomatis melalui tag berikut:

```markdown
[[toc]]
```

Ketika halaman dirender, sistem akan memindai seluruh heading dan menyusunnya menjadi navigasi otomatis.

### 1.1 Manfaat

Pada artikel panjang, pembaca sering kesulitan mencari bagian tertentu.

Dengan adanya daftar isi otomatis:

- Navigasi menjadi lebih cepat.
- Struktur artikel lebih jelas.
- Pengalaman membaca menjadi lebih nyaman.

---

### 1.2 Contoh Kasus

Misalnya sebuah dokumentasi memiliki struktur berikut:

```markdown
# Instalasi

# Konfigurasi

# Penggunaan

# Deployment

# Troubleshooting
```

Tanpa TOC, pembaca harus melakukan scroll manual.

Dengan TOC, seluruh bagian dapat diakses hanya dengan satu klik.

---

### 1.3 Kapan Sebaiknya Digunakan?

Disarankan pada:

- Dokumentasi teknis.
- Tutorial panjang.
- Panduan penggunaan aplikasi.
- Knowledge base.
- Artikel lebih dari 1000 kata.

---

## Admonition (Kontainer Informasi)

Admonition digunakan untuk menampilkan informasi penting dengan tampilan yang lebih menonjol dibandingkan paragraf biasa.

Fitur ini sangat berguna untuk menarik perhatian pembaca terhadap informasi tertentu.

---

### 1.1 Note

Digunakan untuk catatan umum.

Contoh:

:::note
Sistem mendukung seluruh sintaks Markdown standar.
:::

#### Kapan Digunakan?

Gunakan ketika ingin memberikan:

- Informasi tambahan.
- Catatan ringan.
- Referensi pelengkap.

---

### 1.2 Tip

Digunakan untuk memberikan saran atau praktik terbaik.

Contoh:

:::tip Kiat Produktif
Gunakan heading yang konsisten agar TOC otomatis dapat menghasilkan struktur navigasi yang lebih baik.
:::

#### Studi Kasus

Saat membuat tutorial deployment:

```markdown
:::tip
Gunakan environment staging sebelum melakukan deployment ke produksi.
:::
```

Pembaca akan mendapatkan rekomendasi yang dapat mengurangi risiko kesalahan.

---

### 1.3 Warning

Digunakan untuk memperingatkan pengguna mengenai kemungkinan masalah.

Contoh:

:::warning Peringatan
Lakukan backup database sebelum menjalankan migrasi.
:::

#### Studi Kasus

Sebelum menjalankan:

```bash
npm run migrate
```

sebaiknya tampilkan warning agar pengguna memahami potensi risiko perubahan data.

---

### 1.4 Danger

Digunakan untuk informasi yang memiliki konsekuensi serius.

Contoh:

:::danger Risiko Tinggi
Perintah berikut dapat menghapus seluruh data secara permanen.
:::

#### Studi Kasus

Misalnya dokumentasi berisi perintah:

```bash
rm -rf /
```

Informasi semacam ini wajib diberi penanda danger agar pembaca memahami dampaknya.

---

## Sistem Tabs

Tabs memungkinkan beberapa konten ditempatkan dalam satu area tanpa membuat halaman menjadi terlalu panjang.

Fitur ini sangat bermanfaat pada dokumentasi yang memiliki banyak variasi konfigurasi atau bahasa pemrograman.

---

### 1.1 Tabs Dasar

Contoh:

;;tabs

@tab Node.js

```javascript
console.log("Halo Node.js");
```

@tab Python

```python
print("Halo Python")
```

;;

Pengguna dapat berpindah antar tab tanpa perlu melakukan scroll panjang.

---

### 1.2 Studi Kasus Dokumentasi API

Misalnya sebuah endpoint API dapat digunakan oleh beberapa bahasa pemrograman.

Tanpa tabs:

```markdown
### Node.js
...

### Python
...

### PHP
...

### Go
...
```

Artikel akan menjadi sangat panjang.

Dengan tabs:

;;tabs

@tab Node.js

```javascript
const res = await fetch("/api/user");
```

@tab Python

```python
requests.get("/api/user")
```

@tab PHP

```php
$response = file_get_contents("/api/user");
```

;;

Seluruh contoh dapat ditempatkan dalam satu area yang ringkas.

---

### 1.3 Nested Tabs

Tabs juga dapat ditempatkan di dalam tabs lain.

Contoh:

;;tabs

@tab Frontend

;;tabs

@tab React

Konten React.

@tab Vue

Konten Vue.

;;

@tab Backend

;;tabs

@tab Express

Konten Express.

@tab Fastify

Konten Fastify.

;;

;;

---

### 1.4 Kapan Menggunakan Nested Tabs?

Sangat cocok untuk:

- Dokumentasi framework.
- Dokumentasi SDK.
- Dokumentasi multi-platform.
- Tutorial lintas bahasa pemrograman.

---

## Media Player Otomatis

Sistem mampu mendeteksi berbagai jenis media secara otomatis dan mengubahnya menjadi komponen yang sesuai.

Penulis tidak perlu membuat embed HTML secara manual.

---

### 1.1 Video

Contoh:

![Demo Dashboard](https://files.catbox.moe/8dx1o9.mp4)

Link video secara otomatis akan berubah menjadi pemutar video yang dapat langsung diputar oleh pembaca.

---

#### Studi Kasus Video

Sangat cocok digunakan untuk:

- Demo aplikasi.
- Rekaman layar.
- Tutorial penggunaan produk.
- Presentasi fitur.

---

### 1.2 Audio

Contoh:

![Lofi Study Beats](https://files.catbox.moe/ev13gd.mp3)

Sistem akan mengubahnya menjadi audio player otomatis.

---

#### Studi Kasus Audio

Dapat digunakan untuk:

- Podcast.
- Voice note.
- Dokumentasi suara.
- Sampel audio.

---

### 1.3 Gambar

Contoh:

![Pemandangan Alam](https://files.catbox.moe/fn9y53.jpg)

Sistem akan menampilkan gambar secara otomatis.

---

#### Praktik Terbaik Penggunaan Media

Disarankan untuk:

- Memberikan judul yang jelas pada media.
- Menggunakan file dengan ukuran wajar.
- Mengoptimalkan resolusi gambar.

Contoh:

```markdown
![Diagram Arsitektur Sistem](arsitektur.jpg)
```

lebih informatif dibandingkan:

```markdown
![gambar](arsitektur.jpg)
```

---

## Code Block Modern

Sistem menyediakan code block yang telah ditingkatkan dengan berbagai fitur tambahan.

---

### 1.1 Syntax Highlighting

Kode akan diberi warna sesuai bahasa pemrograman yang digunakan.

Contoh:

```javascript title="server.js"
const app = express();
app.listen(3000);
```

Hal ini membuat kode lebih mudah dibaca.

---

### 1.2 Header Nama File

Penulis dapat menambahkan nama file.

Contoh:

```javascript title="config.js"
export default {};
```

Manfaat:

- Pembaca mengetahui lokasi kode.
- Mempermudah mengikuti tutorial.

---

### 1.3 Tombol Salin

Setiap code block memiliki tombol salin otomatis.

Keuntungan:

- Tidak perlu menyeleksi teks.
- Mengurangi kesalahan saat menyalin kode.

---

### 1.4 Word Wrap

Baris kode panjang akan dibungkus secara otomatis.

Keuntungan:

- Tidak perlu scroll horizontal.
- Lebih nyaman di perangkat mobile.

---

### 1.5 Studi Kasus

Misalnya sebuah URL API sangat panjang:

```javascript
const url = "https://example.com/api/v1/user/profile/settings/notifications/preferences";
```

Dengan word wrap, pembaca tetap dapat membaca seluruh kode tanpa harus menggeser layar ke samping.

---

## Navigasi Anchor

Setiap heading pada halaman secara otomatis memiliki anchor link.

Contoh heading:

```markdown
## Instalasi
```

Akan menghasilkan URL seperti:

```text
/blog/getting-started#instalasi
```

---

### 1.1 Manfaat Anchor

Anchor memudahkan pengguna untuk:

- Membagikan bagian tertentu.
- Menyimpan bookmark.
- Membuat referensi silang antar halaman.

---

#### Contoh Penggunaan

Misalnya ingin merujuk langsung ke bagian media player.

URL:

```text
/blog/getting-started#media-player-otomatis
```

Ketika dibuka, halaman akan langsung menuju bagian tersebut.

---

:::info
Sistem menggunakan offset scroll sehingga judul tidak tertutup oleh navbar saat navigasi anchor dilakukan.
:::

---

### 1.2 Responsivitas

Seluruh komponen telah dirancang agar dapat digunakan pada berbagai ukuran layar.

Didukung untuk:

- Smartphone.
- Tablet.
- Laptop.
- Desktop.

---

#### Optimasi Mobile

Fitur yang telah dioptimalkan:

- Tabs responsif.
- TOC responsif.
- Code block dengan word wrap.
- Media player adaptif.
- Anchor navigation.

---

#### Studi Kasus Lengkap

Berikut contoh struktur dokumentasi proyek yang direkomendasikan:

```markdown
---
title: Dokumentasi REST API
description: Panduan lengkap penggunaan REST API.
slug: rest-api
---

[[toc]]

# Instalasi

# Konfigurasi

:::warning
Jangan membagikan API Key.
:::

# Endpoint

;;tabs

@tab Node.js

...

@tab Python

...

;;

# Demo

![Demo API](demo.mp4)

# Troubleshooting

# FAQ
```

Struktur tersebut menghasilkan dokumentasi yang mudah dibaca, mudah dinavigasi, serta nyaman digunakan pada berbagai perangkat.

---

# Kesimpulan

Sistem blog ini menyediakan berbagai komponen modern yang dirancang untuk membantu proses penulisan dokumentasi dan artikel teknis secara lebih cepat, konsisten, dan profesional. Dengan memanfaatkan Frontmatter, Table of Contents otomatis, Admonition, Tabs, Media Player, Code Block modern, Anchor Navigation, Responsivitas, serta Dark Mode, penulis dapat menghasilkan halaman yang kaya fitur tanpa perlu menulis HTML atau JavaScript secara manual.

Seluruh komponen telah dirancang agar tetap sederhana bagi penulis namun memberikan pengalaman membaca yang optimal bagi pembaca.