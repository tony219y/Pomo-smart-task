package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/tony219y/pomo-smart-task-api/config/db"
	"github.com/tony219y/pomo-smart-task-api/internal/config"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
	"github.com/tony219y/pomo-smart-task-api/internal/middleware"
	"github.com/tony219y/pomo-smart-task-api/internal/repository"
	"github.com/tony219y/pomo-smart-task-api/internal/routes"
	"github.com/tony219y/pomo-smart-task-api/internal/service"
	"gorm.io/gorm"
)

func main() {
	cfg := config.Load()
	if err := config.ValidateSecurityConfig(); err != nil {
		log.Fatal(err)
	}
	app := fiber.New()
	app.Use(middleware.RequireHTTPS(os.Getenv("APP_ENV")))

	database := db.ConnectNeon()
	// db.Migration(database)

	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.AllowedOrigins,
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))
	log.Println("Allowed Origins: ", cfg.AllowedOrigins)
	routes.Register(app, buildHandlers(database))

	log.Printf("server listening on :%s", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}

func buildHandlers(database *gorm.DB) routes.Handlers {
	auditRepo := repository.NewAuditRepository(database)
	auditService := service.NewAuditService(auditRepo)

	userRepo := repository.NewUserRepository(database)
	userService := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userService, auditService)

	tagRepo := repository.NewTagRepository(database)
	tagService := service.NewTagsService(tagRepo)
	tagHandler := handler.NewTagHandler(tagService)

	taskRepo := repository.NewTaskRepository(database)
	taskService := service.NewTaskService(taskRepo)
	taskHandler := handler.NewTaskHandler(taskService, auditService)

	reportService := service.NewReportService(taskRepo, userRepo)
	reportHandler := handler.NewReportHandler(reportService)

	adminService := service.NewAdminService(userRepo, taskRepo, auditRepo)
	adminHandler := handler.NewAdminHandler(adminService)

	return routes.Handlers{
		User:   userHandler,
		Tag:    tagHandler,
		Task:   taskHandler,
		Report: reportHandler,
		Admin:  adminHandler,
	}
}
