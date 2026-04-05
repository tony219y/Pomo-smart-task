# Pomo Smart Task

Pomo Smart Task เป็นระบบจัดการงานแบบ full-stack ที่รวม task management, pomodoro timer, role-based workspace และ custom authentication ไว้ในโปรเจ็กต์เดียว

README นี้เขียนเพื่อใช้สรุปงานตามหัวข้อประเมินด้าน authentication, JWT, secure communication, secret management, SQLi/XSS และ code quality โดยแยกชัดเจนว่าอะไร `มี`, `มีบางส่วน`, หรือ `ไม่มี`

## 1. Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query
- Zustand
- Axios

### Backend
- Go
- Fiber v3
- GORM
- PostgreSQL
- JWT
- bcrypt
- Google OAuth2

### Infra / Deploy
- Docker + Docker Compose
- Nginx reverse proxy
- Let's Encrypt via Certbot
- SonarQube via Docker Compose

## 2. อธิบายแอปคร่าว ๆ

ระบบนี้ใช้สำหรับจัดการงานและเวลาทำงาน โดยมีฟีเจอร์หลักดังนี้

- สมาชิกทั่วไป (`member`) ใช้งาน dashboard ส่วนตัว, task list, pomodoro, personal reports
- เจ้าหน้าที่ (`staff`) เห็น staff workspace และรายงานภาพรวมทีม
- ผู้ดูแล (`admin`) เห็น admin workspace, user management, audit logs, system-wide reports

แนวคิดหลักคือ frontend ใช้สำหรับ UX และ navigation ส่วน backend เป็นตัวตัดสินสิทธิ์จริงผ่าน JWT และ permission middleware

## 3. หน้า Profile

สถานะ: `มีบางส่วน`

- มี endpoint โปรไฟล์ผู้ใช้ปัจจุบันที่ `GET /users/me`
- frontend ดึงข้อมูลโปรไฟล์ผ่าน `useProfile()` แล้วใช้แสดงชื่อ/role ใน layout
- ยังไม่มีหน้า `Profile` แยกเป็น dedicated page สำหรับแก้ไขข้อมูลผู้ใช้

ไฟล์อ้างอิง:
- `frontend/src/features/auth/hooks/use-auth.ts`
- `frontend/src/features/auth/services/auth.service.ts`
- `frontend/src/components/layout/AppNavbar.tsx`
- `backend/internal/routes/user_routes.go`
- `backend/internal/handler/users_handler.go`

## 4. มีการ implement cloud ของ Nipa หรือไม่

สถานะ: `มีเฉพาะ deployment guide ไม่ได้ผูกกับ Nipa API/SDK โดยตรง`

- มีเอกสาร deploy ลง Nipa Cloud VM ที่ `docs/nipa-cloud-deploy.md`
- ใช้วิธี deploy แบบ VM + Docker + Docker Compose
- ไม่ได้มี code ที่เรียก Nipa API, cloud SDK หรือ service integration โดยตรงในตัวแอป

## A. Authentication - Password & SSO

### A1. Check password

#### A1.1 มีการเช็คทั้ง FE และ BE หรือไม่

สถานะ: `มี`

- FE ตรวจ basic validation ผ่าน Zod เช่น required, email format, min/max length ของ password ตอน register
- FE มี password strength meter แบบเบา ๆ ที่หน้า register
- BE ตรวจจริงอีกครั้งด้วย `ValidatePassword()` ก่อนบันทึกข้อมูล

ไฟล์อ้างอิง:
- `frontend/src/features/auth/schemas/auth.schema.ts`
- `frontend/src/features/auth/components/RegisterForm.tsx`
- `backend/internal/service/password_policy.go`
- `backend/internal/service/users_service.go`

#### A1.2 ทำไมต้อง check ทั้ง FE และ BE

- FE ช่วย UX ให้ผู้ใช้เห็น error เร็วขึ้น ไม่ต้องรอ request ไป server
- BE เป็นจุดที่เชื่อถือได้จริง เพราะผู้ใช้สามารถ bypass FE ได้เสมอ เช่น ยิง API ตรง, แก้ request เอง, ปิด JavaScript
- ดังนั้น FE คือ convenience และ BE คือ security enforcement

### A2. Password policy OWASP

#### A2.1 Length

