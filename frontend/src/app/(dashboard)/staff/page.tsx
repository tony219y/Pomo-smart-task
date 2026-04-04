"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, BarChart3 } from "lucide-react";

export default function StaffHomePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Staff Workspace</h1>
        <p className="text-sm text-muted-foreground">
          Review team progress and monitor shared activity from one place.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5 text-primary" />
              Team Overview
            </CardTitle>
            <CardDescription>
              Open the staff report to see active users, workload, and completion rate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/staff/reports">Open Staff Reports</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              Team Metrics
            </CardTitle>
            <CardDescription>
              Use staff pages for cross-user summaries instead of personal task pages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This area is dedicated to staff-only reporting and team visibility.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
