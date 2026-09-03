import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analyticsService';

export class AnalyticsController {
  /**
   * GET /api/analytics
   * Aggregates active goals, company average progress, and top department.
   */
  async getAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await analyticsService.getAnalytics();

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
