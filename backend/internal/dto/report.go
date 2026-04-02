package dto

type ReportTaskItem struct {
	ID       uint   `json:"id"`
	Title    string `json:"title"`
	Status   string `json:"status"`
	Priority string `json:"priority"`
}

type TagReportItem struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

type ReportSummaryResponse struct {
	TotalTasks            int             `json:"totalTasks"`
	CompletedTasks        int             `json:"completedTasks"`
	InProgressTasks       int             `json:"inProgressTasks"`
	TodoTasks             int             `json:"todoTasks"`
	TotalEstimatedMinutes int             `json:"totalEstimatedMinutes"`
	CompletionRate        int             `json:"completionRate"`
	TopTag                string          `json:"topTag"`
	StatusBreakdown       map[string]int  `json:"statusBreakdown"`
	TopTags               []TagReportItem `json:"topTags"`
	RecentTasks           []ReportTaskItem `json:"recentTasks"`
}

type TeamReportSummaryResponse struct {
	TotalUsers            int              `json:"totalUsers"`
	ActiveUsers           int              `json:"activeUsers"`
	TotalTasks            int              `json:"totalTasks"`
	CompletedTasks        int              `json:"completedTasks"`
	TotalEstimatedMinutes int              `json:"totalEstimatedMinutes"`
	RoleBreakdown         map[string]int   `json:"roleBreakdown"`
	RecentTasks           []ReportTaskItem `json:"recentTasks"`
}
