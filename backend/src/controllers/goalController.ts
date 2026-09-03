import { Request, Response, NextFunction } from 'express';
import { goalService } from '../services/goalService';

export class GoalController {
  /**
   * GET /api/goals
   * Fetches all goals with nested employee and department data.
   */
  async getGoals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { departmentId, status, search } = req.query;

      const goals = await goalService.getAllGoals({
        departmentId: departmentId as string | undefined,
        status: status as 'in-progress' | 'completed' | undefined,
        search: search as string | undefined,
      });

      res.status(200).json({
        success: true,
        count: goals.length,
        data: goals,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/goals/:id
   * Fetches a single goal by ID.
   */
  async getGoalById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const goal = await goalService.getGoalById(id);

      if (!goal) {
        res.status(404).json({
          success: false,
          error: `Goal with ID '${id}' was not found.`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: goal,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/goals
   * Creates a new goal.
   */
  async createGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const goal = await goalService.createGoal(req.body);

      res.status(201).json({
        success: true,
        message: 'Goal created successfully.',
        data: goal,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/goals/:id/progress
   * Updates the progress percentage of a goal.
   */
  async updateProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const { progress } = req.body;

      const updatedGoal = await goalService.updateGoalProgress(id, progress);

      res.status(200).json({
        success: true,
        message: 'Goal progress updated successfully.',
        data: updatedGoal,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/goals/:id/reviews
   * Submits a 360-degree peer review for a specific goal.
   */
  async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const review = await goalService.createReview(id, req.body);

      if (!review) {
        res.status(404).json({
          success: false,
          error: `Goal with ID '${id}' was not found.`,
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Peer review submitted successfully.',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const goalController = new GoalController();