สถานะ: `มีบางส่วน`

สิ่งที่มี:
- backend บังคับขั้นต่ำ `15 characters`
- frontend register schema บังคับขั้นต่ำ `15`

สิ่งที่ยังไม่มี:
- ยังไม่มีเงื่อนไขแยก `with MFA >= 8` เพราะระบบยังไม่มี MFA
- ยังไม่รองรับ passphrase ยาวถึง `64+` ได้เต็มตาม OWASP เพราะระบบใช้ bcrypt และจำกัดไว้ที่ `72 bytes` เพื่อป้องกัน bcrypt truncation

ไฟล์อ้างอิง:
- `backend/internal/service/password_policy.go`
- `frontend/src/features/auth/schemas/auth.schema.ts`

#### A2.2 Password strength meter

สถานะ: `มี`

- หน้า register มี meter แบบง่าย แสดง `Too short / Fair / Good / Strong`

ไฟล์อ้างอิง:
- `frontend/src/features/auth/components/RegisterForm.tsx`

#### A2.3 Check password against breach list

สถานะ: `มีบางส่วน`

- มี local denylist ของ common passwords เช่น `password`, `123456`, `qwerty`
- ยังไม่ได้เชื่อมกับบริการ breach database จริง เช่น Have I Been Pwned k-anonymity API

ไฟล์อ้างอิง:
- `backend/internal/service/password_policy.go`

#### A2.4 Allow all characters including unicode and whitespace

สถานะ: `มีบางส่วน`

- backend ใช้ `utf8.RuneCountInString` จึงนับ unicode ได้
- ไม่ได้บล็อกอักขระพิเศษหรือ whitespace โดยตรง
- แต่มีข้อจำกัด `72 bytes` จาก bcrypt ทำให้รหัสผ่าน unicode/whitespace ที่ยาวมากอาจชนเพดาน bytes ได้

#### A2.5 Error message safe

สถานะ: `มี`

- ตอน login ใช้ข้อความกลาง ๆ เช่น `Incorrect username or password`
- ไม่เปิดเผยว่า email ไม่มีในระบบหรือ password ผิด

ไฟล์อ้างอิง:
- `backend/internal/service/users_service.go`

#### A2.6 Rate limit login

สถานะ: `มี`

- route `/auth/login` มี limiter ตาม IP
- route `/auth/refresh` ก็มี limiter ตาม IP เช่นกัน

ไฟล์อ้างอิง:
- `backend/internal/routes/auth_routes.go`

### A3. Password Storage

#### A3.1 ไม่เก็บ plaintext และอธิบายข้อมูลใน database password ได้

สถานะ: `มี`

- ตาราง `users` เก็บ field `password` เป็น hash string ไม่ใช่ plaintext
- ตอน register ใช้ `bcrypt.GenerateFromPassword(...)`
- ตอน login ใช้ `bcrypt.CompareHashAndPassword(...)`

สิ่งที่อธิบายได้:
- ค่าใน database จะเป็น bcrypt hash ซึ่งรวม metadata ของ algorithm/cost และ salt อยู่ในตัว hash

ไฟล์อ้างอิง:
- `backend/internal/model/users_model.go`
- `backend/internal/service/users_service.go`

#### A3.2 ใช้ argon2 / bcrypt และเหตุผลในการเลือก

สถานะ: `มี`

- โปรเจ็กต์นี้เลือกใช้ `bcrypt`
- เหตุผลที่ตอบได้:
  - เป็น algorithm สำหรับ password hashing โดยตรง
  - library mature และใช้ง่ายใน Go
  - มี salt อัตโนมัติ
  - โค้ดปัจจุบันรองรับแล้วครบ flow

ข้อจำกัด:
- ไม่ได้ใช้ Argon2
- ไม่มี pepper

#### A3.3 มี salt อัตโนมัติ

สถานะ: `มี`

- bcrypt จัดการ salt ให้อัตโนมัติ

#### A3.optional pepper

สถานะ: `ไม่มี`

### A4. SSO

#### A4.1 ต้องทำอะไรที่ฝั่ง Google บ้าง

สถานะ: `มี`

