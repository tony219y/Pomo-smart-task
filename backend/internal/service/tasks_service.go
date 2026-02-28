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

func (r *TaskService) CreateTask(req *model.Task, userId uint) (*model.Task, error) {
	return r.repo.Create(req, userId)
}
func (r *TaskService) FindAll() {

}
