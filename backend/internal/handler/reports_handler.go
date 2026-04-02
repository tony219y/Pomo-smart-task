package handler

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/response"
	"github.com/tony219y/pomo-smart-task-api/internal/service"
)

type ReportHandler struct {
	service *service.ReportService
}

func NewReportHandler(service *service.ReportService) *ReportHandler {
	return &ReportHandler{service: service}
}

func (h *ReportHandler) GetSummary(c fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uint)
	if !ok {
		return response.Error(c, fiber.StatusUnauthorized, "unauthorized: invalid user id type")
	}

	summary, err := h.service.GetSummary(userID)
	if err != nil {
		return response.Error(c, fiber.StatusInternalServerError, "get report summary failed")
	}

	return c.Status(fiber.StatusOK).JSON(summary)
}

func (h *ReportHandler) GetTeamSummary(c fiber.Ctx) error {
	summary, err := h.service.GetTeamSummary()
	if err != nil {
		return response.Error(c, fiber.StatusInternalServerError, "get team report summary failed")
	}

	return c.Status(fiber.StatusOK).JSON(summary)
}
