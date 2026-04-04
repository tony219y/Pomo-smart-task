"use client";

import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard allowedRoles={["staff", "admin"]}>
      {children}
    </AuthGuard>
  );
}
