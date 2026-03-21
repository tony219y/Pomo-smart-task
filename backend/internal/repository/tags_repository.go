package repository

import (
	"errors"

	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"gorm.io/gorm"
)

type TagRepository struct {
	db *gorm.DB
}

func NewTagRepository(db *gorm.DB) *TagRepository {
	return &TagRepository{db: db}
}

func (r *TagRepository) GetTagsByUserID(userID uint) ([]model.TagResponse, error) {
	var results []model.TagResponse

	err := r.db.Model(&model.Tags{}).
		Select("id", "name").
		Where("user_id = ?", userID).
		Find(&results).Error
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (r *TagRepository) CreateNewTag(userID uint, name string) error {

	var count int64
	r.db.Model(&model.Tags{}).
		Where("user_id = ? AND name = ?", userID, name).
		Count(&count)
	if count > 0 {
		return errors.New("Tag already exists")
	}

	newTag := model.Tags{
		UserID: userID,
		Name:   name,
	}

	return r.db.Create(&newTag).Error
}

func (r *TagRepository) DeleteTag(userID uint, tagID uint) error {
	result := r.db.Model(&model.Tags{}).
		Where("user_id = ? AND id = ?", userID, tagID).
		Delete(model.Tags{}).Error
	if result != nil {
		return result
	}
	return nil
}
