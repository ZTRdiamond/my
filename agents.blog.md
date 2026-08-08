# Agents Context: Cara Membuat & Menulis Blog

Dokumen ini adalah panduan bagi agent (atau kontributor) yang ingin menambahkan artikel blog ke proyek **personal-portfolio-blog**. Semua aturan di sini didasarkan pada referensi artikel yang sudah ada di `content/blog/`.

## 1. Lokasi File

Semua artikel blog disimpan di folder:

```
content/blog/
```

Buat file baru dengan ekstensi `.md`. Nama file boleh bebas, tetapi disarankan menggunakan huruf kecil dan tanda hubung:

```
content/blog/judul-artikel-saya.md
```

> Catatan: `slug` di frontmatter yang akan menjadi URL, bukan nama file.

## 2. Frontmatter (Wajib & Opsional)

Setiap artikel harus diawali dengan frontmatter YAML di antara tiga tanda hubung `---`:

```yaml
---
title: "Judul Artikel yang Menarik"
description: "Deskripsi singkat 1–2 kalimat yang menjelaskan isi artikel."
slug: judul-artikel-yang-menarik
tags:
  - Tag1
  - Tag2
  - Tag3
createdAt: 2026-06-28
updatedAt: 2026-06-28
written: Gemini AI & Me
cover: https://images.unsplash.com/photo-xxx
pinned: false
draft: false
---
```

### Penjelasan Field

| Field | Wajib | Keterangan |
|-------|-------|------------|
| `title` | ✅ | Judul lengkap artikel. Boleh pakai tanda kutip jika ada karakter khusus. |
| `description` | ✅ | Ringkasan singkat untuk SEO dan card preview. |
| `slug` | ✅ | URL artikel. Harus unik. Format: huruf kecil, tanpa spasi, pakai tanda hubung. |
| `tags` | ✅ | Array tag. Setiap tag diawali huruf besar (PascalCase). Lihat daftar tag umum di bawah. |
| `createdAt` | ✅ | Tanggal publikasi. Format: `YYYY-MM-DD`. |
| `updatedAt` | ✅ | Tanggal terakhir diedit. Boleh sama dengan `createdAt`. |
| `written` | ✅ | Nama penulis. Di proyek ini umumnya ditulis `"Gemini AI & Me"`. |
| `cover` | ✅ | URL gambar cover. Boleh dari Unsplash atau Catbox. |
| `pinned` | ❌ | `true` jika ingin menyematkan artikel di atas. Default: `false`. |
| `draft` | ❌ | `true` untuk menyembunyikan artikel. Default: `false`. |

### Tag yang Sering Digunakan

Berdasarkan artikel yang sudah ada:

- `Science`
- `Medicine`
- `Biology`
- `Medical Research`
- `Public Health`
- `Fiqh`
- `Islam`
- `Sosial`
- `Psikologi`
- `Gen Z`
- `Media Sosial`
- `Life`
- `General`

Gunakan tag yang paling relevan dengan isi artikel. Jumlah tag umumnya 3–5.

## 3. Struktur Artikel Standar

Gunakan struktur berikut sebagai acuan:

```markdown
---
# frontmatter
---

[[toc]]

# Pendahuluan

Paragraf pembuka yang mengaitkan topik dengan konteks umum, mengapa penting, dan apa yang akan dibahas.

---

## 1. Subjudul Pertama

Isi pembahasan.

---

## 2. Subjudul Kedua

Isi pembahasan.

---

## Kesimpulan

Ringkasan singkat dan penutup.

---

## Referensi

* Nama Penulis. (Tahun). Judul Karya. *Nama Publikasi*. URL [x.x]
```

### Catatan Struktur

- `[[toc]]` → akan dirender sebagai dropdown **Table of Content** otomatis.
- Gunakan tanda `---` (tiga tanda hubung) sebagai pemisah antar section untuk memberikan jarak visual.
- Heading level 1 (`#`) hanya untuk judul utama / pendahuluan.
- Heading level 2 (`##`) untuk section utama.
- Heading level 3 (`###`) untuk sub-section.

## 4. Gaya Penulisan

Berdasarkan artikel referensi:

- **Bahasa:** Indonesia (formal namun mudah dipahami).
- **Nada:** Informatif, analitis, dan reflektif.
- **Paragraf:** Cukup panjang dan mendalam, bukan poin-poin pendek semata.
- **Istilah asing:** Tulis dalam *miring* (italic) saat pertama kali muncul, contoh: *man flu*, *third-hand smoke*.
- **Penekanan:** Gunakan **bold** untuk istilah kunci atau kesimpulan.
- **Kutipan:** Gunakan blockquote `>` untuk kutipan langsung dari tokoh atau teks.