สิ่งที่ต้องทำ:
- สร้าง OAuth client ใน Google Cloud Console
- ตั้ง `Authorized redirect URI` ให้ตรงกับ `GOOGLE_REDIRECT_URL`
- นำ `GOOGLE_CLIENT_ID` และ `GOOGLE_CLIENT_SECRET` มาใส่ใน env

#### A4.2 ดึงอะไรมาจาก Google บ้าง

สถานะ: `มีบางส่วน`

- ตอนนี้ดึง `email`
- response model รองรับ `id`, `email`, `verified_email`, `picture`
- แต่ logic ใช้งานจริงตอนนี้ใช้ email เป็นหลัก

ไฟล์อ้างอิง:
- `backend/internal/auth/auth.go`
- `backend/internal/model/oauth.model.go`

#### A4.3 ถ้าต้องการดึงชื่อ นามสกุล จาก Google ต้องทำอย่างไร

สถานะ: `ยังไม่ได้ implement`

สิ่งที่ต้องเพิ่ม:
- ขอ scope เพิ่ม เช่น profile
- parse field เพิ่มจาก Google user info endpoint เช่น `given_name`, `family_name`, `name`
- ขยาย model และ logic ฝั่ง backend ให้บันทึกหรือใช้ข้อมูลเหล่านั้น

#### A4.4 ต้องทำอะไรที่ฝั่ง web application บ้าง

สถานะ: `มี`

- FE มีปุ่ม `Continue with google`
- FE redirect ไป backend `/auth/google`
- backend เริ่ม OAuth flow
- backend รับ callback, exchange code เป็น Google token, ดึง email, login/create local account, ออก JWT session, set refresh cookie แล้ว redirect กลับ frontend

ไฟล์อ้างอิง:
- `frontend/src/features/auth/components/LoginForm.tsx`
- `frontend/src/features/auth/services/auth.service.ts`
- `backend/internal/routes/auth_routes.go`
- `backend/internal/handler/users_handler.go`
- `backend/internal/auth/auth.go`

#### A4.5 Check ลอกอินซ้ำกับ Google

สถานะ: `มีบางส่วน`

- ถ้า email จาก Google ตรงกับ user เดิม ระบบจะใช้ account เดิม
- ถ้าไม่พบ email เดิม ระบบจะสร้าง user ใหม่ role `member`
- ยังไม่มีการผูก provider account แบบแยกตาราง identity และยังไม่ได้กันกรณี email collision แบบหลาย provider อย่างละเอียด

ไฟล์อ้างอิง:
- `backend/internal/service/users_service.go`

### A5. Bonus Implement: 2FA

สถานะ: `ไม่มี`

- ไม่มี TOTP, OTP, authenticator app หรือ second factor จริง
- package `input-otp` ที่เห็นใน frontend ยังไม่ได้ถูกใช้เป็น 2FA flow จริง

### A6. Bonus Implement: Forget Password

สถานะ: `ไม่มี`

- ไม่มี forgot password flow
- ไม่มี reset token
- ไม่มี reset password endpoint

## B. JWT

### B1. Follow Requirement

#### B1.1 Check 3 role

สถานะ: `มี`

- มี 3 role คือ `member`, `staff`, `admin`

ไฟล์อ้างอิง:
- `backend/internal/permission/permissions.go`

#### B1.2 UI ของแต่ละ role แสดงว่าไม่ได้ share กัน

สถานะ: `มี`

- member เห็น dashboard/tasks/pomodoro/reports
- staff เห็น staff workspace และ staff reports
- admin เห็น admin workspace, reports, logs, users
- sidebar แยกเมนูตาม role ชัดเจน

ไฟล์อ้างอิง:
- `frontend/src/components/layout/AppSidebar.tsx`
- `frontend/src/app/(dashboard)/dashboard/page.tsx`
- `frontend/src/app/(dashboard)/staff/page.tsx`
- `frontend/src/app/(dashboard)/admin/page.tsx`
- `frontend/src/app/(dashboard)/admin/users/page.tsx`

#### B1.3 สิทธิ์ใน Database ต่างกันหรือไม่

สถานะ: `มี`

##### B1.3.1 User เห็นเฉพาะข้อมูลตัวเอง

สถานะ: `มี`

- task query ใช้ `WHERE user_id = ?`
- task by id ใช้ `WHERE user_id = ? AND id = ?`

ไฟล์อ้างอิง:
- `backend/internal/repository/tasks_repository.go`

