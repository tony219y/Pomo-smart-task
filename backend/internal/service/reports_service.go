package service

import (
	"sort"

	"github.com/tony219y/pomo-smart-task-api/internal/dto"
	"github.com/tony219y/pomo-smart-task-api/internal/repository"
)

type ReportService struct {
	taskRepo *repository.TaskRepository
	userRepo *repository.UserRepository
}

func NewReportService(taskRepo *repository.TaskRepository, userRepo *repository.UserRepository) *ReportService {
	return &ReportService{
		taskRepo: taskRepo,
		userRepo: userRepo,
	}
}

func (s *ReportService) GetSummary(userID uint) (*dto.ReportSummaryResponse, error) {
	tasks, err := s.taskRepo.FindAll(userID)
	if err != nil {
		return nil, err
	}

	summary := &dto.ReportSummaryResponse{
		StatusBreakdown: map[string]int{
			"todo":        0,
			"in_progress": 0,
			"done":        0,
		},
		TopTags:     make([]dto.TagReportItem, 0),
		RecentTasks: make([]dto.ReportTaskItem, 0),
		TopTag:      "No tags yet",
	}

	tagCount := map[string]int{}

	for index, task := range tasks {
		summary.TotalTasks++
		summary.TotalEstimatedMinutes += task.EstimatedTime

		switch task.Status {
		case "done":
			summary.CompletedTasks++
			summary.StatusBreakdown["done"]++
		case "in_progress":
			summary.InProgressTasks++
			summary.StatusBreakdown["in_progress"]++
		default:
			summary.TodoTasks++
			summary.StatusBreakdown["todo"]++
		}

		for _, tag := range task.Tags {
			tagCount[tag.Name]++
		}

		if index < 5 {
			summary.RecentTasks = append(summary.RecentTasks, dto.ReportTaskItem{
				ID:       task.ID,
				Title:    task.Title,
				Status:   task.Status,
				Priority: task.Priority,
			})
		}
	}

	if summary.TotalTasks > 0 {
		summary.CompletionRate = (summary.CompletedTasks * 100) / summary.TotalTasks
	}

	for name, count := range tagCount {
		summary.TopTags = append(summary.TopTags, dto.TagReportItem{
			Name:  name,
			Count: count,
		})
	}

	sort.Slice(summary.TopTags, func(i, j int) bool {
		return summary.TopTags[i].Count > summary.TopTags[j].Count
	})

	if len(summary.TopTags) > 0 {
		summary.TopTag = summary.TopTags[0].Name
	}

	if len(summary.TopTags) > 3 {
		summary.TopTags = summary.TopTags[:3]
	}

	return summary, nil
}

func (s *ReportService) GetTeamSummary() (*dto.TeamReportSummaryResponse, error) {
	users, err := s.userRepo.FindAll()
	if err != nil {
		return nil, err
	}

	tasks, err := s.taskRepo.FindAllForAdmin()
	if err != nil {
		return nil, err
	}

	summary := &dto.TeamReportSummaryResponse{
		RoleBreakdown: map[string]int{
			"member": 0,
			"staff":  0,
			"admin":  0,
		},
		RecentTasks: make([]dto.ReportTaskItem, 0),
	}

	for _, user := range users {
		summary.TotalUsers++
		if user.Active {
			summary.ActiveUsers++
		}
		summary.RoleBreakdown[user.Role]++
	}

	for index, task := range tasks {
		summary.TotalTasks++
		summary.TotalEstimatedMinutes += task.EstimatedTime
		if task.Status == "done" {
			summary.CompletedTasks++
		}

		if index < 5 {
			summary.RecentTasks = append(summary.RecentTasks, dto.ReportTaskItem{
				ID:       task.ID,
				Title:    task.Title,
				Status:   task.Status,
				Priority: task.Priority,
			})
		}
	}

	return summary, nil
}