### Contoh Pembukaan yang Baik

> Di era digital yang serbavisual ini, manusia modern seakan-akan hidup di bawah pengawasan lensa raksasa yang tidak pernah tidur...

> Kebiasaan merokok masih menjadi salah satu tantangan kesehatan masyarakat terbesar di dunia...

## 5. Markdown Extensions yang Bisa Digunakan

### A. Table of Content

```markdown
[[toc]]
```

Letakkan di awal artikel, setelah frontmatter.

### B. Admonitions

Gunakan untuk membuat kotak peringatan/informasi:

```markdown
:::warning
Pesan peringatan atau catatan penting di sini.
:::

:::danger
Pesan bahaya atau risiko serius di sini.
:::

:::tip
Saran atau tips praktis di sini.
:::

:::info
Informasi tambahan di sini.
:::
```

Tipe yang tersedia: `note`, `info`, `tip`, `warning`, `caution`, `danger`.

### C. Tabs

Gunakan untuk konten yang memiliki beberapa kategori:

```markdown
;;tabs

@tab Tab Satu

Konten tab pertama.

@tab Tab Dua

Konten tab kedua.

@tab Tab Tiga

Konten tab ketiga.

;;
```

### D. Gambar

```markdown
![Alt Text](https://url-gambar.jpg)
```

Gambar akan otomatis mendapatkan lazy loading.

### E. Tabel

```markdown
| Kolom A | Kolom B | Kolom C |
| :--- | :--- | :--- |
| Data 1 | Data 2 | Data 3 |
| Data 4 | Data 5 | Data 6 |
```

### F. Code Block

Gunakan tiga backtick dengan bahasa:

```markdown
```javascript
console.log('Hello World');
```
```

Akan dirender sebagai Mac-style code block dengan syntax highlighting dan tombol copy.

### G. Blockquote

```markdown
> Ini adalah kutipan.
```

### H. Heading Anchor

Setiap heading akan otomatis mendapat link anchor. Tidak perlu ditulis manual.

## 6. Penulisan Referensi & Kutipan

Berdasarkan artikel ilmiah yang sudah ada, gunakan format referensi sederhana:

```markdown
---

## Referensi

* Sue, K. (2017). The science behind "man flu". *BMJ*, 359, j5560. https://doi.org/10.1136/bmj.j5560 [2.1]
```

Di dalam artikel, kutipan ditandai dengan angka referensi:

```markdown
Penelitian menunjukkan bahwa pria memiliki respons imun yang berbeda [2.1].
```

Format: `[bab.referensi]`, contoh: `[2.1]`, `[1.1]`, `[6.1]`.

## 7. Cover Image

Gunakan URL gambar yang relevan dengan topik. Sumber yang sering dipakai:

- **Unsplash:** `https://images.unsplash.com/photo-xxx`
- **Catbox:** `https://files.catbox.moe/xxx`

Pilih gambar dengan rasio lebar yang baik (landscape), karena akan ditampilkan sebagai cover card dan hero image.

## 8. Contoh Artikel Minimal

```markdown
---
title: "Hello World!"
description: "Ini adalah artikel pertama yang saya buat."
slug: hello-world
tags:
  - General
createdAt: 2026-06-22
updatedAt: 2026-06-22
written: Gemini AI & Me
cover: https://files.catbox.moe/fn9y53.jpg
pinned: true
draft: false
---

[[toc]]

# content here
```

> Catatan: `base.txt` di `content/blog/` adalah template kosong. Jangan hapus. Boleh gunakan sebagai starting point.

## 9. Setelah Menulis Artikel

1. Pastikan frontmatter valid (tidak ada typo di field wajib).
2. Pastikan `slug` unik dan belum dipakai artikel lain.
3. Jalankan server lokal: `npm run dev`
4. Buka `http://localhost:3000/blog/<slug>` untuk preview.
5. Periksa apakah `[[toc]]`, admonitions, dan tabs render dengan benar.
6. Jika sudah oke, commit perubahan.

## 10. Hal yang Harus Dihindari

- ❌ Jangan membuat `slug` dengan spasi atau karakter khusus.
- ❌ Jangan lupa menutup admonition dengan `:::`.
- ❌ Jangan menggunakan heading level 1 (`#`) di tengah artikel — gunakan hanya di awal / pendahuluan.
- ❌ Jangan membuat artikel yang terlalu pendek tanpa nilai informasi.
- ❌ Jangan memakai `draft: true` untuk artikel yang sebenarnya ingin dipublikasikan.

---

**Referensi pembelajaran:** Lihat file-file di `content/blog/` sebagai contoh nyata.
