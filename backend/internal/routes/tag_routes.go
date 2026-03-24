package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
	"github.com/tony219y/pomo-smart-task-api/internal/middleware"
	"github.com/tony219y/pomo-smart-task-api/internal/permission"
)

func registerTagRoutes(protected fiber.Router, tagHandler *handler.TagHandler) {
	tags := protected.Group("/tags")
	tags.Get("/", middleware.RequirePermission(permission.TagReadOwn), tagHandler.GetTagsByUserID)
}
