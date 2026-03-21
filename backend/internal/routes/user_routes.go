package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
)

func registerUserRoutes(protected fiber.Router, userHandler *handler.UserHandler) {
	users := protected.Group("/users")
	users.Get("/", userHandler.GetAllUser)
	users.Get("/me", userHandler.Me)
}
