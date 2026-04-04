package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/response"
)

func RequireHTTPS(appEnv string) fiber.Handler {
	return func(c fiber.Ctx) error {
		if appEnv != "production" {
			return c.Next()
		}

		protocol := strings.ToLower(strings.TrimSpace(c.Get("X-Forwarded-Proto")))
		if protocol == "" {
			protocol = strings.ToLower(c.Protocol())
		}

		if protocol != "https" {
			return response.Error(c, fiber.StatusUpgradeRequired, "https is required")
		}

		return c.Next()
	}
}
