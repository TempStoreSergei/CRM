import { http } from '../http';
import type { DashboardAnalytics } from '../types';

export const analyticsService = {
  async getDashboard(): Promise<DashboardAnalytics> {
    const response = await http.get<DashboardAnalytics>('/analytics/dashboard');
    return response.data;
  },

  async getProjectReport(projectId: string): Promise<{
    project: { id: string; name: string };
    timeline: {
      startDate: string;
      endDate: string;
      daysRemaining: number;
    };
    progress: {
      overall: number;
      tasksCompleted: number;
      tasksTotal: number;
    };
    team: {
      size: number;
      workloadDistribution: {
        userId: string;
        name: string;
        tasksAssigned: number;
      }[];
    };
    burndown: {
      date: string;
      remaining: number;
    }[];
  }> {
    const response = await http.get(`/analytics/projects/${projectId}/report`);
    return response.data;
  },
};
