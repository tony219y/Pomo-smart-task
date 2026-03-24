package dto

import "time"

type AdminLogItem struct {
	ID         uint      `json:"id"`
	ActorID    uint      `json:"actorId"`
	ActorName  string    `json:"actorName"`
	ActorEmail string    `json:"actorEmail"`
	Action     string    `json:"action"`
	EntityType string    `json:"entityType"`
	EntityID   *uint     `json:"entityId"`
	Metadata   string    `json:"metadata"`
	IPAddress  string    `json:"ipAddress"`
	CreatedAt  time.Time `json:"createdAt"`
}

type AdminReportSummaryResponse struct {
	TotalUsers            int            `json:"totalUsers"`
	ActiveUsers           int            `json:"activeUsers"`
	TotalTasks            int            `json:"totalTasks"`
	CompletedTasks        int            `json:"completedTasks"`
	TotalEstimatedMinutes int            `json:"totalEstimatedMinutes"`
	TotalLogs             int            `json:"totalLogs"`
	RoleBreakdown         map[string]int `json:"roleBreakdown"`
	RecentLogs            []AdminLogItem `json:"recentLogs"`
}
