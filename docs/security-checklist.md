# Security Checklist

## Part 3. Secure Communication

| Requirement | Status | Notes |
| --- | --- | --- |
| HTTPS only | PASS | Backend rejects non-HTTPS requests in production |
| No credential over HTTP | PASS | Frontend rejects insecure backend URLs outside localhost |

Evidence:

- Production HTTPS enforcement: `backend/internal/middleware/transport.go`
- Startup validation for secure URLs: `backend/internal/config/security.go`
- Frontend insecure URL guard: `frontend/src/api/axios.ts`

## Part 4. Secret Management

| Requirement | Status | Notes |
| --- | --- | --- |
| Secrets stored safely | PASS | Secrets are read from environment variables |
| No hardcode in source code | PASS | JWT and OAuth secrets come from env |

Evidence:

- JWT secret from env: `backend/internal/middleware/jwt.go`
- OAuth client secret from env: `backend/internal/auth/auth.go`
- Production validation for secret strength and secure URLs: `backend/internal/config/security.go`

## Part 5. SQLi / XSS Protection

| Requirement | Status | Notes |
| --- | --- | --- |
| SQL Injection protection | PASS | GORM parameter binding is used for user input |
| XSS protection | PASS | React escapes rendered strings and user input is not injected as HTML |

Evidence:

- SQLi-safe task queries: `backend/internal/repository/tasks_repository.go`
- SQLi-safe user queries: `backend/internal/repository/users_repository.go`
- SQLi-safe tag queries: `backend/internal/repository/tags_repository.go`
- XSS-safe rendering in React pages and components
- `dangerouslySetInnerHTML` exists only in `frontend/src/components/ui/chart.tsx` for generated chart styles, not user-provided content
