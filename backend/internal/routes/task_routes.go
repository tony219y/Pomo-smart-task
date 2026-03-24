package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
	"github.com/tony219y/pomo-smart-task-api/internal/middleware"
	"github.com/tony219y/pomo-smart-task-api/internal/permission"
)

func registerTaskRoutes(protected fiber.Router, taskHandler *handler.TaskHandler) {
	tasks := protected.Group("/tasks")
	tasks.Get("/", middleware.RequirePermission(permission.TaskReadOwn), taskHandler.FindAll)
	tasks.Get("/:id", middleware.RequirePermission(permission.TaskReadOwn), taskHandler.FindByID)
	tasks.Post("/", middleware.RequirePermission(permission.TaskWriteOwn), taskHandler.Create)
	tasks.Patch("/:id", middleware.RequirePermission(permission.TaskWriteOwn), taskHandler.Update)
	tasks.Delete("/:id", middleware.RequirePermission(permission.TaskWriteOwn), taskHandler.Delete)
}
