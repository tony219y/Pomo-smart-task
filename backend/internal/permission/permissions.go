package permission

const (
	TaskReadOwn    = "task.read_own"
	TaskWriteOwn   = "task.write_own"
	TagReadOwn     = "tag.read_own"
	ReportReadOwn  = "report.read_own"
	ReportReadTeam = "report.read_team"
	UserReadOwn    = "user.read_own"
	UserReadAll    = "user.read_all"
	AuditRead      = "audit.read"
)

var RolePermissions = map[string][]string{
	"user": {
		TaskReadOwn,
		TaskWriteOwn,
		TagReadOwn,
		ReportReadOwn,
		UserReadOwn,
	},
	"staff": {
		TaskReadOwn,
		TaskWriteOwn,
		TagReadOwn,
		ReportReadOwn,
		ReportReadTeam,
		UserReadOwn,
		UserReadAll,
	},
	"admin": {
		TaskReadOwn,
		TaskWriteOwn,
		TagReadOwn,
		ReportReadOwn,
		ReportReadTeam,
		UserReadOwn,
		UserReadAll,
		AuditRead,
	},
}

func HasPermission(role string, needed string) bool {
	permissions, ok := RolePermissions[role]
	if !ok {
		return false
	}

	for _, permission := range permissions {
		if permission == needed {
			return true
		}
	}

	return false
}
