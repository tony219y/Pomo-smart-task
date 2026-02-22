package handler

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/model"
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
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	_, err := h.service.Register(req.Email, req.Username, req.Password)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(201).JSON(fiber.Map{"message": "create user successfully!"})
}

func (h *UserHandler) UserLogin(c fiber.Ctx) error {

	req := new(model.LoginReq)
	if err := c.Bind().Body(req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	token, err := h.service.Login(req.Email, req.Password)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(200).JSON(fiber.Map{
		"token": token,
	})
}

func (h *UserHandler) GetAllUser(c fiber.Ctx) error {

	roleRaw := c.Locals("role")

	if roleRaw == nil {
		return c.Status(401).JSON(fiber.Map{"message": "Login required"})
	}

	role, ok := roleRaw.(string)
	if !ok || role != "admin" {
		return c.Status(403).JSON(fiber.Map{"message": "Access denied"})
	}
	users, err := h.service.GetAllUser()
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": err.Error()})
	}
	return c.JSON(users)
}
