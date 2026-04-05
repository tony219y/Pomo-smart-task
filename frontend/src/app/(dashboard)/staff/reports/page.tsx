"use client";

import { Activity, CheckCircle2, Clock3, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SummaryCard from "@/features/dashboard/components/SummaryCard";
import { useStaffReport } from "@/features/staff/hooks/useStaffReport";

const statusLabels: Record<string, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

const StaffReportsPage = () => {
  const { data, isLoading } = useStaffReport();

  const summary = data ?? {
    totalUsers: 0,
    activeUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalEstimatedMinutes: 0,
    roleBreakdown: {
      member: 0,
      staff: 0,
      admin: 0,
    },
    recentTasks: [],
  };

  const totalHours = Math.floor(summary.totalEstimatedMinutes / 60);
  const totalMinutes = summary.totalEstimatedMinutes % 60;
  const completionRate =
    summary.totalTasks === 0 ? 0 : Math.round((summary.completedTasks / summary.totalTasks) * 100);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Staff Reports</h1>
        <p className="text-sm text-muted-foreground">
          A simple team overview for workload, progress, and active users.
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
            <CardTitle>Team Snapshot</CardTitle>
            <CardDescription>Quick counts for the current team activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-sm text-muted-foreground">Completion rate</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{completionRate}%</p>
            </div>
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
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Recent Team Tasks</CardTitle>
            <CardDescription>
              The latest tasks created across the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(() => {
              if (isLoading) return <p className="text-sm text-muted-foreground">Loading staff report...</p>;
              if (summary.recentTasks.length === 0) return <p className="text-sm text-muted-foreground">No task activity yet.</p>;
              return summary.recentTasks.map((task: any) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-border bg-background px-4 py-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium text-foreground">{task.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Status: {statusLabels[task.status] ?? task.status}
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      {task.priority}
                    </span>
                  </div>
                </div>
              ));
            })()}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default StaffReportsPage;
