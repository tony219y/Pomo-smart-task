package repository

import "github.com/tony219y/pomo-smart-task-api/internal/model"

func FetctTestDB() []model.TestType {
	return []model.TestType{
		{
			ID:   1,
			Name: "Tony",
		},
		{
			ID:   2,
			Name: "John",
		},
	}
}
