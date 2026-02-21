package model

type TestType struct {
	ID          uint   `gorm:"primaryKey"`
	FullName    string `gorm:"size:100; not null"`
	Description string
}
