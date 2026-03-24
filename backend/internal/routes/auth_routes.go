package routes

import (
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/limiter"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
)

func registerAuthRoutes(v1 fiber.Router, userHandler *handler.UserHandler) {
	auth := v1.Group("/auth")
	auth.Post("/register", userHandler.CreateUser)
	auth.Post("/login", userHandler.UserLogin)
	auth.Post("/refresh", limiter.New(limiter.Config{
		Max:        10,
		Expiration: time.Minute,
		KeyGenerator: func(c fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "too many refresh attempts, please try again later",
			})
		},
	}), userHandler.RefreshToken)
	auth.Post("/logout", userHandler.Logout)

	auth.Get("/google", userHandler.GoogleAuth)
	auth.Get("/google/callback", userHandler.Callback)
}
