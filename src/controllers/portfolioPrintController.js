// ─────────────────────────────────────────────────────────────────────────────
// Portfolio Print Controller
// - GET /portfolio/print  → clean HTML preview (Amsterdam style, auto print)
// - GET /portfolio/cv.pdf → auto-download PDF (server-generated, 1-page A4)
// ─────────────────────────────────────────────────────────────────────────────

import { cache } from '../services/cache.js';
import { generatePortfolioPDF } from '../services/pdfService.js';

export const renderPortfolioPrint = (req, res) => {
  const p = cache.portfolio || {};

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.render('pages/portfolio-print', {
    profile:         p.profile         || {},
    experience:     p.experience      || [],
    education:     p.education       || [],
    skills:         p.skills          || [],
    languages:      p.languages       || [],
    certifications: p.certifications  || [],
    interests:      p.interests       || [],
    funFacts:       p.funFacts       || [],
  });
};

export const downloadPortfolioPDF = async (req, res) => {
  const p = cache.portfolio || {};

  try {
    const pdfBuffer = await generatePortfolioPDF({
      profile:         p.profile         || {},
      experience:     p.experience      || [],
      education:     p.education       || [],
      skills:         p.skills          || [],
      languages:      p.languages       || [],
      certifications: p.certifications  || [],
      interests:      p.interests       || [],
      funFacts:       p.funFacts       || [],
    });

    const filename = `CV-${(p.profile?.name || 'Portfolio').replace(/\s+/g, '-')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.send(pdfBuffer);
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    res.status(500).send('Gagal menghasilkan PDF. Silakan coba beberapa saat lagi.');
  }
};
