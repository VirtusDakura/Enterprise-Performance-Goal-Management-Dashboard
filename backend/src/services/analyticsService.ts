import { prisma } from '../lib/prisma';
import { AnalyticsResponse, DepartmentProgressSummary, TopDepartmentMetrics } from '../types';

export class AnalyticsService {
  /**
   * Aggregates organization-wide performance velocity, departmental rankings,
   * and peer review metrics.
   */
  async getAnalytics(): Promise<AnalyticsResponse> {
    const [totalGoals, totalActiveGoals, totalCompletedGoals] = await Promise.all([
      prisma.goal.count(),
      prisma.goal.count({ where: { progress: { lt: 100 } } }),
      prisma.goal.count({ where: { progress: 100 } }),
    ]);

    const goalAgg = await prisma.goal.aggregate({
      _avg: { progress: true },
    });

    const companyAverageProgress =
      goalAgg._avg.progress !== null
        ? Math.round(goalAgg._avg.progress * 10) / 10
        : 0;

    const departments = await prisma.department.findMany({
      include: {
        employees: {
          include: {
            goals: {
              select: {
                progress: true,
              },
            },
          },
        },
      },
    });

    const departmentSummaries: (DepartmentProgressSummary & { employeeCount: number })[] =
      departments.map((dept) => {
        const allDeptGoals = dept.employees.flatMap((emp) => emp.goals);
        const goalCount = allDeptGoals.length;
        const employeeCount = dept.employees.length;

        const totalProgress = allDeptGoals.reduce((sum, g) => sum + g.progress, 0);
        const avgProgress =
          goalCount > 0
            ? Math.round((totalProgress / goalCount) * 10) / 10
            : 0;

        return {
          id: dept.id,
          name: dept.name,
          averageProgress: avgProgress,
          goalCount,
          employeeCount,
        };
      });

    const departmentsWithGoals = departmentSummaries.filter((d) => d.goalCount > 0);
    departmentsWithGoals.sort((a, b) => b.averageProgress - a.averageProgress);

    const topDeptData = departmentsWithGoals[0] ?? null;

    const topDepartment: TopDepartmentMetrics | null = topDeptData
      ? {
          id: topDeptData.id,
          name: topDeptData.name,
          averageProgress: topDeptData.averageProgress,
          goalCount: topDeptData.goalCount,
          employeeCount: topDeptData.employeeCount,
        }
      : null;

    const reviewAgg = await prisma.peerReview.aggregate({
      _avg: { rating: true },
      _count: { id: true },
    });

    const averageReviewRating =
      reviewAgg._avg.rating !== null
        ? Math.round(reviewAgg._avg.rating * 10) / 10
        : 0;

    return {
      totalActiveGoals,
      totalCompletedGoals,
      totalGoals,
      companyAverageProgress,
      topDepartment,
      departmentBreakdown: departmentSummaries.map(({ id, name, averageProgress, goalCount }) => ({
        id,
        name,
        averageProgress,
        goalCount,
      })),
      averageReviewRating,
      totalReviews: reviewAgg._count.id,
    };
  }
}

export const analyticsService = new AnalyticsService();
