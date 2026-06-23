import { Router } from 'express';
import { renderHome, renderDocsIndex, renderDocDetail } from '../controllers/pageController.js';

const router = Router();

router.get('/', renderHome);
router.get('/docs', renderDocsIndex);
router.get('/docs/:slug', renderDocDetail);

export default router;