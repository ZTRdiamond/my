---
title: Setting up Lightweight Self-Hosted Runners for CI/CD Pipelines
description: Panduan langkah demi langkah mengonfigurasi Runner CI/CD mandiri yang efisien dan aman di dalam Virtual Private Server Linux.
slug: self-hosted-runner
tags:
  - self-hosting
  - linux
  - devops
createdAt: 2026-06-22
updatedAt: 2026-06-22
cover: https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1200&q=80
pinned: false
draft: false
---

[[toc]]

## Mengapa Memilih Self-Hosted Runner?

Platform CI/CD seperti GitHub Actions atau GitLab CI menyediakan lingkungan runtime build gratis (SaaS) yang sangat baik. Namun, ada kalanya Anda mengalami keterbatasan menit build bulanan atau membutuhkan resource komputasi yang lebih bertenaga untuk mengompilasi aplikasi berukuran besar.

:::tip
Self-hosted runner memungkinkan proses build memanfaatkan resource disk, cache lokal Docker, dan spesifikasi CPU penuh dari infrastruktur server VPS Linux Anda sendiri tanpa batasan kuota menit.
:::

## Persiapan Keamanan Server VPS

Sebelum menginstal agen runner, sangat disarankan untuk membuat user khusus non-root untuk meminimalkan dampak eksploitasi jika file build Anda tersusupi kode berbahaya.

```bash
# Membuat user baru dengan nama runner
sudo adduser --disabled-password --gecos "" runner-worker

# Menambahkan user runner ke grup Docker agar dapat menjalankan container
sudo usermod -aG docker runner-worker
```

### Langkah Instalasi Agen GitHub Actions Runner

Pindah ke user baru Anda dan lakukan download serta konfigurasi agen runner secara berurutan:

```bash
# Masuk sebagai user runner-worker
sudo su - runner-worker

# Membuat folder kerja runner
mkdir actions-runner && cd actions-runner

# Mengunduh paket arsip agen terbaru
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Mengekstrak arsip tar
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz
```

### Konfigurasi Service Systemd

Agar runner tetap berjalan di latar belakang secara konsisten saat VPS melakukan booting ulang, daftarkan proses ke dalam manajer service systemd Linux:

```bash
# Daftarkan konfigurasi agen menggunakan token repositori Anda
./config.sh --url https://github.com/username/your-repo --token YOUR_RUNNER_REGISTRATION_TOKEN

# Daftarkan ke systemd daemon (lakukan ini sebagai user dengan akses sudo)
sudo ./svc.sh install

# Mulai jalankan service runner
sudo ./svc.sh start
```

:::warning
Jangan pernah mengonfigurasi self-hosted runner publik di repositori open-source publik Anda, karena pihak luar berpotensi menyisipkan kode berbahaya lewat Pull Request untuk mengeksploitasi server host Anda.
:::