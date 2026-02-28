package main

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/tony219y/pomo-smart-task-api/config/db"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
	"github.com/tony219y/pomo-smart-task-api/internal/middleware"
	"github.com/tony219y/pomo-smart-task-api/internal/repository"
	"github.com/tony219y/pomo-smart-task-api/internal/service"
)

func main() {
	app := fiber.New()

	// connect to database
	database := db.ConnectNeon()
	db.Migration(database)

	app.Use(cors.New())

	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept"},
	}))

	//Users Regsiter
	userRepo := repository.NewUserRepository(database)
	userService := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userService)

	// Tags Register
	tagRepo := repository.NewTagRepository(database)
	tagService := service.NewTagsService(tagRepo)
	tagHandler := handler.NewTagHandler(tagService)

	// Tasks Register
	taskRepo := repository.NewTaskRepository(database)
	taskService := service.NewTaskService(taskRepo)
	taskHandler := handler.NewTaskHandler(taskService)

	// Auth
	auth := app.Group("/api/v1/auth")
	auth.Post("/register", userHandler.CreateUser)
	auth.Post("/login", userHandler.UserLogin)

	api := app.Group("/api/v1", middleware.JWTMiddleware)
	//Users
	api.Get("/user", userHandler.GetAllUser)

	//Tags
	api.Get("/tags", tagHandler.GetTagsByUserID)

	// Tasks
	api.Get("/tasks", taskHandler.FindAll)
	api.Post("/tasks", taskHandler.Create)

	app.Listen(":8080")
}
