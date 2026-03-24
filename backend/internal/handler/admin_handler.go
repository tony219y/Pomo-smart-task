package handler

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/response"
	"github.com/tony219y/pomo-smart-task-api/internal/service"
)

type AdminHandler struct {
	service *service.AdminService
}

func NewAdminHandler(service *service.AdminService) *AdminHandler {
	return &AdminHandler{service: service}
}

func (h *AdminHandler) GetLogs(c fiber.Ctx) error {
	logs, err := h.service.GetLogs()
	if err != nil {
		return response.Error(c, fiber.StatusInternalServerError, "failed to load admin logs")
	}

	return c.Status(fiber.StatusOK).JSON(logs)
}

func (h *AdminHandler) GetReportSummary(c fiber.Ctx) error {
	summary, err := h.service.GetReportSummary()
	if err != nil {
		return response.Error(c, fiber.StatusInternalServerError, "failed to load admin report")
	}

	return c.Status(fiber.StatusOK).JSON(summary)
}
