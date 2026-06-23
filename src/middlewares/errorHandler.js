import { buildSeoOptions } from '../services/seo.js';

export function handleNotFound(req, res) {
  res.status(404).render('layouts/base', {
    page: '404',
    seo: buildSeoOptions({ title: 'Page Not Found' })
  });
}

export function handleServerError(err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('layouts/base', {
    page: '500',
    seo: buildSeoOptions({ title: 'Internal Server Error' }),
    error: process.env.NODE_ENV === 'development' ? err.message : 'A server error has occurred.'
  });
}