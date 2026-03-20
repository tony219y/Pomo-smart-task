package service

import (
	"github.com/tony219y/pomo-smart-task-api/internal/middleware"
	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"github.com/tony219y/pomo-smart-task-api/internal/repository"
	"golang.org/x/crypto/bcrypt"
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
	accessToken, refreshToken, err := middleware.GenerateToken(user.ID, user.Role)
	if err != nil {
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

func (s *UserService) GetAllUser() ([]model.UserResponse, error) {
	return s.repo.FindAll()
}
func (s *UserService) GetUserByID(userId uint) (*model.UserResponse, error) {
	user, err := s.repo.GetUserByID(userId)
	return user, err
}

func (s *UserService) RefreshSession(token string) string {
	return middleware.RefreshToken(token)
}