##### B1.3.2 Admin เห็นทั้งหมด

สถานะ: `มี`

- admin/staff summary ใช้ task query แบบรวมทั้งหมด
- admin users ดึง user ทั้งระบบ
- admin logs ดึง audit log ทั้งระบบ

ไฟล์อ้างอิง:
- `backend/internal/repository/tasks_repository.go`
- `backend/internal/repository/users_repository.go`
- `backend/internal/repository/audit_log_repository.go`
- `backend/internal/service/admin_service.go`

### B2. Bonus Explain Design Concept

#### B2.1 Design concept ของ JWT กับ role

- JWT access token ใส่ `user_id`, `role`, `type`, `exp`, `iat`
- backend verify token ทุก request ก่อน
- backend เอา `role` จาก token ไปเช็ก permission middleware
- frontend ใช้ role ใน token เพื่อ redirect ไปหน้าเริ่มต้นที่ถูกต้อง แต่ไม่ใช่จุดตัดสินสิทธิ์สุดท้าย
- ดังนั้น frontend role check มีไว้เพื่อ UX ส่วน backend permission check มีไว้เพื่อ security

### B3. การสร้าง JWT

#### B3.1 JWT_SECRET ได้มาจากไหน

สถานะ: `มี`

- มาจาก environment variable `JWT_SECRET`

ไฟล์อ้างอิง:
- `backend/internal/middleware/jwt.go`
- `backend/internal/config/security.go`
- `backend/.env.production.example`

#### B3.2 ใช้ JWT_SECRET ที่ปลอดภัยหรือไม่

สถานะ: `มีบางส่วน`

- production บังคับ `JWT_SECRET` ยาวอย่างน้อย 32 characters
- แต่ repo ไม่มีตัว generator secret ในตัว และไม่ได้วัด entropy จริง beyond length

#### B3.3 JWT สร้างเมื่อใด อย่างไร

สถานะ: `มี`

- สร้างหลัง login สำเร็จ
- สร้างหลัง Google login สำเร็จ
- สร้างใหม่ตอน refresh token สำเร็จ
- ใช้ `jwt.NewWithClaims(...).SignedString([]byte(jwtSecret))`

#### B3.4 JWT สร้างที่ไหน FE/BE และทำไม

สถานะ: `มี`

- สร้างที่ backend เท่านั้น
- เพราะ backend ถือ secret และเป็น trusted side
- FE ไม่ควรสร้าง JWT เอง เพราะจะต้องรู้ secret ซึ่งไม่ปลอดภัย

#### B3.5 ใช้ algo ตัวไหน

สถานะ: `มี`

- ใช้ `HS256`

ไฟล์อ้างอิง:
- `backend/internal/middleware/jwt.go`

#### B3.6 กรณีไหนใช้ HS256 / RS256

สถานะ: `ตอบเชิงแนวคิดได้ แต่ระบบนี้ใช้ HS256`

- ระบบนี้ใช้ HS256 เพราะ backend เดียวเป็นทั้ง issuer และ verifier
- RS256 เหมาะเมื่ออยากแยก issuer กับ verifier, มีหลาย service, หรืออยาก verify ด้วย public key โดยไม่แชร์ secret

#### B3.7 การเลือกอายุของ Access Token

สถานะ: `มี`

- access token อายุ `15 นาที`
- refresh token อายุ `30 วัน`
- แนวคิดคือ access token สั้นเพื่อลด blast radius ถ้าหลุด ส่วน refresh token ใช้รักษา session ระยะยาว

ไฟล์อ้างอิง:
- `backend/internal/middleware/jwt.go`

### B4. การส่ง Token

#### B4.1 ส่ง JWT Token มาที่ Client โดยใช้ Cookies หรือไม่

สถานะ: `มีบางส่วน`

- access token ส่งกลับใน JSON response body
- refresh token ส่งผ่าน cookie ชื่อ `refresh_token`

#### B4.2 Cookie มี HttpOnly + Secure ไหม

สถานะ: `มีบางส่วน`

- `HttpOnly = true`
- `Secure = true` เมื่อ `APP_ENV=production`
- `SameSite = None` ใน production, `Lax` นอก production

ไฟล์อ้างอิง:
- `backend/internal/handler/users_handler.go`

