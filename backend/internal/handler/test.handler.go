package handler

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/service"
)

func GetTest(c fiber.Ctx) error {
	test := service.GetTest()

	return c.JSON(fiber.Map{
		"success": true,
		"data":    test,
	})
}
