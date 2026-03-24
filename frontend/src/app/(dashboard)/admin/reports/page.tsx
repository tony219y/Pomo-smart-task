"use client";

import { Activity, CheckCircle2, Clock3, FileText, Users } from "lucide-react";
import SummaryCard from "@/features/dashboard/components/SummaryCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminReport } from "@/features/admin/hooks/useAdminReport";

const AdminReportsPage = () => {
  const { data, isLoading } = useAdminReport();

  const summary = data ?? {
    totalUsers: 0,
    activeUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalEstimatedMinutes: 0,
    totalLogs: 0,
    roleBreakdown: {
      member: 0,
      staff: 0,
      admin: 0,
    },
    recentLogs: [],
  };

  const totalHours = Math.floor(summary.totalEstimatedMinutes / 60);
  const totalMinutes = summary.totalEstimatedMinutes % 60;

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Reports</h1>
        <p className="text-sm text-muted-foreground">
          A simple system overview for users, tasks, and recent activity.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Users" value={summary.totalUsers} icon={Users} />
        <SummaryCard title="Active Users" value={summary.activeUsers} icon={Activity} />
        <SummaryCard title="Completed Tasks" value={summary.completedTasks} icon={CheckCircle2} />
        <SummaryCard
          title="Focus Workload"
          value={`${totalHours}h ${totalMinutes}m`}
          icon={Clock3}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Role Breakdown</CardTitle>
            <CardDescription>Current user distribution across the system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(summary.roleBreakdown).map(([role, count]) => (
              <div
                key={role}
                className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3"
              >
                <span className="capitalize text-foreground">{role}</span>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                  {count}
                </span>
              </div>
            ))}
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-sm text-muted-foreground">Total logs recorded</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{summary.totalLogs}</p>
            </div>
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-sm text-muted-foreground">Total tasks in system</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{summary.totalTasks}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Recent Audit Logs
            </CardTitle>
            <CardDescription>The newest important actions seen across the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading admin report...</p>
            ) : summary.recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent logs available.</p>
            ) : (
              summary.recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-border bg-background px-4 py-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {log.actorName || "Unknown user"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {log.action} • {log.entityType || "unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">{log.metadata || "No details"}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminReportsPage;
