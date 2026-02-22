package main

import (
	"github.com/gofiber/fiber/v3"
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

	userRepo := repository.NewUserRepository(database)
	userService := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userService)

	auth := app.Group("/api/v1/auth")
	auth.Post("/register", userHandler.CreateUser)
	auth.Get("/login", userHandler.UserLogin)

	api := app.Group("/api/v1", middleware.JWTMiddleware)
	//Users
	api.Get("/user", userHandler.GetAllUser)

	app.Listen(":8080")
}
