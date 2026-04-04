"use client";

import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthGuard allowedRoles={["admin"]}>{children}</AuthGuard>;
}
