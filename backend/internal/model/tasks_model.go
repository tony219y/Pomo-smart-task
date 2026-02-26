package model

import (
	"time"

	"gorm.io/gorm"
)

type Task struct {
	ID          uint      `gorm:"primaryKey"`
	UserID      uint      `json:"userId"`
	User        Users     `gorm:"foreignKey:UserID"`
	Title       string    `json:"title" gorm:"type:varchar(255);not null"`
	Description string    `json:"description"`
	Status      string    `json:"status" gorm:"type:varchar(20);default:'todo'"`
	Priority    string    `json:"priority" gorm:"type:varchar(20);default:'medium'"`
	DueDate     time.Time `json:"dueDate"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`
}

type TaskTags struct {
	TaskID uint
	Tasks  Task `gorm:"foreignKey:TaskID"`

	TagsID uint
	Tags   Tags `gorm:"foreignKey:TagsID"`
}
