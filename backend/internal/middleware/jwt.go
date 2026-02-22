package middleware

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

var JWT_SECRET = os.Getenv("JWT_SECRET")

func init() {
	godotenv.Load()
}

func JWTMiddleware(c fiber.Ctx) error {
	authHeader := c.Get("Authorization")

	if authHeader == "" {
		return c.Status(fiber.ErrBadRequest.Code).JSON(fiber.Map{
			"message": "Missing token",
		})
	}
	tokenString := authHeader[7:]
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		return []byte(JWT_SECRET), nil
	})

	if err != nil || !token.Valid {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
	}

	claims := token.Claims.(jwt.MapClaims)
	c.Locals("user_id", claims["user_id"])
	c.Locals("role", claims["role"])

	return c.Next()
}

func GenerateToken(id uint, role string) (string, error) {

	claims := jwt.MapClaims{
		"user_id": id,
		"role":    role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
		"iat":     time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	t, err := token.SignedString([]byte(JWT_SECRET))
	if err != nil {
		return "", err
	}

	return t, nil
}
