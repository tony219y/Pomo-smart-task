package service

import (
	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"github.com/tony219y/pomo-smart-task-api/internal/repository"
)

type TagService struct {
	repo *repository.TagRepository
}

func NewTagsService(repo *repository.TagRepository) *TagService {
	return &TagService{repo: repo}
}

// func (s *TagService) Name() (model.Tags, err) {

// }

func (s *TagService) GetTagsByUserID(userID uint) ([]model.TagResponse, error) {
	return s.repo.GetTagsByUserID(userID)
}
