package main

import (
	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/handler"
)

func main() {
	app := fiber.New()

	api := app.Group("/api/v1")
	api.Get("/test", handler.GetTest)

	app.Listen(":3000")
}
