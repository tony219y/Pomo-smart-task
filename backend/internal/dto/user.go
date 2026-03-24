package dto

type UpdateUserRoleRequest struct {
	Role string `json:"role"`
}

type DeactivateUserRequest struct {
	Active bool `json:"active"`
}
