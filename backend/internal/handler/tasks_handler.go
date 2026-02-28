package handler

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"github.com/tony219y/pomo-smart-task-api/internal/service"
)

type TaskHandler struct {
	service *service.TaskService
}

func NewTaskHandler(service *service.TaskService) *TaskHandler {
	return &TaskHandler{service: service}
}

func (h *TaskHandler) Create(c fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uint)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized: Invalid User ID type"})
	}

	req := new(model.Task)
	if err := c.Bind().Body(req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}
	_, err := h.service.CreateTask(req, userID)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Create task failed"})
	}

	return c.Status(201).JSON(fiber.Map{"message": "Create task successfully!"})

}

func (h *TaskHandler) FindAll(c fiber.Ctx) error {
	return nil
}
