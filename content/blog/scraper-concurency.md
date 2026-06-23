---
title: Scaling Concurrency in Web Scrapers without Getting Rate Limited
description: Panduan taktis mengelola konkurensi scraping menggunakan Node.js dan Bottleneck untuk menghindari deteksi Cloudflare.
slug: scrapers-concurrency
tags:
  - scraping
  - nodejs
  - automation
createdAt: 2026-06-20
updatedAt: 2026-06-20
cover: https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80
pinned: true
draft: false
---

[[toc]]

## Mengapa Konkurensi Tanpa Batas Berbahaya?

Saat membuat aplikasi web scraper berbasis Node.js, kecepatan eksekusi asinkronus sering kali menjadi pedang bermata dua. Mengeksekusi ratusan request HTTP secara simultan menggunakan `Promise.all()` memang sangat cepat, namun tindakan tersebut hampir pasti akan memicu sistem pertahanan target (seperti Cloudflare, AWS WAF, atau Akamai) untuk memblokir alamat IP scraper Anda.

:::warning
Melakukan spam request ke server target dalam waktu singkat akan memicu HTTP Status Code 429 (Too Many Requests) dan dapat mengakibatkan pemblokiran IP permanen melalui sistem IP Reputation.
:::

## Strategi Pengaturan Limitasi Antrean

Untuk menskalakan scraper secara aman, kita perlu menerapkan pembatasan konkurensi (Concurrency Limit) serta jeda waktu dinamis (Politeness Delay).

### Tabel Strategi Pengelolaan Request

| Strategi | Kelebihan | Kekurangan | Kasus Penggunaan Ideal |
| :--- | :--- | :--- | :--- |
| **Fixed Interval** | Sangat mudah dikonfigurasi | Pola terlalu statis, mudah dideteksi | API publik non-WAF |
| **Jittered Delay** | Menyerupai perilaku manusia | Kecepatan penarikan data menurun | Scraping E-Commerce / Sosmed |
| **Token Bucket** | Pengelolaan kuota request presisi | Konfigurasi state di memori rumit | Scraper skala enterprise |

## Implementasi Menggunakan Bottleneck

Di ekosistem Node.js, library terbaik untuk mengelola antrean request secara asinkronus adalah **Bottleneck**. Berikut adalah contoh implementasi taktis pembatasan konkurensi:

```javascript
import Bottleneck from 'bottleneck';
import axios from 'axios';

// Inisialisasi limiter bottleneck
const limiter = new Bottleneck({
  maxConcurrent: 3,                 // Maksimal 3 request berjalan bersamaan
  minTime: 1500,                    // Jeda minimal 1.5 detik antar request
  reservoir: 100,                   // Jatah request (bucket) awal
  reservoirRefreshInterval: 60000,  // Reset reservoir setiap 1 menit
  reservoirRefreshAmount: 100       // Isi kembali reservoir sebanyak 100
});

// Wrapper fungsi penarikan data
const scrapeTargetPage = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...' }
    });
    return response.data;
  } catch (error) {
    console.error(`Gagal mengunduh halaman: ${url}`, error.message);
    throw error;
  }
};

// Daftarkan tugas penarikan ke dalam antrean limiter
const safeScrape = limiter.wrap(scrapeTargetPage);
```

:::tip
Selalu kombinasikan manajemen antrean ini dengan penggunaan IP rotasi (Rotating Proxy) berkualitas tinggi untuk mendistribusikan beban request dari beberapa node IP yang berbeda.
:::