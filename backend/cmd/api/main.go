package main

import (
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/tony219y/pomo-smart-task-api/config/db"
	"github.com/tony219y/pomo-smart-task-api/internal/config"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
	"github.com/tony219y/pomo-smart-task-api/internal/repository"
	"github.com/tony219y/pomo-smart-task-api/internal/routes"
	"github.com/tony219y/pomo-smart-task-api/internal/service"
	"gorm.io/gorm"
)

func main() {
	cfg := config.Load()
	app := fiber.New()

	database := db.ConnectNeon()
	db.Migration(database)

	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.AllowedOrigins,
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	routes.Register(app, buildHandlers(database))

	log.Printf("server listening on :%s", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}

func buildHandlers(database *gorm.DB) routes.Handlers {
	userRepo := repository.NewUserRepository(database)
	userService := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userService)

	tagRepo := repository.NewTagRepository(database)
	tagService := service.NewTagsService(tagRepo)
	tagHandler := handler.NewTagHandler(tagService)

	taskRepo := repository.NewTaskRepository(database)
	taskService := service.NewTaskService(taskRepo)
	taskHandler := handler.NewTaskHandler(taskService)

	reportService := service.NewReportService(taskRepo)
	reportHandler := handler.NewReportHandler(reportService)

	return routes.Handlers{
		User:   userHandler,
		Tag:    tagHandler,
		Task:   taskHandler,
		Report: reportHandler,
	}
}
