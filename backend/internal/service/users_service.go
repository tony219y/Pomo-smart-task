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

func (s *UserService) Login(email, password string) (*model.Users, string, string, string) {
	email = normalizeEmail(email)
	if len([]byte(password)) > MaxPasswordBytes {
		return nil, "", "", "Incorrect username or password"
	}

	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return nil, "", "", "Incorrect username or password"
	}
	if !user.Active {
		return nil, "", "", "Incorrect username or password"
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, "", "", "Incorrect username or password"
	}

	accessToken, refreshToken, _ := s.issueSession(user)

	return user, accessToken, refreshToken, ""
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
	email = normalizeEmail(email)
	username = strings.TrimSpace(username)

	if username == "" {
		return nil, errors.New("username is required")
	}
	if len(username) < 3 {
		return nil, errors.New("username must be at least 3 characters")
	}
	if err := ValidatePassword(password); err != nil {
		return nil, err
	}

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
	email = normalizeEmail(email)

	user, err := s.repo.FindByEmail(email)
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return "", "", "Google login failed"
		}

		randomSecret, randomErr := GenerateRandomSecret()
		if randomErr != nil {
			return "", "", "Google login failed"
		}

		generatedPassword, hashErr := bcrypt.GenerateFromPassword([]byte(randomSecret), bcrypt.DefaultCost)
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

	if !user.Active {
		return "", "", "Google login failed"
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

func (s *UserService) UpdateUserRole(actorID uint, targetUserID uint, role string) error {
	if actorID == targetUserID {
		return errors.New("you cannot change your own role")
	}

	if role != "member" && role != "staff" && role != "admin" {
		return errors.New("invalid role")
	}

	_, err := s.repo.FindUserByID(targetUserID)
	if err != nil {
		return err
	}

	return s.repo.UpdateRole(targetUserID, role)
}

func (s *UserService) DeactivateUser(actorID uint, targetUserID uint, active bool) error {
	if actorID == targetUserID {
		return errors.New("you cannot change your own active status")
	}

	_, err := s.repo.FindUserByID(targetUserID)
	if err != nil {
		return err
	}

	if err := s.repo.UpdateActive(targetUserID, active); err != nil {
		return err
	}

	if !active {
		return s.repo.RevokeAllRefreshTokens(targetUserID)
	}

	return nil
}
