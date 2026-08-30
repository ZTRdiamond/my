// ─────────────────────────────────────────────────────────────────────────────
// Portfolio Controller
// Renders /portfolio using data from data/portfolio.json (loaded by contentLoader)
// ─────────────────────────────────────────────────────────────────────────────

import { cache } from '../services/cache.js';

export const renderPortfolio = (req, res) => {
  // Pull data from cache (initialized by contentLoader)
  const p = cache.portfolio || {};

  res.render('layouts/base', {
    page: 'portfolio',
    seo: {
      title: 'Portfolio — Fatahillah Al Makarim',
      description:
        'Portfolio dan CV digital Fatahillah Al Makarim — Backend Developer, WhatsApp Bot Engineer, dan Automation Specialist.',
      canonical: '/portfolio',
    },

    // Each section as a top-level variable for clean EJS templates
    profile:       p.profile       || {},
    experience:    p.experience    || [],
    education:    p.education      || [],
    skills:       p.skills        || [],
    languages:    p.languages     || [],
    certifications: p.certifications || [],
    interests:    p.interests     || [],
    funFacts:     p.funFacts      || [],
  });
};
