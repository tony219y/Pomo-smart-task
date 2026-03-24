package repository

import (
	"time"

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
		Select("id", "email", "username", "role", "active").
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

func (r *UserRepository) GetUserByID(userID uint) (*model.UserResponse, error) {
	var user model.UserResponse

	if err := r.db.Model(&model.Users{}).Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) FindUserByID(userID uint) (*model.Users, error) {
	var user model.Users
	if err := r.db.Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) UpdateRole(userID uint, role string) error {
	return r.db.Model(&model.Users{}).
		Where("id = ?", userID).
		Update("role", role).Error
}

func (r *UserRepository) UpdateActive(userID uint, active bool) error {
	return r.db.Model(&model.Users{}).
		Where("id = ?", userID).
		Update("active", active).Error
}

func (r *UserRepository) RevokeAllRefreshTokens(userID uint) error {
	now := time.Now()
	return r.db.Model(&model.RefreshToken{}).
		Where("user_id = ? AND revoked_at IS NULL", userID).
		Update("revoked_at", now).Error
}

func (r *UserRepository) SaveRefreshToken(userID uint, jti string, expiresAt time.Time) error {
	refreshToken := model.RefreshToken{
		UserID:    userID,
		JTI:       jti,
		ExpiresAt: expiresAt,
	}
	return r.db.Create(&refreshToken).Error
}

func (r *UserRepository) IsRefreshTokenActive(jti string) (bool, error) {
	var token model.RefreshToken
	err := r.db.Where("jti = ? AND revoked_at IS NULL", jti).First(&token).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return false, nil
		}
		return false, err
	}
	if time.Now().After(token.ExpiresAt) {
		return false, nil
	}
	return true, nil
}

func (r *UserRepository) RevokeRefreshToken(jti string) error {
	now := time.Now()
	return r.db.Model(&model.RefreshToken{}).
		Where("jti = ? AND revoked_at IS NULL", jti).
		Update("revoked_at", now).Error
}
