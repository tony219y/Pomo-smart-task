package config

import (
	"errors"
	"os"
	"strings"
)

func ValidateSecurityConfig() error {
	if os.Getenv("APP_ENV") != "production" {
		return nil
	}

	jwtSecret := strings.TrimSpace(os.Getenv("JWT_SECRET"))
	if len(jwtSecret) < 32 {
		return errors.New("JWT_SECRET must be at least 32 characters in production")
	}

	frontendURL := strings.TrimSpace(os.Getenv("FRONTEND"))
	if frontendURL == "" || !strings.HasPrefix(frontendURL, "https://") {
		return errors.New("FRONTEND must use https:// in production")
	}

	googleRedirectURL := strings.TrimSpace(os.Getenv("GOOGLE_REDIRECT_URL"))
	if googleRedirectURL == "" || !strings.HasPrefix(googleRedirectURL, "https://") {
		return errors.New("GOOGLE_REDIRECT_URL must use https:// in production")
	}

	return nil
}
