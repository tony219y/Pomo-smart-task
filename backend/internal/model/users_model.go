package model

type Users struct {
	ID       uint   `gorm:"primaryKey" form:"id"`
	Email    string `gorm:"unique;not null" form:"email"`
	Role     string `gorm:"not null;default:'member'"`
	Username string `gorm:"not null" form:"username"`
	Password string `gorm:"not null" form:"password"`
}
type RegisterReq struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
