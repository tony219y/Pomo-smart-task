package handler

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/service"
)

type TestHandler struct {
	service *service.TestService
}

func NewTestHandler(s *service.TestService) *TestHandler {
	return &TestHandler{service: s}
}

func (h *TestHandler) GetTest(c fiber.Ctx) error {
	test, err := h.service.GetTest()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": test,
	})
}
