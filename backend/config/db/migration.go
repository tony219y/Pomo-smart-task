package db

import (
	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"gorm.io/gorm"
)

func Migration(db *gorm.DB) {
	db.AutoMigrate(
		&model.TestType{},
	)
}
