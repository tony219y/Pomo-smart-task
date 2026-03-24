package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
)

func registerReportRoutes(protected fiber.Router, reportHandler *handler.ReportHandler) {
	reports := protected.Group("/reports")
	reports.Get("/summary", reportHandler.GetSummary)
}
