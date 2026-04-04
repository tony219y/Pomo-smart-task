package middleware

import (
	"errors"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/tony219y/pomo-smart-task-api/internal/response"
)

func init() {
	_ = godotenv.Load()
}

type RefreshClaims struct {
	UserID    uint
	Role      string
	JTI       string
	ExpiresAt time.Time
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
	}, jwt.WithValidMethods([]string{"HS256"}))
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
	tokenType, ok := claims["type"].(string)
	if !ok || tokenType != "access" {
		return response.Error(c, fiber.StatusUnauthorized, "invalid token type")
	}
	c.Locals("role", roleRaw)

	return c.Next()
}

func GenerateTokens(id uint, role string) (string, string, string, time.Time, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	now := time.Now()
	refreshJTI := uuid.NewString()
	refreshExpiresAt := now.Add(30 * 24 * time.Hour)

	accessClaims := jwt.MapClaims{
		"user_id": id,
		"role":    role,
		"type":    "access",
		"exp":     now.Add(15 * time.Minute).Unix(),
		"iat":     now.Unix(),
	}

	refreshClaims := jwt.MapClaims{
		"user_id": id,
		"type":    "refresh",
		"role":    role,
		"jti":     refreshJTI,
		"exp":     refreshExpiresAt.Unix(),
		"iat":     now.Unix(),
	}
	accessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims).SignedString([]byte(jwtSecret))
	if err != nil {
		return "", "", "", time.Time{}, err
	}

	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString([]byte(jwtSecret))
	if err != nil {
		return "", "", "", time.Time{}, err
	}

	return accessToken, refreshToken, refreshJTI, refreshExpiresAt, nil
}

func ParseRefreshToken(tokenString string) (*RefreshClaims, error) {
	jwtSecret := os.Getenv("JWT_SECRET")

	parsed, err := jwt.Parse(tokenString, func(t *jwt.Token) (any, error) {
		return []byte(jwtSecret), nil
	}, jwt.WithValidMethods([]string{"HS256"}))
	if err != nil || !parsed.Valid {
		return nil, errors.New("invalid refresh token")
	}

	claims, ok := parsed.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("invalid refresh token claims")
	}
	tokenType, ok := claims["type"].(string)
	if !ok || tokenType != "refresh" {
		return nil, errors.New("invalid token type")
	}
	userIDRaw, ok := claims["user_id"].(float64)
	if !ok {
		return nil, errors.New("invalid refresh token claims")
	}
	role, ok := claims["role"].(string)
	if !ok {
		return nil, errors.New("invalid refresh token claims")
	}
	jti, ok := claims["jti"].(string)
	if !ok || jti == "" {
		return nil, errors.New("invalid refresh token claims")
	}
	expRaw, ok := claims["exp"].(float64)
	if !ok {
		return nil, errors.New("invalid refresh token claims")
	}

	return &RefreshClaims{
		UserID:    uint(userIDRaw),
		Role:      role,
		JTI:       jti,
		ExpiresAt: time.Unix(int64(expRaw), 0),
	}, nil
}

func GenerateAccessToken(userID uint, role string) (string, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	now := time.Now()

	accessClaims := jwt.MapClaims{
		"user_id": userID,
		"role":    role,
		"type":    "access",
		"exp":     now.Add(15 * time.Minute).Unix(),
		"iat":     now.Unix(),
	}

	accessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims).SignedString([]byte(jwtSecret))
	if err != nil {
		return "", err
	}

	return accessToken, nil
}
