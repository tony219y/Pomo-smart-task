package middleware

import (
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"github.com/tony219y/pomo-smart-task-api/internal/response"
)

func init() {
	_ = godotenv.Load()
}

func JWTMiddleware(c fiber.Ctx) error {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return response.Error(c, fiber.StatusInternalServerError, "server configuration error")
	}

	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return response.Error(c, fiber.StatusUnauthorized, "missing token")
	}

	const bearerPrefix = "Bearer "
	if !strings.HasPrefix(authHeader, bearerPrefix) {
		return response.Error(c, fiber.StatusUnauthorized, "invalid authorization header")
	}

	tokenString := strings.TrimSpace(strings.TrimPrefix(authHeader, bearerPrefix))
	if tokenString == "" {
		return response.Error(c, fiber.StatusUnauthorized, "missing token")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})
	if err != nil || !token.Valid {
		return response.Error(c, fiber.StatusUnauthorized, "invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return response.Error(c, fiber.StatusUnauthorized, "invalid token claims")
	}

	userIDRaw, ok := claims["user_id"].(float64)
	if !ok {
		return response.Error(c, fiber.StatusUnauthorized, "invalid token claims")
	}
	c.Locals("user_id", uint(userIDRaw))

	roleRaw, ok := claims["role"].(string)
	if !ok {
		return response.Error(c, fiber.StatusUnauthorized, "invalid token claims")
	}
	c.Locals("role", roleRaw)

	return c.Next()
}

func GenerateToken(id uint, role string) (string, error) {
	jwtSecret := os.Getenv("JWT_SECRET")

	claims := jwt.MapClaims{
		"user_id": id,
		"role":    role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
		"iat":     time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	t, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", err
	}

	return t, nil
}
