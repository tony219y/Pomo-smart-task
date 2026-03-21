package dto

type CreateTaskRequest struct {
	Title         string `json:"title"`
	Description   string `json:"description"`
	Status        string `json:"status"`
	Priority      string `json:"priority"`
	DueDate       string `json:"dueDate"`
	EstimatedTime int    `json:"estimatedTime"`
}

type UpdateTaskRequest struct {
	Title         *string `json:"title"`
	Description   *string `json:"description"`
	Status        *string `json:"status"`
	Priority      *string `json:"priority"`
	DueDate       *string `json:"dueDate"`
	EstimatedTime *int    `json:"estimatedTime"`
}
