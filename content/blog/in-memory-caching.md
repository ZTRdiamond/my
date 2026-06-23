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

[[toc]]

## Filosofi "Zero-Database" Caching

Dalam pengembangan REST API berskala kecil hingga menengah, performa response time sering kali terhambat oleh proses pembacaan file berulang-ulang dari disk I/O atau latensi koneksi database eksternal. 

Membangun infrastruktur Redis atau Memcached terkadang dirasa terlalu berlebihan untuk situs portofolio personal, landing page, atau dokumentasi statis. Solusi alternatif yang sangat elegan adalah menggunakan **In-Memory Cache** yang terisolasi di dalam memori runtime Node.js itu sendiri.

:::info
Sistem caching di dalam memori internal sangat efektif untuk data yang jarang mengalami perubahan (read-heavy), seperti artikel blog, dokumentasi API, atau portofolio project.
```

## Memahami Alur Siklus Runtime Cache

Alur kerja in-memory cache sangat sederhana namun mampu memangkas waktu respon API hingga di bawah 10 milidetik.

```text
Request Masuk -> Periksa Cache di Memori -> [Ada] -> Kembalikan Hasil Langsung (1ms)
                                         -> [Tidak Ada] -> Baca Disk / DB -> Simpan ke Cache -> Kembalikan Hasil
```

### Keuntungan Utama In-Memory Cache:
- **Tanpa Overheads Latensi Jaringan**: Mengambil objek JavaScript langsung dari RAM server.
- **Sederhana**: Tidak membutuhkan setup service database atau konfigurasi port tambahan.
- **Biaya Infrastruktur Rendah**: Sangat cocok untuk deployment platform Serverless seperti Vercel Free Plan.

## Implementasi Sederhana Cache Store di Node.js

Anda dapat merancang objek penyimpanan sederhana dengan penanganan kedaluwarsa data (TTL / Time To Live) menggunakan struktur Map bawaan JavaScript:

```javascript
class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  set(key, value, ttlMs = 3600000) {
    const expiresAt = Date.now() + ttlMs;
    this.store.set(key, { value, expiresAt });
  }

  get(key) {
    const cached = this.store.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.store.delete(key); // Hapus jika data kedaluwarsa
      return null;
    }

    return cached.value;
  }

  clear() {
    this.store.clear();
  }
}

export const appCache = new MemoryCache();
```

:::danger
Ingat bahwa in-memory cache bersifat volatile (akan hilang jika server restart) dan kapasitas penyimpanannya dibatasi oleh alokasi RAM yang tersedia pada lingkungan hosting Anda (misal, 512MB di Vercel Container).
:::