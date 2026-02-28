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

func (r *TaskRepository) FindAll(userID uint) (*[]model.TaskResponse, error) {
	var task []model.TaskResponse
	result := r.db.Model(&model.Task{}).
		Where("user_id = ?", userID).
		Find(&task)

	if result.Error != nil {
		return nil, result.Error
	}
	println(result)
	return &task, nil
}

func (r *TaskRepository) FindByOne(userID uint, taskID uint) (*[]model.TaskResponse, error) {
	var task []model.TaskResponse

	result := r.db.Model(&model.Task{}).
		Where("user_id = ? AND task_id =?", userID, taskID).
		Find(&task)
	if result.Error != nil {
		return nil, result.Error
	}
	return &task, nil

}
func (r *TaskRepository) Create(newtask *model.Task, userID uint) (*model.Task, error) {
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
	return &task, nil

}
func (r *TaskRepository) Update() *model.Task {

	return nil
}
func (r *TaskRepository) Delete() *model.Task {
	return nil

}
