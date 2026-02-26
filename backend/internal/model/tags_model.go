package model

type Tags struct {
	ID uint `gorm:"primaryKey" json:"id"`

	UserID uint  `json:"userId"`
	User   Users `gorm:"foreignKey:UserID"`

	Name string
}
