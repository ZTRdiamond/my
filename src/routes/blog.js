import { Router } from 'express';
import { renderBlogIndex, renderBlogPost } from '../controllers/blogController.js';

const router = Router();

router.get('/', renderBlogIndex);
router.get('/:slug', renderBlogPost);

export default router;