package model

type Users struct {
	ID       uint   `gorm:"primaryKey" form:"id"`
	Email    string `gorm:"unique;not null" form:"email"`
	Role     string `gorm:"not null;default:'member'"`
	Active   bool   `gorm:"not null;default:true"`
	Username string `gorm:"not null" form:"username"`
	Password string `gorm:"not null" form:"password"`
}
type UserResponse struct {
	ID       uint   `json:"id"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	Active   bool   `json:"active"`
	Username string `json:"username"`
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
