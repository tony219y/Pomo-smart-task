package repository

import (
	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) FindAll() ([]model.UserResponse, error) {
	var user []model.UserResponse

	if err := r.db.Model(&model.Users{}).
		Select("id", "email", "username", "role").
		Find(&user).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) FindByEmail(email string) (*model.Users, error) {
	var user model.Users
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) CreateUser(user *model.Users) error {
	return r.db.Transaction(func(tx *gorm.DB) error {

		if err := tx.Create(user).Error; err != nil {
			return err
		}

		defaultTags := []model.Tags{
			{UserID: user.ID, Name: "Work"},
			{UserID: user.ID, Name: "Personal"},
			{UserID: user.ID, Name: "Urgent"},
		}

		if err := tx.Create(&defaultTags).Error; err != nil {
			return err
		}

		return nil
	})
}
