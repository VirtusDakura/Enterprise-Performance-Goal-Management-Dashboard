import { Router } from 'express';
import { goalController } from '../controllers/goalController';
import { validateRequest } from '../middleware/validateRequest';
import {
  createGoalSchema,
  createReviewSchema,
  updateProgressSchema,
} from '../validations/goalValidation';

const router = Router();

// GET /api/goals - List goals with nested employee & department
router.get('/', (req, res, next) => goalController.getGoals(req, res, next));

// GET /api/goals/:id - Retrieve single goal
router.get('/:id', (req, res, next) => goalController.getGoalById(req, res, next));

// POST /api/goals - Create new goal
router.post('/', validateRequest(createGoalSchema), (req, res, next) =>
  goalController.createGoal(req, res, next)
);

// PATCH /api/goals/:id/progress - Update goal progress percentage
router.patch(
  '/:id/progress',
  validateRequest(updateProgressSchema),
  (req, res, next) => goalController.updateProgress(req, res, next)
);

// POST /api/goals/:id/reviews - Submit 360-degree peer review for goal
router.post(
  '/:id/reviews',
  validateRequest(createReviewSchema),
  (req, res, next) => goalController.createReview(req, res, next)
);

export default router;
