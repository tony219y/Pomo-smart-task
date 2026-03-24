package repository

import (
	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"gorm.io/gorm"
)

type AuditRepository struct {
	db *gorm.DB
}

func NewAuditRepository(db *gorm.DB) *AuditRepository {
	return &AuditRepository{db: db}
}

func (r *AuditRepository) Create(log *model.AuditLog) error {
	return r.db.Create(log).Error
}

func (r *AuditRepository) FindRecent(limit int) ([]model.AuditLog, error) {
	var logs []model.AuditLog

	if err := r.db.Order("created_at DESC").Limit(limit).Find(&logs).Error; err != nil {
		return nil, err
	}

	return logs, nil
}

func (r *AuditRepository) Count() (int64, error) {
	var count int64

	if err := r.db.Model(&model.AuditLog{}).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}
