package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
)

func registerTaskRoutes(protected fiber.Router, taskHandler *handler.TaskHandler) {
	tasks := protected.Group("/tasks")
	tasks.Get("/", taskHandler.FindAll)
	tasks.Post("/", taskHandler.Create)
}
