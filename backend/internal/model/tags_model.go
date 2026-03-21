package model

type Tags struct {
	ID uint `gorm:"primaryKey" json:"id"`

	UserID uint  `gorm:"uniqueIndex:idx_user_tag_name" json:"userId"`
	User   Users `gorm:"foreignKey:UserID" json:"-"`

	Name string `gorm:"size:100; not null; uniqueIndex:idx_user_tag_name"`
}

type TagResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
