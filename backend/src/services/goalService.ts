import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { CreateGoalInput, CreateReviewInput, GoalWithDetails } from '../types';

export interface GoalFilters {
  departmentId?: string;
  status?: 'in-progress' | 'completed';
  search?: string;
}

export class GoalService {
  /**
   * Retrieves goals with nested employee, department, and reviews data.
   */
  async getAllGoals(filters: GoalFilters = {}): Promise<GoalWithDetails[]> {
    const { departmentId, status, search } = filters;

    const where: Prisma.GoalWhereInput = {};

    if (departmentId && departmentId !== 'ALL') {
      where.employee = {
        departmentId,
      };
    }

    if (status === 'completed') {
      where.progress = 100;
    } else if (status === 'in-progress') {
      where.progress = { lt: 100 };
    }

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { employee: { name: { contains: term, mode: 'insensitive' } } },
      ];
    }

    const goals = await prisma.goal.findMany({
      where,
      include: {
        employee: {
          include: {
            department: true,
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return goals as GoalWithDetails[];
  }

  /**
   * Retrieves a single goal by ID with all relations.
   */
  async getGoalById(id: string): Promise<GoalWithDetails | null> {
    const goal = await prisma.goal.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return goal as GoalWithDetails | null;
  }

  /**
   * Creates a new goal assigned to an employee.
   */
  async createGoal(data: CreateGoalInput): Promise<GoalWithDetails> {
    const goal = await prisma.goal.create({
      data: {
        title: data.title,
        description: data.description,
        deadline: new Date(data.deadline),
        progress: data.progress ?? 0,
        employeeId: data.employeeId,
      },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
        reviews: true,
      },
    });

    return goal as GoalWithDetails;
  }

  /**
   * Updates the progress percentage of a goal.
   */
  async updateGoalProgress(id: string, progress: number): Promise<GoalWithDetails> {
    const goal = await prisma.goal.update({
      where: { id },
      data: {
        progress,
      },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return goal as GoalWithDetails;
  }

  /**
   * Submits a 360-degree peer review for a specific goal.
   */
  async createReview(goalId: string, data: CreateReviewInput) {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      select: { id: true },
    });

    if (!goal) {
      return null;
    }

    const review = await prisma.peerReview.create({
      data: {
        reviewerName: data.reviewerName,
        feedback: data.feedback,
        rating: data.rating,
        goalId,
      },
    });

    return review;
  }
}

export const goalService = new GoalService();
