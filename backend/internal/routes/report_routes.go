package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
	"github.com/tony219y/pomo-smart-task-api/internal/middleware"
	"github.com/tony219y/pomo-smart-task-api/internal/permission"
)

func registerReportRoutes(protected fiber.Router, reportHandler *handler.ReportHandler) {
	reports := protected.Group("/reports")
	reports.Get("/summary", middleware.RequirePermission(permission.ReportReadOwn), reportHandler.GetSummary)
	reports.Get("/team-summary", middleware.RequirePermission(permission.ReportReadTeam), reportHandler.GetTeamSummary)
}
