package handler

import (
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/dto"
	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"github.com/tony219y/pomo-smart-task-api/internal/response"
	"github.com/tony219y/pomo-smart-task-api/internal/service"
)

type TaskHandler struct {
	service         *service.TaskService
	auditLogService *service.AuditLogService
}

func NewTaskHandler(service *service.TaskService, auditLogService *service.AuditLogService) *TaskHandler {
	return &TaskHandler{
		service:         service,
		auditLogService: auditLogService,
	}
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

	dueDate, err := parseDate(req.DueDate)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid due date")
	}

	task := &model.Task{
		Title:         req.Title,
		Description:   req.Description,
		Status:        req.Status,
		Priority:      req.Priority,
		DueDate:       dueDate,
		EstimatedTime: req.EstimatedTime,
	}

	taskCreated, err := h.service.CreateTask(task, userID, req.TagIDs)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "create task failed")
	}

	_ = h.auditLogService.Create(dto.CreateAuditLogInput{
		ActorID:    userID,
		Action:     "task.create",
		EntityType: "task",
		EntityID:   &taskCreated.ID,
		Metadata:   fmt.Sprintf("created task: %s", taskCreated.Title),
		IPAddress:  c.IP(),
		UserAgent:  c.Get("User-Agent"),
	})

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

func (h *TaskHandler) FindByID(c fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uint)
	if !ok {
		return response.Error(c, fiber.StatusUnauthorized, "unauthorized: invalid user id type")
	}

	taskID, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid task id")
	}

	task, err := h.service.FindByID(userID, uint(taskID))
	if err != nil {
		return response.Error(c, fiber.StatusNotFound, "task not found")
	}

	return c.Status(fiber.StatusOK).JSON(task)
}

func (h *TaskHandler) Update(c fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uint)
	if !ok {
		return response.Error(c, fiber.StatusUnauthorized, "unauthorized: invalid user id type")
	}

	taskID, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid task id")
	}

	req := new(dto.UpdateTaskRequest)
	if err := c.Bind().Body(req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid request body")
	}

	if req.DueDate != nil {
		parsedDate, err := parseDate(*req.DueDate)
		if err != nil {
			return response.Error(c, fiber.StatusBadRequest, "invalid due date")
		}
		normalized := parsedDate.Format(time.RFC3339)
		req.DueDate = &normalized
	}

	task, err := h.service.UpdateTask(userID, uint(taskID), req)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "update task failed")
	}

	action := "task.update"
	metadata := fmt.Sprintf("updated task: %s", task.Title)
	if req.Status != nil {
		action = "task.status_update"
		metadata = fmt.Sprintf("changed task status to %s", *req.Status)
	}

	_ = h.auditLogService.Create(dto.CreateAuditLogInput{
		ActorID:    userID,
		Action:     action,
		EntityType: "task",
		EntityID:   &task.ID,
		Metadata:   metadata,
		IPAddress:  c.IP(),
		UserAgent:  c.Get("User-Agent"),
	})

	return c.Status(fiber.StatusOK).JSON(task)
}

func (h *TaskHandler) Delete(c fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uint)
	if !ok {
		return response.Error(c, fiber.StatusUnauthorized, "unauthorized: invalid user id type")
	}

	taskID, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid task id")
	}

	if err := h.service.DeleteTask(userID, uint(taskID)); err != nil {
		return response.Error(c, fiber.StatusNotFound, "task not found")
	}

	deletedTaskID := uint(taskID)
	_ = h.auditLogService.Create(dto.CreateAuditLogInput{
		ActorID:    userID,
		Action:     "task.delete",
		EntityType: "task",
		EntityID:   &deletedTaskID,
		Metadata:   fmt.Sprintf("deleted task id %d", taskID),
		IPAddress:  c.IP(),
		UserAgent:  c.Get("User-Agent"),
	})

	return response.Message(c, fiber.StatusOK, "delete task successfully")
}

func parseDate(raw string) (time.Time, error) {
	if raw == "" {
		return time.Time{}, nil
	}

	if t, err := time.Parse(time.RFC3339, raw); err == nil {
		return t, nil
	}

	return time.Parse("2006-01-02", raw)
}
