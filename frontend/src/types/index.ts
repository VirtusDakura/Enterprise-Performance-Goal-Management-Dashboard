export interface Department {
  id: string;
  name: string;
  employeeCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  departmentId: string;
  department?: Department;
  createdAt: string;
  updatedAt?: string;
}

export interface PeerReview {
  id: string;
  reviewerName: string;
  feedback: string;
  rating: number; // 1 to 5
  goalId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  progress: number; // 0 to 100
  employeeId: string;
  employee: Employee & { department: Department };
  reviews: PeerReview[];
  createdAt: string;
  updatedAt: string;
}

export interface TopDepartmentMetrics {
  id: string;
  name: string;
  averageProgress: number;
  goalCount: number;
  employeeCount: number;
}

export interface DepartmentProgressSummary {
  id: string;
  name: string;
  averageProgress: number;
  goalCount: number;
}

export interface AnalyticsData {
  totalActiveGoals: number;
  totalCompletedGoals: number;
  totalGoals: number;
  companyAverageProgress: number;
  topDepartment: TopDepartmentMetrics | null;
  departmentBreakdown: DepartmentProgressSummary[];
  averageReviewRating: number;
  totalReviews: number;
}

export interface CreateGoalPayload {
  title: string;
  description: string;
  deadline: string;
  employeeId: string;
  progress?: number;
}

export interface CreateReviewPayload {
  reviewerName: string;
  feedback: string;
  rating: number;
}

export type StatusFilter = 'ALL' | 'IN_PROGRESS' | 'COMPLETED';
export type SortOption = 'DEADLINE_ASC' | 'DEADLINE_DESC' | 'PROGRESS_DESC' | 'PROGRESS_ASC' | 'NEWEST';
