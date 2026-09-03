import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';

const router = Router();

// GET /api/analytics - Aggregated performance metrics & top department
router.get('/', (req, res, next) => analyticsController.getAnalytics(req, res, next));

export default router;
