package handler

import (
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/dto"
	"github.com/tony219y/pomo-smart-task-api/internal/response"
	"github.com/tony219y/pomo-smart-task-api/internal/service"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(service *service.UserService) *UserHandler {
	return &UserHandler{service: service}
}

func (h *UserHandler) CreateUser(c fiber.Ctx) error {
	req := new(dto.RegisterRequest)
	if err := c.Bind().Body(req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid request body")
	}

	_, err := h.service.Register(req.Email, req.Username, req.Password)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, err.Error())
	}

	return response.Message(c, fiber.StatusCreated, "create user successfully")
}

func (h *UserHandler) UserLogin(c fiber.Ctx) error {
	req := new(dto.LoginRequest)
	if err := c.Bind().Body(req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid request body")
	}

	accessToken, refreshToken, errMsg := h.service.Login(req.Email, req.Password)
	if errMsg != "" {
		return response.Error(c, fiber.StatusBadRequest, errMsg)
	}

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Expires:  time.Now().Add(30 * 24 * time.Hour),
		HTTPOnly: true,
		SameSite: "Lax",
		Secure:   false,
		Path:     "/",
	})

	return c.Status(fiber.StatusOK).JSON(dto.LoginResponse{
		AccessToken: accessToken,
	})
}

func (h *UserHandler) GetAllUser(c fiber.Ctx) error {
	roleRaw := c.Locals("role")
	if roleRaw == nil {
		return response.Error(c, fiber.StatusUnauthorized, "login required")
	}

	role, ok := roleRaw.(string)
	if !ok || role != "admin" {
		return response.Error(c, fiber.StatusForbidden, "access denied")
	}

	users, err := h.service.GetAllUser()
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, err.Error())
	}
	return c.JSON(users)
}

func (h *UserHandler) RefreshToken(c fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return response.Error(c, fiber.StatusUnauthorized, "missing refresh token")
	}

	accessToken, err := h.service.RefreshSession(refreshToken)
	if err != nil {
		return response.Error(c, fiber.StatusUnauthorized, "invalid refresh token")
	}

	return c.Status(fiber.StatusOK).JSON(dto.RefreshResponse{
		AccessToken: accessToken,
	})
}
func (h *UserHandler) Profile(c fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	user, _ := h.service.GetUserByID(userID)

	return c.JSON(user)
}
func (h *UserHandler) Logout(c fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
		SameSite: "Lax",
		Secure:   false,
		Path:     "/",
	})
	return response.Message(c, 200, "Logged out")
}
