package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
	"github.com/tony219y/pomo-smart-task-api/internal/middleware"
	"github.com/tony219y/pomo-smart-task-api/internal/permission"
)

func registerAdminRoutes(protected fiber.Router, adminHandler *handler.AdminHandler) {
	admin := protected.Group("/admin")

	admin.Get("/logs", middleware.RequirePermission(permission.AuditRead), adminHandler.GetLogs)
	admin.Get(
		"/reports",
		middleware.RequirePermission(permission.ReportReadAll),
		adminHandler.GetReportSummary,
	)
}
