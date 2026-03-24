package service

import (
	"github.com/tony219y/pomo-smart-task-api/internal/dto"
	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"github.com/tony219y/pomo-smart-task-api/internal/repository"
)

type AuditLogService struct {
	repo *repository.AuditRepository
}

func NewAuditService(repo *repository.AuditRepository) *AuditLogService {
	return &AuditLogService{repo: repo}
}

func (s *AuditLogService) Create(input dto.CreateAuditLogInput) error {
	log := &model.AuditLog{
		ActorID:    input.ActorID,
		Action:     input.Action,
		EntityType: input.EntityType,
		EntityID:   input.EntityID,
		Metadata:   input.Metadata,
		IPAddress:  input.IPAddress,
		UserAgent:  input.UserAgent,
	}

	return s.repo.Create(log)
}
