package service

import (
	"github.com/tony219y/pomo-smart-task-api/internal/dto"
	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"github.com/tony219y/pomo-smart-task-api/internal/repository"
)

type TaskService struct {
	repo *repository.TaskRepository
}

func NewTaskService(repo *repository.TaskRepository) *TaskService {
	return &TaskService{repo: repo}
}

func (s *TaskService) CreateTask(req *model.Task, userID uint) (*model.Task, error) {
	return s.repo.Create(req, userID)
}

func (s *TaskService) FindAll(userID uint) ([]model.TaskResponse, error) {
	return s.repo.FindAll(userID)
}

func (s *TaskService) FindByID(userID uint, taskID uint) (*model.TaskResponse, error) {
	return s.repo.FindByID(userID, taskID)
}

func (s *TaskService) UpdateTask(userID uint, taskID uint, req *dto.UpdateTaskRequest) (*model.Task, error) {
	updates := map[string]interface{}{}
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}
	if req.Status != nil {
		updates["status"] = *req.Status
	}
	if req.Priority != nil {
		updates["priority"] = *req.Priority
	}
	if req.DueDate != nil {
		updates["due_date"] = *req.DueDate
	}
	if req.EstimatedTime != nil {
		updates["estimated_time"] = *req.EstimatedTime
	}

	return s.repo.Update(taskID, userID, updates)
}

func (s *TaskService) DeleteTask(userID uint, taskID uint) error {
	return s.repo.Delete(taskID, userID)
}
