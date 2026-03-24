package handler

import (
	"net/url"
	"os"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/auth"
	"github.com/tony219y/pomo-smart-task-api/internal/dto"
	"github.com/tony219y/pomo-smart-task-api/internal/response"
	"github.com/tony219y/pomo-smart-task-api/internal/service"
	"golang.org/x/oauth2"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(service *service.UserService) *UserHandler {
	return &UserHandler{service: service}
}

func (h *UserHandler) CreateUser(c fiber.Ctx) error {
	req := new(dto.RegisterRequest)
	if err := c.Bind().Body(req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid request body")
	}

	_, err := h.service.Register(req.Email, req.Username, req.Password)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, err.Error())
	}

	return response.Message(c, fiber.StatusCreated, "create user successfully")
}

func (h *UserHandler) UserLogin(c fiber.Ctx) error {
	req := new(dto.LoginRequest)
	if err := c.Bind().Body(req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid request body")
	}

	accessToken, refreshToken, errMsg := h.service.Login(req.Email, req.Password)
	if errMsg != "" {
		return response.Error(c, fiber.StatusBadRequest, errMsg)
	}

	secureCookie := os.Getenv("APP_ENV") == "production"
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Expires:  time.Now().Add(30 * 24 * time.Hour),
		HTTPOnly: true,
		SameSite: "Lax",
		Secure:   secureCookie,
		Path:     "/",
	})

	return c.Status(fiber.StatusOK).JSON(dto.LoginResponse{
		AccessToken: accessToken,
	})
}

func (h *UserHandler) GetAllUser(c fiber.Ctx) error {
	users, err := h.service.GetAllUser()
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, err.Error())
	}
	return c.JSON(users)
}

func (h *UserHandler) RefreshToken(c fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return response.Error(c, fiber.StatusUnauthorized, "missing refresh token")
	}

	accessToken, newRefreshToken, err := h.service.RefreshSession(refreshToken)
	if err != nil {
		return response.Error(c, fiber.StatusUnauthorized, "invalid refresh token")
	}

	secureCookie := os.Getenv("APP_ENV") == "production"
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    newRefreshToken,
		Expires:  time.Now().Add(30 * 24 * time.Hour),
		HTTPOnly: true,
		SameSite: "Lax",
		Secure:   secureCookie,
		Path:     "/",
	})

	return c.Status(fiber.StatusOK).JSON(dto.RefreshResponse{
		AccessToken: accessToken,
	})
}
func (h *UserHandler) Me(c fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	user, err := h.service.GetUserByID(userID)
	if err != nil {
		return response.Error(c, fiber.StatusNotFound, "user not found")
	}

	return c.JSON(user)
}
func (h *UserHandler) Logout(c fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	if refreshToken != "" {
		_ = h.service.RevokeSession(refreshToken)
	}

	secureCookie := os.Getenv("APP_ENV") == "production"
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
		SameSite: "Lax",
		Secure:   secureCookie,
		Path:     "/",
	})
	return response.Message(c, 200, "Logged out")
}

func (h *UserHandler) GoogleAuth(c fiber.Ctx) error {
	path := auth.ConfigGoogle()
	url := path.AuthCodeURL("state", oauth2.SetAuthURLParam("prompt", "select_account"))

	return c.Redirect().To(url)
}

func (h *UserHandler) Callback(c fiber.Ctx) error {
	code := c.Query("code")
	if code == "" {
		return response.Error(c, fiber.StatusBadRequest, "missing google authorization code")
	}

	token, err := auth.ConfigGoogle().Exchange(c.RequestCtx(), code)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "failed to exchange google token")
	}

	email := auth.GetEmail(token.AccessToken)
	accessToken, refreshToken, errMsg := h.service.LoginWithGoogle(email)
	if errMsg != "" {
		return response.Error(c, fiber.StatusBadRequest, errMsg)
	}

	secureCookie := os.Getenv("APP_ENV") == "production"
	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Expires:  time.Now().Add(30 * 24 * time.Hour),
		HTTPOnly: true,
		SameSite: "Lax",
		Secure:   secureCookie,
		Path:     "/",
	})

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	redirectURL := frontendURL + "/google/callback?accessToken=" + url.QueryEscape(accessToken)
	return c.Redirect().To(redirectURL)
}
