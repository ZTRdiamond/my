import { Router } from 'express';
import { renderHome, renderDocsIndex, renderDocDetail } from '../controllers/pageController.js';
import { renderPortfolio } from '../controllers/portfolioController.js';
import { renderPortfolioPrint, downloadPortfolioPDF } from '../controllers/portfolioPrintController.js';

const router = Router();

router.get('/', renderHome);
router.get('/docs', renderDocsIndex);
router.get('/docs/:slug', renderDocDetail);
router.get('/portfolio', renderPortfolio);
router.get('/portfolio/print', renderPortfolioPrint);
router.get('/portfolio/cv.pdf', downloadPortfolioPDF);

export default router;
