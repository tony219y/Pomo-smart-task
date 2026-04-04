# Password Policy Checklist

อ้างอิงหลัก:

- OWASP Authentication Cheat Sheet
- OWASP Password Storage Cheat Sheet

## สรุปผลปัจจุบัน

### 1. Mandatory Requirementsบริษัท พีค ซิเคียวร์ จำกัด vs ascend money 

| Requirement | Status | Notes |
| --- | --- | --- |
| 1.1 Custom Login System | PASS | ใช้ auth route/service ของโปรเจกต์เอง ไม่ได้ใช้ full-auth library |
| 1.2.1 OWASP Password Policy | PASS (core controls) | backend บังคับ minimum length, max bytes, block common passwords, login throttling |
| 1.2.2 OWASP Password Storage Cheat Sheet | PASS (core controls) | ใช้ bcrypt, salt อัตโนมัติ, ไม่เก็บ plain text, ไม่ truncate password |
| 1.3.1 Hash ด้วย bcrypt / argon2 เท่านั้น | PASS | ใช้ bcrypt |
| 1.3.2 มี salt อัตโนมัติ | PASS | bcrypt จัดการ salt ให้อัตโนมัติ |
| 1.3.3 ห้ามเก็บ plain text | PASS | เก็บเฉพาะ hash |

## รายละเอียดที่เช็กจากโค้ด

### ผ่านแล้ว

- ใช้ `bcrypt.GenerateFromPassword` ตอนสมัครสมาชิก
- ใช้ `bcrypt.CompareHashAndPassword` ตอน login
- backend บังคับ password ขั้นต่ำ `15` characters
- backend ปฏิเสธ password ที่เกิน `72 bytes` เพื่อไม่ให้ bcrypt truncate เงียบ ๆ
- backend block password ที่ common มาก ๆ เช่น `password`, `123456`, `qwerty`
- login มี rate limit ตาม IP ที่ route `/auth/login`
- login error ถูกทำให้ generic มากขึ้น ลดความเสี่ยง user enumeration
- Google-created account ไม่ได้ใช้ email เป็น local password อีกแล้ว

### ข้อสังเกต

- denylist ตอนนี้เป็น local common-password list แบบอ่านง่ายและดูแลง่าย
- ถ้าต้องการเข้มขึ้นอีก สามารถต่อกับ HIBP / Pwned Passwords หรือใช้ denylist ขนาดใหญ่ขึ้นได้
- ยังไม่มี forgot/reset password flow
- ยังไม่มี change password flow
- หน้า register มี password strength meter แบบเบา ๆ เพื่อช่วย UX แต่ security หลักยัง enforce ที่ backend

## ไฟล์สำคัญ

- `backend/internal/service/users_service.go`
- `backend/internal/service/password_policy.go`
- `backend/internal/routes/auth_routes.go`
- `frontend/src/features/auth/schemas/auth.schema.ts`
- `frontend/src/features/auth/components/RegisterForm.tsx`
