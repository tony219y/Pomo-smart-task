package middleware

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/permission"
	"github.com/tony219y/pomo-smart-task-api/internal/response"
)

func RequirePermission(required string) fiber.Handler {
	return func(c fiber.Ctx) error {
		roleValue := c.Locals("role")
		role, ok := roleValue.(string)
		if !ok || role == "" {
			return response.Error(c, fiber.StatusUnauthorized, "login required")
		}

		if !permission.HasPermission(role, required) {
			return response.Error(c, fiber.StatusForbidden, "access denied")
		}

		return c.Next()
	}
}
