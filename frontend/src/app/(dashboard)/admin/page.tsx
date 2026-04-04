"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Users } from "lucide-react";

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Workspace</h1>
        <p className="text-sm text-muted-foreground">
          Manage system users, review audit logs, and inspect platform-wide reports.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              User Control
            </CardTitle>
            <CardDescription>Change roles and update account status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/users">Open Admin Users</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              System Reports
            </CardTitle>
            <CardDescription>See totals across all users, tasks, and activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/reports">Open Admin Reports</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              Audit Logs
            </CardTitle>
            <CardDescription>Inspect the latest system actions recorded by the backend.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/logs">Open Admin Logs</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
