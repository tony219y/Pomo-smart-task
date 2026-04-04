package service

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"strings"
	"unicode/utf8"
)

const (
	MinPasswordLength = 15
	MaxPasswordBytes  = 72
)

var blockedPasswords = map[string]struct{}{
	"123456":        {},
	"12345678":      {},
	"123456789":     {},
	"1234567890":    {},
	"12345678910":   {},
	"111111":        {},
	"abc123":        {},
	"admin":         {},
	"administrator": {},
	"football":      {},
	"iloveyou":      {},
	"letmein":       {},
	"login":         {},
	"monkey":        {},
	"password":      {},
	"password1":     {},
	"password123":   {},
	"p@ssw0rd":      {},
	"passw0rd":      {},
	"qwerty":        {},
	"qwerty123":     {},
	"secret":        {},
	"superman":      {},
	"welcome":       {},
	"welcome123":    {},
}

func ValidatePassword(password string) error {
	length := utf8.RuneCountInString(password)
	if length < MinPasswordLength {
		return errors.New("password must be at least 15 characters")
	}

	if len([]byte(password)) > MaxPasswordBytes {
		return errors.New("password must be 72 bytes or fewer")
	}

	if isBlockedPassword(password) {
		return errors.New("password is too common, please choose a stronger password")
	}

	return nil
}

func isBlockedPassword(password string) bool {
	normalized := strings.ToLower(password)
	if _, exists := blockedPasswords[normalized]; exists {
		return true
	}

	trimmed := strings.ToLower(strings.TrimSpace(password))
	_, exists := blockedPasswords[trimmed]
	return exists
}

func normalizeEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}

func GenerateRandomSecret() (string, error) {
	buf := make([]byte, 32)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}

	return base64.RawURLEncoding.EncodeToString(buf), nil
}
