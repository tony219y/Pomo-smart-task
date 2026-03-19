package handler

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/model"
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
	req := new(model.RegisterReq)
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
	req := new(model.LoginReq)
	if err := c.Bind().Body(req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid request body")
	}

	token, errMsg := h.service.Login(req.Email, req.Password)
	if errMsg != "" {
		return response.Error(c, fiber.StatusBadRequest, errMsg)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"token": token})
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
