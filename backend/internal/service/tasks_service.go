package service

import (
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
