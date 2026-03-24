export interface ReportTaskItem {
  id: number;
  title: string;
  status: string;
  priority: string;
}

export interface TagReportItem {
  name: string;
  count: number;
}

export interface ReportSummary {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  totalEstimatedMinutes: number;
  completionRate: number;
  topTag: string;
  statusBreakdown: Record<string, number>;
  topTags: TagReportItem[];
  recentTasks: ReportTaskItem[];
}
