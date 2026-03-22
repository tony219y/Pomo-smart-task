package repository

import (
	"github.com/tony219y/pomo-smart-task-api/internal/model"
	"gorm.io/gorm"
)

type TaskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) *TaskRepository {
	return &TaskRepository{db: db}
}

func (r *TaskRepository) FindAll(userID uint) ([]model.Task, error) {
	var tasks []model.Task

	err := r.db.
		Preload("Tags").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&tasks).Error
	if err != nil {
		return nil, err
	}

	return tasks, nil
}

func (r *TaskRepository) FindByID(userID uint, taskID uint) (*model.Task, error) {
	var task model.Task

	err := r.db.
		Preload("Tags").
		Where("user_id = ? AND id = ?", userID, taskID).
		First(&task).Error
	if err != nil {
		return nil, err
	}

	return &task, nil
}

func (r *TaskRepository) Create(newtask *model.Task, userID uint, tagIDs []uint) (*model.Task, error) {
	task := model.Task{
		UserID:        userID,
		Title:         newtask.Title,
		Description:   newtask.Description,
		Status:        newtask.Status,
		Priority:      newtask.Priority,
		DueDate:       newtask.DueDate,
		EstimatedTime: newtask.EstimatedTime,
	}
	if err := r.db.Create(&task).Error; err != nil {
		return nil, err
	}

	if len(tagIDs) > 0 {
		var tags []model.Tags
		if err := r.db.Where("user_id = ? AND id IN ?", userID, tagIDs).Find(&tags).Error; err != nil {
			return nil, err
		}
		if len(tags) > 0 {
			if err := r.db.Model(&task).Association("Tags").Replace(tags); err != nil {
				return nil, err
			}
		}
	}

	return &task, nil
}

func (r *TaskRepository) Update(taskID uint, userID uint, updates map[string]interface{}) (*model.Task, error) {
	var task model.Task
	err := r.db.Where("id = ? AND user_id = ?", taskID, userID).First(&task).Error
	if err != nil {
		return nil, err
	}

	if err := r.db.Model(&task).Updates(updates).Error; err != nil {
		return nil, err
	}

	return &task, nil
}

func (r *TaskRepository) Delete(taskID uint, userID uint) error {
	result := r.db.Where("id = ? AND user_id = ?", taskID, userID).Delete(&model.Task{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
