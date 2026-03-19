package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
)

func registerAuthRoutes(v1 fiber.Router, userHandler *handler.UserHandler) {
	auth := v1.Group("/auth")
	auth.Post("/register", userHandler.CreateUser)
	auth.Post("/login", userHandler.UserLogin)
}
