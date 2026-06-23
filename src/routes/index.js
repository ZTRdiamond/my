import { Router } from 'express';
import pagesRouter from './pages.js';
import blogRouter from './blog.js';
import { getProjects } from '../controllers/projectController.js';

const router = Router();

router.use('/', pagesRouter);
router.use('/blog', blogRouter);
router.get('/api/projects', getProjects);

export default router;