import { cache } from '../services/cache.js';

export function injectLocals(req, res, next) {
  res.locals.navigation = cache.navigation || [];
  res.locals.socials = cache.socials || [];
  res.locals.config = cache.config || {};
  res.locals.currentPath = req.path;
  next();
}