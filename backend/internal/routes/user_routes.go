package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
	"github.com/tony219y/pomo-smart-task-api/internal/middleware"
	"github.com/tony219y/pomo-smart-task-api/internal/permission"
)

func registerUserRoutes(protected fiber.Router, userHandler *handler.UserHandler) {
	users := protected.Group("/users")
	users.Get("/", middleware.RequirePermission(permission.UserReadAll), userHandler.GetAllUser)
	users.Get("/me", userHandler.Me)
}
