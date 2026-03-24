"use client";

import { BarChart3, CheckCircle2, Clock3, Flame, ListTodo, Tags } from "lucide-react";
import SummaryCard from "@/features/dashboard/components/SummaryCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useReportSummary } from "@/features/reports/hooks/useReportSummary";

const statusLabels: Record<string, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

const ReportsPage = () => {
  const { data, isLoading } = useReportSummary();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Loading your productivity summary...
          </p>
        </div>
      </div>
    );
  }

  const summary = data ?? {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    totalEstimatedMinutes: 0,
    completionRate: 0,
    topTag: "No tags yet",
    statusBreakdown: { todo: 0, in_progress: 0, done: 0 },
    topTags: [],
    recentTasks: [],
  };

  const totalHours = Math.floor(summary.totalEstimatedMinutes / 60);
  const remainingMinutes = summary.totalEstimatedMinutes % 60;

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">
          A simple overview of your current task progress and focus workload.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Tasks" value={summary.totalTasks} icon={ListTodo} />
        <SummaryCard title="Completed Tasks" value={summary.completedTasks} icon={CheckCircle2} />
        <SummaryCard title="Completion Rate" value={`${summary.completionRate}%`} icon={Flame} />
        <SummaryCard
          title="Estimated Focus Time"
          value={`${totalHours}h ${remainingMinutes}m`}
          icon={Clock3}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              Status Breakdown
            </CardTitle>
            <CardDescription>
              A quick view of how your current tasks are distributed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(summary.statusBreakdown).map(([status, count]) => {
              const width =
                summary.totalTasks === 0 ? 0 : Math.round((count / summary.totalTasks) * 100);

              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{statusLabels[status] ?? status}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="size-5 text-primary" />
              Top Tags
            </CardTitle>
            <CardDescription>
              The tags you are using most often right now.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Most used tag</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{summary.topTag}</p>
            </div>
            {summary.topTags.length > 0 ? (
              summary.topTags.map((tag) => (
                <div
                  key={tag.name}
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
                >
                  <span className="text-sm text-foreground">{tag.name}</span>
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                    {tag.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No tags available yet.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Your latest tasks, useful for a quick review before planning the next session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.recentTasks.length > 0 ? (
              summary.recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-background px-4 py-4 md:flex-row md:items-center md:justify-between"
                >
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
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No tasks yet. Create your first task to see report data.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ReportsPage;
