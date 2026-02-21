package repository

import (
	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"gorm.io/gorm"
)

type TestRepository struct {
	db *gorm.DB
}

func NewTestRepository(db *gorm.DB) *TestRepository {
	return &TestRepository{db: db}
}
func (r *TestRepository) FindAll() ([]model.TestType, error) {
	var tests []model.TestType
	err := r.db.Find(&tests).Error
	return tests, err
}
