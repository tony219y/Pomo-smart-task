package dto

type CreateAuditLogInput struct {
	ActorID    uint
	Action     string
	EntityType string
	EntityID   *uint
	Metadata   string
	IPAddress  string
	UserAgent  string
}