#### B4.3 วิธีดู JWT ที่ฝั่ง Client

สถานะ: `มี`

- access token ถูกเก็บใน Zustand store
- developer สามารถดูได้จาก network response หรือ state ใน browser runtime

ไฟล์อ้างอิง:
- `frontend/src/store/auth-store.ts`
- `frontend/src/features/auth/hooks/use-auth.ts`

#### B4.4 decode JWT แล้วอ่าน payload ได้

สถานะ: `มี`

- frontend มี helper decode เพื่ออ่าน role จาก payload สำหรับ navigation

ไฟล์อ้างอิง:
- `frontend/src/features/auth/utils/role-navigation.ts`

หมายเหตุ:
- การ decode ทำได้โดยไม่ verify signature
- การ authorize จริงยังต้องให้ backend verify token ทุกครั้ง

### B5. การ Verify Token

#### B5.1 ฟังก์ชัน verify อยู่ backend

สถานะ: `มี`

- access token verify ใน `JWTMiddleware`
- refresh token verify ใน `ParseRefreshToken`

#### B5.2 มีการ verify ไม่ใช่แค่ decode

สถานะ: `มี`

- ใช้ `jwt.Parse(...)` และกำหนด valid method เป็น `HS256`
- เช็กทั้ง signature, validity, claims, และ token type

#### B5.3 อธิบายฟังก์ชัน verify

- อ่าน `Authorization: Bearer <token>`
- parse token ด้วย `JWT_SECRET`
- บังคับ algorithm เป็น `HS256`
- ตรวจว่า token valid
- ตรวจ claims `user_id`, `role`, `type`
- ถ้า `type != access` จะ reject
- ถ้าผ่านจะเอา `user_id` และ `role` ไปเก็บใน request context

ไฟล์อ้างอิง:
- `backend/internal/middleware/jwt.go`

#### B5.4 กรณี token หมดอายุ/invalid ระบบ response อะไร

สถานะ: `มี`

- access token invalid/expired -> `401 Unauthorized` พร้อมข้อความเช่น `invalid token`
- refresh token invalid/expired/revoked -> `401 Unauthorized` พร้อมข้อความ `invalid refresh token`
- missing token -> `401 Unauthorized`

### B6. Bonus Implement: Refresh Token Mechanism

#### B6.1 ใช้ Refresh Token กรณีไหน

สถานะ: `มี`

- ใช้เมื่ออยากให้ access token อายุสั้น แต่ผู้ใช้ยังคง session ต่อได้โดยไม่ต้อง login ใหม่บ่อย
- ถ้าเป็นระบบที่ security sensitivity สูงมาก อาจเลือกไม่ใช้ refresh token หรือทำ session สั้นกว่านี้

#### B6.2 การออกแบบ Refresh Token และ Access Token

สถานะ: `มี`

- access token: 15 นาที
- refresh token: 30 วัน
- refresh token มี `jti` แยกแต่ละ session
- เมื่อ refresh สำเร็จ ระบบ revoke refresh token เดิมแล้วออกตัวใหม่

#### B6.3 การเก็บ Refresh Token อย่างปลอดภัย

สถานะ: `มีบางส่วน`

- เก็บที่ browser cookie แบบ `HttpOnly`
- `Secure` ใน production
- มีการเก็บ `jti`, `expires_at`, `revoked_at` ใน database
- ข้อสังเกต: ยังไม่มี device binding, fingerprinting, หรือ CSRF token คู่กับ cookie

ไฟล์อ้างอิง:
- `backend/internal/model/refresh_tokens_model.go`
- `backend/internal/repository/users_repository.go`
- `backend/internal/handler/users_handler.go`

## C. Secure Communication

### C0. แสดง HTTPS ได้

สถานะ: `มี`

- backend มี middleware บังคับ HTTPS ใน production
- มีเอกสารและ deployment path สำหรับ Nginx + Let's Encrypt
- ปัจจุบัน production config รองรับโดเมน HTTPS

ไฟล์อ้างอิง:
- `backend/internal/middleware/transport.go`
- `backend/internal/config/security.go`
- `docs/nipa-cloud-deploy.md`

### C1. About CA

#### C1.1 CA คือใคร

- CA คือ Certificate Authority ผู้ที่ออก certificate และยืนยันความน่าเชื่อถือของ public key ที่ผูกกับโดเมน

