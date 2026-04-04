package config

import (
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	Port           string
	AllowedOrigins []string
}

func Load() AppConfig {
	_ = godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	frontendURL := os.Getenv("FRONTEND")
	origins := splitCSV(os.Getenv("CORS_ALLOWED_ORIGINS"))
	if len(origins) == 0 {
		origins = []string{"https://localhost:3000", frontendURL}
	}

	return AppConfig{
		Port:           port,
		AllowedOrigins: origins,
	}
}

func splitCSV(input string) []string {
	if input == "" {
		return nil
	}

	parts := strings.Split(input, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}

	return result
}
