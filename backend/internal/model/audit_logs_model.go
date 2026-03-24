package model

import "time"

type AuditLog struct {
	ID         uint      `gorm:"primaryKey"`
	ActorID    uint      `gorm:"index;not null"`
	Action     string    `gorm:"size:100;not null"`
	EntityType string    `gorm:"size:50"`
	EntityID   *uint
	Metadata   string    `gorm:"type:text"`
	IPAddress  string    `gorm:"size:50"`
	UserAgent  string    `gorm:"size:255"`
	CreatedAt  time.Time
}
