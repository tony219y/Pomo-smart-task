package service

import (
	"github.com/tony219y/pomo-smart-task-api/internal/dto"
	"github.com/tony219y/pomo-smart-task-api/internal/repository"
)

type AdminService struct {
	userRepo  *repository.UserRepository
	taskRepo  *repository.TaskRepository
	auditRepo *repository.AuditRepository
}

func NewAdminService(
	userRepo *repository.UserRepository,
	taskRepo *repository.TaskRepository,
	auditRepo *repository.AuditRepository,
) *AdminService {
	return &AdminService{
		userRepo:  userRepo,
		taskRepo:  taskRepo,
		auditRepo: auditRepo,
	}
}

func (s *AdminService) GetLogs() ([]dto.AdminLogItem, error) {
	users, err := s.userRepo.FindAll()
	if err != nil {
		return nil, err
	}

	logs, err := s.auditRepo.FindRecent(100)
	if err != nil {
		return nil, err
	}

	userMap := make(map[uint]struct {
		name  string
		email string
	}, len(users))

	for _, user := range users {
		userMap[user.ID] = struct {
			name  string
			email string
		}{
			name:  user.Username,
			email: user.Email,
		}
	}

	items := make([]dto.AdminLogItem, 0, len(logs))
	for _, log := range logs {
		actor := userMap[log.ActorID]

		items = append(items, dto.AdminLogItem{
			ID:         log.ID,
			ActorID:    log.ActorID,
			ActorName:  actor.name,
			ActorEmail: actor.email,
			Action:     log.Action,
			EntityType: log.EntityType,
			EntityID:   log.EntityID,
			Metadata:   log.Metadata,
			IPAddress:  log.IPAddress,
			CreatedAt:  log.CreatedAt,
		})
	}

	return items, nil
}

func (s *AdminService) GetReportSummary() (*dto.AdminReportSummaryResponse, error) {
	users, err := s.userRepo.FindAll()
	if err != nil {
		return nil, err
	}

	tasks, err := s.taskRepo.FindAllForAdmin()
	if err != nil {
		return nil, err
	}

	logs, err := s.auditRepo.FindRecent(8)
	if err != nil {
		return nil, err
	}

	totalLogs, err := s.auditRepo.Count()
	if err != nil {
		return nil, err
	}

	userMap := make(map[uint]struct {
		name  string
		email string
	}, len(users))

	summary := &dto.AdminReportSummaryResponse{
		RoleBreakdown: map[string]int{
			"member": 0,
			"staff":  0,
			"admin":  0,
		},
		RecentLogs: make([]dto.AdminLogItem, 0, len(logs)),
		TotalLogs:  int(totalLogs),
	}

	for _, user := range users {
		summary.TotalUsers++
		if user.Active {
			summary.ActiveUsers++
		}
		summary.RoleBreakdown[user.Role]++
		userMap[user.ID] = struct {
			name  string
			email string
		}{
			name:  user.Username,
			email: user.Email,
		}
	}

	for _, task := range tasks {
		summary.TotalTasks++
		summary.TotalEstimatedMinutes += task.EstimatedTime
		if task.Status == "done" {
			summary.CompletedTasks++
		}
	}

	for _, log := range logs {
		actor := userMap[log.ActorID]
		summary.RecentLogs = append(summary.RecentLogs, dto.AdminLogItem{
			ID:         log.ID,
			ActorID:    log.ActorID,
			ActorName:  actor.name,
			ActorEmail: actor.email,
			Action:     log.Action,
			EntityType: log.EntityType,
			EntityID:   log.EntityID,
			Metadata:   log.Metadata,
			IPAddress:  log.IPAddress,
			CreatedAt:  log.CreatedAt,
		})
	}

	return summary, nil
}
