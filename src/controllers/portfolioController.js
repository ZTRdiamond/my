// ─────────────────────────────────────────────────────────────────────────────
// Portfolio Controller
// Renders /portfolio using data from data/portfolio.json (loaded by contentLoader)
// ─────────────────────────────────────────────────────────────────────────────

import { cache } from '../services/cache.js';

export const renderPortfolio = (req, res) => {
  const p = cache.portfolio || {};
  const profile = p.profile || {};
  const siteUrl = cache.config?.siteUrl || 'https://ztrdiamond.is-a.dev';

  res.render('layouts/base', {
    page: 'portfolio',
    seo: {
      title: `${profile.name} — Portfolio & CV`,
      description: profile.summary
        ? profile.summary.replace(/\s+/g, ' ').trim().substring(0, 160)
        : `Portfolio dan CV digital ${profile.name} — ${profile.title || 'Backend Developer'}.`,
      canonical: `${siteUrl}/portfolio`,
      ogType: 'website',
      ogTitle: `${profile.name} — Portfolio & CV`,
      ogDescription: profile.summary
        ? profile.summary.replace(/\s+/g, ' ').trim().substring(0, 160)
        : `${profile.name} — ${profile.title || 'Backend Developer'}.`,
      ogImage: profile.avatar
        ? `${siteUrl}${profile.avatar}`
        : `${siteUrl}/images/profile/ztrdiamond.webp`,
      ogImageAlt: `Foto profil ${profile.name}`,
    },

    profile:       profile,
    experience:    p.experience    || [],
    education:     p.education    || [],
    skills:       p.skills       || [],
    languages:     p.languages    || [],
    certifications: p.certifications || [],
    interests:     p.interests    || [],
    funFacts:      p.funFacts    || [],
  });
};
