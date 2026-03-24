package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
	"github.com/tony219y/pomo-smart-task-api/internal/middleware"
)

type Handlers struct {
	User   *handler.UserHandler
	Tag    *handler.TagHandler
	Task   *handler.TaskHandler
	Report *handler.ReportHandler
	Admin  *handler.AdminHandler
}

func Register(app *fiber.App, handlers Handlers) {
	v1 := app.Group("/api/v1")

	registerAuthRoutes(v1, handlers.User)

	protected := v1.Group("/", middleware.JWTMiddleware)
	registerUserRoutes(protected, handlers.User)
	registerTagRoutes(protected, handlers.Tag)
	registerTaskRoutes(protected, handlers.Task)
	registerReportRoutes(protected, handlers.Report)
	registerAdminRoutes(protected, handlers.Admin)
}
