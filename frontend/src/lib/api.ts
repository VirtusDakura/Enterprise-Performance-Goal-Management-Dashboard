import {
  AnalyticsData,
  CreateGoalPayload,
  CreateReviewPayload,
  Department,
  Employee,
  Goal,
  PeerReview,
} from '../types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage =
        result.error || result.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return result.data as T;
  }

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    return this.request<AnalyticsData>('/analytics');
  }

  // Goals
  async getGoals(params?: {
    departmentId?: string;
    status?: string;
    search?: string;
  }): Promise<Goal[]> {
    const searchParams = new URLSearchParams();
    if (params?.departmentId && params.departmentId !== 'ALL') {
      searchParams.append('departmentId', params.departmentId);
    }
    if (params?.status && params.status !== 'ALL') {
      searchParams.append('status', params.status === 'COMPLETED' ? 'completed' : 'in-progress');
    }
    if (params?.search && params.search.trim()) {
      searchParams.append('search', params.search.trim());
    }

    const query = searchParams.toString();
    const endpoint = query ? `/goals?${query}` : '/goals';
    return this.request<Goal[]>(endpoint);
  }

  async getGoalById(id: string): Promise<Goal> {
    return this.request<Goal>(`/goals/${id}`);
  }

  async createGoal(payload: CreateGoalPayload): Promise<Goal> {
    return this.request<Goal>('/goals', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateGoalProgress(id: string, progress: number): Promise<Goal> {
    return this.request<Goal>(`/goals/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ progress }),
    });
  }

  async submitPeerReview(
    goalId: string,
    payload: CreateReviewPayload
  ): Promise<PeerReview> {
    return this.request<PeerReview>(`/goals/${goalId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Departments & Employees
  async getDepartments(): Promise<Department[]> {
    return this.request<Department[]>('/departments');
  }

  async getEmployees(): Promise<Employee[]> {
    return this.request<Employee[]>('/employees');
  }
}

export const api = new ApiClient();
