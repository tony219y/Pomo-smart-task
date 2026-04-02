export interface StaffRecentTask {
  id: number;
  title: string;
  status: string;
  priority: string;
}

export interface StaffReportSummary {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  totalEstimatedMinutes: number;
  roleBreakdown: Record<string, number>;
  recentTasks: StaffRecentTask[];
}