#### C1.2 CA Signature Algorithm คืออะไร

- คือ algorithm ที่ CA ใช้เซ็น certificate เพื่อให้ browser ตรวจสอบได้ว่า certificate ถูกออกโดย CA ที่เชื่อถือได้จริง

#### C1.3 Public key algo ไหน

- ตรวจได้จาก certificate จริงที่ deploy อยู่
- ใน README นี้ยังไม่ได้บันทึกผล inspect certificate จริง จึงให้ตอบว่า "ต้องเช็กจาก cert ที่เซิร์ฟเวอร์ใช้งานอยู่"

สถานะหัวข้อนี้: `ไม่มีหลักฐานใน repo`

#### C1.4 กุญแจเขียวมีไว้ทำอะไร

- ใช้สื่อว่าการเชื่อมต่อกับโดเมนนั้นเข้ารหัสด้วย TLS และ certificate ผ่านการตรวจสอบจาก browser

### C2. Server เก็บ private key / public key ไว้ที่ไหน

#### C2.1 Private key

สถานะ: `มี`

- ถ้าใช้ Certbot/Let's Encrypt บน VM จะอยู่ใต้ `/etc/letsencrypt/live/<domain>/privkey.pem`
- ไฟล์นี้ไม่อยู่ใน source code

#### C2.2 Public key

สถานะ: `มี`

- public certificate chain จะอยู่ใต้ `/etc/letsencrypt/live/<domain>/fullchain.pem`

หมายเหตุ:
- path จริงของ cert/runtime ไม่ได้ถูก version control ใน repo

## D. Secret Management

### D1. ไฟล์ ENV

#### D1.1 สิทธิ์ไฟล์ .env ถูกต้อง

สถานะ: `ไม่มีหลักฐานใน repo`

- เรื่อง permission เช่น `600/644` ต้องตรวจบนเครื่องจริงด้วย `ls -la`
- ใน repo มีแค่ตัวอย่างไฟล์ `.env.production.example`

#### D1.2 Client Secret ของ SSO อยู่ใน .env

สถานะ: `มี`

- ใช้ `GOOGLE_CLIENT_SECRET` จาก env

#### D1.3 ไม่มีการ hardcode Client Secret

สถานะ: `มี`

#### D1.4 JWT Secret อยู่ใน .env

สถานะ: `มี`

- ใช้ `JWT_SECRET` จาก env

#### D1.5 ไม่มีการ hardcode JWT Secret

สถานะ: `มี`

ไฟล์อ้างอิง:
- `backend/internal/auth/auth.go`
- `backend/internal/middleware/jwt.go`
- `backend/internal/config/security.go`
- `backend/.env.production.example`

### D2. private key

#### D2.1 สิทธิ์ไฟล์ private key ถูกต้อง (600)

สถานะ: `ไม่มีหลักฐานใน repo`

- ต้องตรวจบน VM จริง เช่น `ls -l /etc/letsencrypt/live/<domain>/privkey.pem`

#### D2.2 Private key ไม่อยู่ใน source code

สถานะ: `มี`

- ไม่พบ private key ใน repository

### D3. ไม่นำ env ขึ้น Git

#### D3.1 .env อยู่ใน .gitignore

สถานะ: `มี`

- `.gitignore` ignore `/.env` และ `/.env.*` แต่อนุญาต `.env.*.example`

#### D3.2 git log ไม่เคยมี .env ขึ้นไป

สถานะ: `มีบางส่วน`

- จาก `git log` ที่ตรวจใน repo พบเฉพาะ `.env.production.example` และ `backend/.env.production.example`
- ไม่พบ `.env` หรือ `.env.production` จริงถูก commit ใน path ที่เช็ก

ข้อจำกัด:
- เป็นการตรวจจาก history ใน repo ปัจจุบันเท่านั้น

## E. SQLi and XSS

### E1. SQLi

#### E1.1 จะเจอ SQLi เมื่อไร

- จะเจอเมื่อเอา input ผู้ใช้ไปประกอบ SQL string ตรง ๆ โดยไม่ parameterize เช่น concat query เอง

#### E1.2 เปิด code การป้องกัน 1

สถานะ: `มี`

- โปรเจ็กต์ใช้ GORM และ parameterized query เช่น `Where("user_id = ?", userID)`

