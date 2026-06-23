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
  // Abaikan jika favicon belum diletakkan di folder public
}

// Injeksi variabel navigasi, config, dan sosial media global
app.use(injectLocals);

// Route mount
app.use('/', router);

// Error pipelines
app.use(handleNotFound);
app.use(handleServerError);

// Jalankan loader data ke memori sebelum melayani request
async function startServer() {
  try {
    await initializeApplicationData();
    app.listen(PORT, () => {
      console.log(`Application successfully listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Core failure. Server startup aborted.', error);
    process.exit(1);
  }
}

startServer();

export default app;