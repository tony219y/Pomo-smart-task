package permission

const (
	TaskReadOwn    = "task.read_own"
	TaskWriteOwn   = "task.write_own"
	TagReadOwn     = "tag.read_own"
	ActivityReadOwn  = "activity.read_own"
	ActivityReadAll  = "activity.read_all"
	ReportReadOwn  = "report.read_own"
	ReportReadTeam = "report.read_team"
	ReportReadAll  = "report.read_all"
	UserReadOwn    = "user.read_own"
	UserReadAll    = "user.read_all"
	UserRoleUpdate = "user.role_update"
	UserDeactivate = "user.deactivate"
	SessionRevoke  = "session.revoke"
	AuditRead      = "audit.read"
)

var RolePermissions = map[string][]string{
	"member": {
		TaskReadOwn,
		TaskWriteOwn,
		TagReadOwn,
		ActivityReadOwn,
		ReportReadOwn,
		UserReadOwn,
	},
	"staff": {
		TaskReadOwn,
		TaskWriteOwn,
		TagReadOwn,
		ActivityReadOwn,
		ActivityReadAll,
		ReportReadOwn,
		ReportReadTeam,
		UserReadOwn,
		UserReadAll,
	},
	"admin": {
		TaskReadOwn,
		TaskWriteOwn,
		TagReadOwn,
		ActivityReadOwn,
		ActivityReadAll,
		ReportReadOwn,
		ReportReadTeam,
		ReportReadAll,
		UserReadOwn,
		UserReadAll,
		UserRoleUpdate,
		UserDeactivate,
		SessionRevoke,
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
