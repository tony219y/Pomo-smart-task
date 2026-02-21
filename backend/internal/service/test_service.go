package service

import (
	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"github.com/tony219y/pomo-smart-task-api/internal/repository"
)

type TestService struct {
	repo *repository.TestRepository
}

func NewTestService(r *repository.TestRepository) *TestService {
	return &TestService{repo: r}
}

func (s *TestService) GetTest() ([]model.TestType, error) {

	return s.repo.FindAll()
}
