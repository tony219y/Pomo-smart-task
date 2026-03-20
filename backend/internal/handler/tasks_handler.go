package handler

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/dto"
	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"github.com/tony219y/pomo-smart-task-api/internal/response"
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
		return response.Error(c, fiber.StatusUnauthorized, "unauthorized: invalid user id type")
	}

	req := new(dto.CreateTaskRequest)
	if err := c.Bind().Body(req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid request body")
	}

	task := &model.Task{
		Title:         req.Title,
		Description:   req.Description,
		Status:        req.Status,
		Priority:      req.Priority,
		DueDate:       req.DueDate,
		EstimatedTime: req.EstimatedTime,
	}

	_, err := h.service.CreateTask(task, userID)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "create task failed")
	}

	return response.Message(c, fiber.StatusCreated, "create task successfully")
}

func (h *TaskHandler) FindAll(c fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uint)
	if !ok {
		return response.Error(c, fiber.StatusUnauthorized, "unauthorized: invalid user id type")
	}

	tasks, err := h.service.FindAll(userID)
	if err != nil {
		return response.Error(c, fiber.StatusInternalServerError, "get tasks failed")
	}

	return c.Status(fiber.StatusOK).JSON(tasks)
}