ไฟล์อ้างอิง:
- `backend/internal/repository/tasks_repository.go`
- `backend/internal/repository/users_repository.go`

#### E1.3 อธิบายได้ว่าป้องกัน SQLi อย่างไร

- ORM/parameterized query แยก SQL statement ออกจากค่าที่ผู้ใช้ส่งมา
- input จึงไม่ถูกตีความเป็น SQL syntax เพิ่มเติม

#### E1.4 พิมพ์ `' OR '1'='1` ใน login จริง ๆ

สถานะ: `มีแนวโน้มป้องกันได้`

- จากโค้ด login ใช้ `FindByEmail(email)` ผ่าน GORM parameterization
- payload อย่าง `' OR '1'='1` จะถูกมองเป็นค่า string ธรรมดา ไม่กลายเป็นเงื่อนไข SQL
- ใน README นี้ยังไม่มี screenshot/demo run จริง

### E2. XSS

#### E2.1 จะเจอ XSS เมื่อไร

- จะเจอเมื่อเอา input ผู้ใช้ไป render เป็น HTML/JS โดยไม่ escape หรือ sanitize

#### E2.2 แสดง code การป้องกัน

สถานะ: `มีบางส่วน`

- UI ส่วนใหญ่ render ผ่าน React JSX ปกติ ซึ่ง escape ค่า text ให้อัตโนมัติ
- ไม่พบการ render user-provided HTML ด้วย `dangerouslySetInnerHTML` ใน flow หลักของแอป

ข้อสังเกต:
- มี `dangerouslySetInnerHTML` ใน component chart utility แต่ไม่ได้เห็นว่าใช้กับ input ผู้ใช้โดยตรง
- ไม่มี DOMPurify ในระบบ

#### E2.3 อธิบายได้ว่าป้องกัน XSS อย่างไร

- React escape string content ก่อน render ลง DOM โดยปกติ
- การไม่ใช้ raw HTML กับข้อมูลผู้ใช้ช่วยลด XSS ได้มาก
- refresh token อยู่ใน `HttpOnly` cookie จึงช่วยลดผลกระทบถ้า XSS เกิดขึ้นในบางกรณี

หมายเหตุ:
- หัวข้อนี้คือ XSS ไม่ใช่ SQLi

#### E2.4 พิมพ์ script test

สถานะ: `ไม่มีหลักฐาน demo ใน repo`

- เชิงโค้ดคาดว่า `<script>alert(1)</script>` จะถูกแสดงเป็น text ถ้าถูก render ใน JSX ปกติ
- แต่ README นี้ไม่มี test artifact หรือ screenshot

### E3. Bonus CSRF

#### E3.1 จะเจอ CSRF เมื่อไร

- จะเจอเมื่อ browser ส่ง cookie authentication ให้ request ข้าม origin โดยผู้ใช้ไม่ได้ตั้งใจ และ server เชื่อ cookie นั้น

#### E3.2 แสดง code การป้องกัน

สถานะ: `มีบางส่วน`

- มีการตั้ง `SameSite` ให้ refresh cookie
- มี CORS allowlist จำกัด origin

ไฟล์อ้างอิง:
- `backend/internal/handler/users_handler.go`
- `backend/cmd/api/main.go`
- `backend/internal/config/app.go`

#### E3.3 อธิบายได้ว่าป้องกัน CSRF อย่างไร

- `SameSite` ช่วยลดการส่ง cookie ข้ามไซต์ในบางกรณี
- CORS จำกัดว่า JS จาก origin อื่นเรียก API แล้วอ่านผลได้หรือไม่

ข้อจำกัดสำคัญ:
- ยังไม่มี anti-CSRF token แบบ explicit
- ถ้ามี endpoint ที่พึ่ง cookie authentication เป็นหลัก ควรเสริม CSRF token เพิ่ม

#### E3.4 demo attack test

สถานะ: `ไม่มี`

## F. Code Quality & Security Analysis

### F1. Before Report

#### F1.1 แสดง SonarQube report ก่อนแก้ไข

สถานะ: `ไม่มีหลักฐานใน repo`

- มี config SonarQube และ docker compose สำหรับรัน
- แต่ไม่มี report snapshot ก่อนแก้ไขที่ถูกเก็บไว้ใน repo

