import { AdminLog } from "./admin-log.types";

export interface AdminReportSummary {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  totalEstimatedMinutes: number;
  totalLogs: number;
  roleBreakdown: Record<string, number>;
  recentLogs: AdminLog[];
}
