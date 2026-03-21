package model

import (
	"time"

	"gorm.io/gorm"
)

type Task struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	UserID        uint      `json:"userId"`
	User          Users     `gorm:"foreignKey:UserID"`
	Title         string    `json:"title" gorm:"type:varchar(255);not null"`
	Description   string    `json:"description"`
	Status        string    `json:"status" gorm:"type:varchar(20);default:'todo'"`
	Priority      string    `json:"priority" gorm:"type:varchar(20);default:'low'"`
	DueDate       time.Time `json:"dueDate"`
	EstimatedTime int       `json:"estimatedTime"`
	Tags          []Tags    `gorm:"many2many:task_tags" json:"tags"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeletedAt     gorm.DeletedAt `gorm:"index"`
}
type TaskResponse struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	UserID        uint      `json:"userId"`
	User          Users     `gorm:"foreignKey:UserID"`
	Title         string    `json:"title" gorm:"type:varchar(255);not null"`
	Description   string    `json:"description"`
	Status        string    `json:"status" gorm:"type:varchar(20);default:'todo'"`
	Priority      string    `json:"priority" gorm:"type:varchar(20);default:'low'"`
	DueDate       time.Time `json:"dueDate"`
	EstimatedTime int       `json:"estimatedTime"`
	Tags          []Tags    `gorm:"many2many:task_tags" json:"tags"`
}
