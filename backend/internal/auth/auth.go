package auth

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"

	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func ConfigGoogle() *oauth2.Config {
	conf := &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
		},
		Endpoint: google.Endpoint,
	}

	return conf
}

func GetEmail(token string) (string, error) {
	req, err := http.NewRequest(http.MethodGet, "https://www.googleapis.com/oauth2/v1/userinfo", nil)
	if err != nil {
		return "", err
	}

	req.Header.Set("Authorization", "Bearer "+token)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return "", errors.New("failed to load google user info")
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	var data model.GoogleResponse
	if err := json.Unmarshal(body, &data); err != nil {
		return "", err
	}

	if data.Email == "" {
		return "", errors.New("google account email not found")
	}

	return data.Email, nil
}
