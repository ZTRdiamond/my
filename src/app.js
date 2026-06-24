import express from 'express';
import path from 'path';
import compression from 'compression';
import serveFavicon from 'serve-favicon';
import router from './routes/index.js';
import { initializeApplicationData } from './services/contentLoader.js';
import { injectLocals } from './middlewares/locals.js';
import { handleNotFound, handleServerError } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Setup template configurations
app.set('view engine', 'ejs');
app.set('views', path.resolve('views'));

// Core middleware
app.use(compression());

// Static file pathways
app.use(express.static(path.resolve('public')));
try {
  app.use(serveFavicon(path.resolve('public', 'favicon', 'favicon.ico')));
} catch (e) {
  // Abaikan jika favicon belum tersedia
}

app.use(injectLocals);

// =================================================================
// INITIALIZATION GUARD MIDDLEWARE (SOLUSI VERCEL COLD START)
// =================================================================
let isInitialized = false;
let initPromise = null;

async function ensureDataInitialized(req, res, next) {
  // Jika data sudah ada di memori, langsung loloskan request (0ms latency)
  if (isInitialized) {
    return next();
  }

  // Jika proses load belum pernah berjalan, jalankan sekali saja
  if (!initPromise) {
    initPromise = initializeApplicationData()
      .then(() => {
        isInitialized = true;
      })
      .catch((err) => {
        initPromise = null; // Reset promise agar bisa dicoba kembali jika gagal
        console.error('Gagal memuat cache data saat cold start:', err);
        throw err;
      });
  }

  // Tahan request HTTP ini sampai proses load asinkronus selesai
  try {
    await initPromise;
    next();
  } catch (error) {
    next(error);
  }
}

// Pasang guard secara global sebelum router utama diakses
app.use(ensureDataInitialized);
// =================================================================

// Route mount
app.use('/', router);

// Error pipelines
app.use(handleNotFound);
app.use(handleServerError);

// Jalankan listener lokal (hanya aktif jika dijalankan di VPS/Komputer Lokal)
if (process.env.NODE_ENV !== 'production') {
  initializeApplicationData().then(() => {
    app.listen(PORT, () => {
      console.log(`Server lokal berjalan aktif di port ${PORT}`);
    });
  }).catch(err => {
    console.error('Gagal mematangkan data lokal:', err);
  });
}

export default app;