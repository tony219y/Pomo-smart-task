# Authorization System Checklist

References:

- JWT-based authentication
- Role-based access control

## Summary

| Requirement | Status | Notes |
| --- | --- | --- |
| 1. JWT Token for authentication | PASS | Access token and refresh token are issued and validated by backend middleware |
| 1.1 At least 3 roles | PASS | `member`, `staff`, `admin` |
| 1.2.1 User journey differs >= 50% | PASS | Each role now has a different landing page and different main navigation flow |
| 1.2.2 Shared UI not over 50% | PASS | Sidebar navigation is split by role and admin/staff have dedicated workspace pages |
| 1.3.1 Verify JWT every request | PASS | All protected routes are grouped under JWT middleware |
| 1.3.2 Reject invalid / expired token | PASS | Invalid or expired tokens return 401 |
| 2.1 Different database access using different tables | PASS | Admin-only audit log access uses `audit_logs` table |
| 2.2 Same table, different permissions | PASS | Own-task queries use `user_id`; admin/staff reports read all tasks/users |

## Evidence from code

- JWT middleware: `backend/internal/middleware/jwt.go`
- Permission middleware: `backend/internal/middleware/permission.go`
- Role permissions: `backend/internal/permission/permissions.go`
- Protected route registration: `backend/internal/routes/register.go`
- Admin-only routes: `backend/internal/routes/admin_routes.go`
- User and task permission routes: `backend/internal/routes/user_routes.go`, `backend/internal/routes/task_routes.go`, `backend/internal/routes/report_routes.go`
- Own-data task query: `backend/internal/repository/tasks_repository.go`
- All-data admin/staff summary query: `backend/internal/repository/tasks_repository.go`
- Role-based frontend guard: `frontend/src/features/auth/components/auth-guard.tsx`
- Role-based landing and navigation: `frontend/src/components/layout/AppSidebar.tsx`, `frontend/src/features/auth/utils/role-navigation.ts`
