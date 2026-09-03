import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export class DepartmentController {
  /**
   * GET /api/departments
   * Retrieves all departments with employee counts.
   */
  async getDepartments(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const departments = await prisma.department.findMany({
        include: {
          _count: {
            select: { employees: true },
          },
        },
        orderBy: { name: 'asc' },
      });

      res.status(200).json({
        success: true,
        data: departments.map((d) => ({
          id: d.id,
          name: d.name,
          employeeCount: d._count?.employees ?? 0,
          createdAt: d.createdAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/employees
   * Retrieves all employees with their department.
   */
  async getEmployees(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employees = await prisma.employee.findMany({
        include: {
          department: {
            select: { id: true, name: true },
          },
        },
        orderBy: { name: 'asc' },
      });

      res.status(200).json({
        success: true,
        data: employees,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const departmentController = new DepartmentController();
