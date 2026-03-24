package service

import (
	"errors"
	"strings"

	"github.com/tony219y/pomo-smart-task-api/internal/middleware"
	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"github.com/tony219y/pomo-smart-task-api/internal/repository"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) Login(email, password string) (string, string, string) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return "", "", "Incorrect username or password"
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", "", "Incorrect username or password"
	}
	return s.issueSession(user)
}

func (s *UserService) issueSession(user *model.Users) (string, string, string) {
	accessToken, refreshToken, refreshJTI, refreshExpiresAt, err := middleware.GenerateTokens(user.ID, user.Role)
	if err != nil {
		return "", "", "Generated token failed!"
	}
	if err := s.repo.SaveRefreshToken(user.ID, refreshJTI, refreshExpiresAt); err != nil {
		return "", "", "Generated token failed!"
	}
	return accessToken, refreshToken, ""
}

func (s *UserService) Register(email, username, password string) (*model.Users, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	newUser := &model.Users{
		Username: username,
		Email:    email,
		Password: string(hash),
	}

	if err := s.repo.CreateUser(newUser); err != nil {
		return nil, err
	}

	return newUser, nil
}

func (s *UserService) LoginWithGoogle(email string) (string, string, string) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return "", "", "Google login failed"
		}

		generatedPassword, hashErr := bcrypt.GenerateFromPassword([]byte(email), bcrypt.DefaultCost)
		if hashErr != nil {
			return "", "", "Google login failed"
		}

		username := strings.TrimSpace(strings.Split(email, "@")[0])
		if username == "" {
			username = "google-user"
		}

		newUser := &model.Users{
			Email:    email,
			Username: username,
			Password: string(generatedPassword),
			Role:     "member",
		}

		if createErr := s.repo.CreateUser(newUser); createErr != nil {
			return "", "", "Google login failed"
		}

		user = newUser
	}

	return s.issueSession(user)
}

func (s *UserService) GetAllUser() ([]model.UserResponse, error) {
	return s.repo.FindAll()
}
func (s *UserService) GetUserByID(userId uint) (*model.UserResponse, error) {
	user, err := s.repo.GetUserByID(userId)
	return user, err
}

func (s *UserService) RefreshSession(token string) (string, string, error) {
	claims, err := middleware.ParseRefreshToken(token)
	if err != nil {
		return "", "", err
	}

	active, err := s.repo.IsRefreshTokenActive(claims.JTI)
	if err != nil {
		return "", "", err
	}
	if !active {
		return "", "", errors.New("refresh token revoked")
	}

	if err := s.repo.RevokeRefreshToken(claims.JTI); err != nil {
		return "", "", err
	}

	newAccess, newRefresh, newJTI, newExpiresAt, err := middleware.GenerateTokens(claims.UserID, claims.Role)
	if err != nil {
		return "", "", err
	}
	if err := s.repo.SaveRefreshToken(claims.UserID, newJTI, newExpiresAt); err != nil {
		return "", "", err
	}

	return newAccess, newRefresh, nil
}

func (s *UserService) RevokeSession(token string) error {
	claims, err := middleware.ParseRefreshToken(token)
	if err != nil {
		return nil
	}
	return s.repo.RevokeRefreshToken(claims.JTI)
}
