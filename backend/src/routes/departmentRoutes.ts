import { Router } from 'express';
import { departmentController } from '../controllers/departmentController';

const router = Router();

// GET /api/departments - List all departments
router.get('/departments', (req, res, next) =>
  departmentController.getDepartments(req, res, next)
);

// GET /api/employees - List all employees with department
router.get('/employees', (req, res, next) =>
  departmentController.getEmployees(req, res, next)
);

export default router;
