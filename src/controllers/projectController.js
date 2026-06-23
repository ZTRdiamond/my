import { cache } from '../services/cache.js';

export const getProjects = (req, res) => {
  res.json(cache.projects);
};