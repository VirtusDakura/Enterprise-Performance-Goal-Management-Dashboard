// Enterprise Performance & Goal Management Types & DTOs

export interface DepartmentData {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  departmentId: string;
  department?: DepartmentData;
  createdAt: Date;
  updatedAt: Date;
}

export interface PeerReviewData {
  id: string;
  reviewerName: string;
  feedback: string;
  rating: number;
  goalId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalWithDetails {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  progress: number;
  employeeId: string;
  employee: EmployeeData & { department: DepartmentData };
  reviews: PeerReviewData[];
  createdAt: Date;
  updatedAt: Date;
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

export interface AnalyticsResponse {
  totalActiveGoals: number;
  totalCompletedGoals: number;
  totalGoals: number;
  companyAverageProgress: number;
  topDepartment: TopDepartmentMetrics | null;
  departmentBreakdown: DepartmentProgressSummary[];
  averageReviewRating: number;
  totalReviews: number;
}

export interface CreateGoalInput {
  title: string;
  description: string;
  deadline: string;
  employeeId: string;
  progress?: number;
}

export interface UpdateProgressInput {
  progress: number;
}

export interface CreateReviewInput {
  reviewerName: string;
  feedback: string;
  rating: number;
}