ไฟล์อ้างอิง:
- `docker-compose.sonarqube.yml`
- `sonar-project.properties`

#### F1.2 มี issue จริง

สถานะ: `ยังไม่ได้แนบหลักฐานใน repo`

- ถ้าจะใช้พรีเซนต์ ควรรัน SonarQube แล้ว capture หน้ารายงานจริง

### F2. After Report

#### F2.1 แสดง SonarQube report หลังแก้ไข

สถานะ: `ไม่มีหลักฐานใน repo`

#### F2.2 จำนวน issue ลดลงจริง

สถานะ: `ไม่มีหลักฐานใน repo`

### F3. เลือก issue ที่พบบ่อยมาอธิบาย 1 issue

สถานะ: `ตอบเชิงตัวอย่างได้ แต่ยังไม่มี report จริงใน repo`

ตัวอย่าง issue ที่อธิบายได้:
- Hardcoded secret / insecure configuration
- วิธีแก้คือย้ายค่าไป env และ validate ใน production startup

โค้ดตัวอย่างที่เกี่ยวข้อง:
- `backend/internal/config/security.go`

## สรุปสถานะตามภาพรวม

### Implemented ชัดเจน

- Custom authentication ด้วย email/password
- Google SSO
- bcrypt password hashing
- local password policy และ common-password denylist
- login/refresh rate limiting
- JWT access token + refresh token
- refresh token rotation + revoke
- 3 roles: member, staff, admin
- backend permission middleware
- database access control ตาม role/use case
- HTTPS enforcement ใน production
- secret management ผ่าน env
- Docker deploy และ SonarQube setup

### Implemented บางส่วน

- OWASP password policy ครอบคลุมบางข้อ แต่ยังไม่ครบทั้งหมด
- password strength meter มีแบบง่าย
- breached password check เป็น local denylist ไม่ใช่ online breach database
- profile feature มีข้อมูลโปรไฟล์แต่ไม่มีหน้า profile เต็มรูปแบบ
- CSRF mitigation มีบางส่วนผ่าน SameSite/CORS แต่ยังไม่มี CSRF token
- secret/file permission ตรวจได้บนเครื่องจริง แต่ไม่มีหลักฐานใน repo
- SonarQube พร้อมใช้งาน แต่ยังไม่มี before/after report หลักฐานใน repo

### ยังไม่มี

- 2FA / MFA
- forgot password / reset password
- pepper
- online breached password API integration
- dedicated profile management page
- stored evidence ของ SonarQube before/after
- CSRF demo attack test

## ไฟล์สำคัญที่ควรเปิดโชว์ตอนพรีเซนต์

- `backend/internal/service/password_policy.go`
- `backend/internal/service/users_service.go`
- `backend/internal/middleware/jwt.go`
- `backend/internal/middleware/permission.go`
- `backend/internal/middleware/transport.go`
- `backend/internal/routes/auth_routes.go`
- `backend/internal/repository/tasks_repository.go`
- `backend/internal/repository/users_repository.go`
- `backend/internal/auth/auth.go`
- `backend/internal/config/security.go`
- `frontend/src/features/auth/schemas/auth.schema.ts`
- `frontend/src/features/auth/components/RegisterForm.tsx`
- `frontend/src/components/layout/AppSidebar.tsx`
- `frontend/src/app/(dashboard)/staff/page.tsx`
- `frontend/src/app/(dashboard)/admin/page.tsx`
- `frontend/src/app/(dashboard)/admin/users/page.tsx`
- `docs/nipa-cloud-deploy.md`
- `docker-compose.sonarqube.yml`
- `sonar-project.properties`

## ข้อเสนอแนะถ้าจะให้ผ่าน rubric มากขึ้น

1. เพิ่ม 2FA เช่น TOTP
2. เพิ่ม forgot/reset password flow
3. เปลี่ยน breached password check เป็น Have I Been Pwned k-anonymity
4. เพิ่ม CSRF token สำหรับ flow ที่ใช้ cookie
5. เพิ่มหน้า profile จริง
6. เก็บ screenshot/report SonarQube ก่อนและหลังแก้ไข
7. ถ้าต้องการรองรับ passphrase ยาวมากกว่าเดิม ควรพิจารณา Argon2id
