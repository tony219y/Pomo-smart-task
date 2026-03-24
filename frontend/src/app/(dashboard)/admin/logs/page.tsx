"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminLogs } from "@/features/admin/hooks/useAdminLogs";

const AdminLogsPage = () => {
  const { data: logs, isLoading } = useAdminLogs();

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Logs</h1>
        <p className="text-sm text-muted-foreground">
          Review the latest important actions across the system.
        </p>
      </section>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            This list shows the latest audit log entries recorded by the backend.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading logs...</p>
          ) : !logs || logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No logs available yet.</p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {log.actorName || "Unknown user"}
                    </p>
                    <p className="text-sm text-muted-foreground">{log.actorEmail || "No email"}</p>
                    <p className="text-sm text-foreground">{log.action}</p>
                    <p className="text-sm text-muted-foreground">{log.metadata || "No details"}</p>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground md:text-right">
                    <p>Entity: {log.entityType || "unknown"}</p>
                    <p>IP: {log.ipAddress || "-"}</p>
                    <p>{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogsPage;
