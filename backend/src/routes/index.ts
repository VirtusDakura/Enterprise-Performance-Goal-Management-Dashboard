import { Router } from 'express';
import goalRoutes from './goalRoutes';
import analyticsRoutes from './analyticsRoutes';
import departmentRoutes from './departmentRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'enterprise-performance-api',
  });
});

// Mount domain routes
router.use('/goals', goalRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/', departmentRoutes);

export default router;
