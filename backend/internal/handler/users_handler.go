package handler

import (
	"log"
	"net/url"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/tony219y/pomo-smart-task-api/internal/auth"
	"github.com/tony219y/pomo-smart-task-api/internal/dto"
	"github.com/tony219y/pomo-smart-task-api/internal/response"
	"github.com/tony219y/pomo-smart-task-api/internal/service"
	"golang.org/x/oauth2"
)

type UserHandler struct {
	service         *service.UserService
	auditLogService *service.AuditLogService
}

func buildRefreshTokenCookie(value string, expires time.Time) *fiber.Cookie {
	isProduction := os.Getenv("APP_ENV") == "production"

	log.Println("Is production:", isProduction)
	sameSite := "Lax"

	if isProduction {
		sameSite = "None"
	}

	return &fiber.Cookie{
		Name:     "refresh_token",
		Value:    value,
		Expires:  expires,
		HTTPOnly: true,
		SameSite: sameSite,
		Secure:   isProduction,
		Path:     "/",
	}
}

func NewUserHandler(service *service.UserService, auditLogService *service.AuditLogService) *UserHandler {
	return &UserHandler{
		service:         service,
		auditLogService: auditLogService,
	}
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

	user, accessToken, refreshToken, errMsg := h.service.Login(req.Email, req.Password)
	if errMsg != "" {
		return response.Error(c, fiber.StatusBadRequest, errMsg)
	}

	c.Cookie(buildRefreshTokenCookie(refreshToken, time.Now().Add(30*24*time.Hour)))

	_ = h.auditLogService.Create(dto.CreateAuditLogInput{
		ActorID:    user.ID,
		Action:     "auth.login",
		EntityType: "user",
		EntityID:   &user.ID,
		Metadata:   "user login success",
		IPAddress:  c.IP(),
		UserAgent:  c.Get("User-Agent"),
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

func (h *UserHandler) UpdateRole(c fiber.Ctx) error {
	actorID := c.Locals("user_id").(uint)

	targetID, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid user id")
	}

	req := new(dto.UpdateUserRoleRequest)
	if err := c.Bind().Body(req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid request body")
	}

	if err := h.service.UpdateUserRole(actorID, uint(targetID), req.Role); err != nil {
		return response.Error(c, fiber.StatusBadRequest, err.Error())
	}

	targetUserID := uint(targetID)
	_ = h.auditLogService.Create(dto.CreateAuditLogInput{
		ActorID:    actorID,
		Action:     "user.role_update",
		EntityType: "user",
		EntityID:   &targetUserID,
		Metadata:   "updated user role to " + req.Role,
		IPAddress:  c.IP(),
		UserAgent:  c.Get("User-Agent"),
	})

	return response.Message(c, fiber.StatusOK, "user role updated")
}

func (h *UserHandler) UpdateActiveStatus(c fiber.Ctx) error {
	actorID := c.Locals("user_id").(uint)

	targetID, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid user id")
	}

	req := new(dto.DeactivateUserRequest)
	if err := c.Bind().Body(req); err != nil {
		return response.Error(c, fiber.StatusBadRequest, "invalid request body")
	}

	if err := h.service.DeactivateUser(actorID, uint(targetID), req.Active); err != nil {
		return response.Error(c, fiber.StatusBadRequest, err.Error())
	}

	targetUserID := uint(targetID)
	action := "user.activate"
	metadata := "activated user account"
	if !req.Active {
		action = "user.deactivate"
		metadata = "deactivated user account"
	}

	_ = h.auditLogService.Create(dto.CreateAuditLogInput{
		ActorID:    actorID,
		Action:     action,
		EntityType: "user",
		EntityID:   &targetUserID,
		Metadata:   metadata,
		IPAddress:  c.IP(),
		UserAgent:  c.Get("User-Agent"),
	})

	return response.Message(c, fiber.StatusOK, "user status updated")
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

	c.Cookie(buildRefreshTokenCookie(newRefreshToken, time.Now().Add(30*24*time.Hour)))

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
	userID := c.Locals("user_id").(uint)
	refreshToken := c.Cookies("refresh_token")
	if refreshToken != "" {
		_ = h.service.RevokeSession(refreshToken)
	}

	c.Cookie(buildRefreshTokenCookie("", time.Now().Add(-time.Hour)))

	_ = h.auditLogService.Create(dto.CreateAuditLogInput{
		ActorID:    userID,
		Action:     "auth.logout",
		EntityType: "user",
		EntityID:   &userID,
		Metadata:   "user logout success",
		IPAddress:  c.IP(),
		UserAgent:  c.Get("User-Agent"),
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

	c.Cookie(buildRefreshTokenCookie(refreshToken, time.Now().Add(30*24*time.Hour)))

	frontendURL := os.Getenv("FRONTEND")
	if frontendURL == "" {
		frontendURL = "https://localhost:3000"
	}

	redirectURL := frontendURL + "/google/callback?accessToken=" + url.QueryEscape(accessToken)
	return c.Redirect().To(redirectURL)
}
