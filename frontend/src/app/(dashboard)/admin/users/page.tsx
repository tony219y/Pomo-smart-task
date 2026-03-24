"use client";

import { useMemo } from "react";
import { Shield, UserCheck, UserCog, Users } from "lucide-react";
import SummaryCard from "@/features/dashboard/components/SummaryCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminUsers } from "@/features/admin/hooks/useAdminUsers";
import { AdminUser } from "@/features/admin/types/admin-user.types";
import { useAuth } from "@/features/auth/hooks/use-auth";

const AdminUsersPage = () => {
  const { users, isLoadingUsers, updateRole, updateActive, isUpdatingActive, isUpdatingRole } =
    useAdminUsers();
  const { useProfile } = useAuth();
  const { data: profile } = useProfile();

  const summary = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        acc.total += 1;
        if (user.role === "member") acc.members += 1;
        if (user.role === "staff") acc.staff += 1;
        if (user.role === "admin") acc.admins += 1;
        return acc;
      },
      { total: 0, members: 0, staff: 0, admins: 0 },
    );
  }, [users]);

  const handleRoleChange = async (userId: number, role: string) => {
    await updateRole({ userId, role });
  };

  const handleToggleActive = async (userId: number, active: boolean) => {
    await updateActive({ userId, active });
  };

  if (profile?.role !== "admin") {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Admin Users</h1>
        <p className="text-sm text-muted-foreground">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage user roles and account access from one simple place.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Users" value={summary.total} icon={Users} />
        <SummaryCard title="Members" value={summary.members} icon={UserCheck} />
        <SummaryCard title="Staff" value={summary.staff} icon={UserCog} />
        <SummaryCard title="Admins" value={summary.admins} icon={Shield} />
      </section>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Change user roles and activate or deactivate accounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingUsers ? (
            <p className="text-sm text-muted-foreground">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found.</p>
          ) : (
            users.map((user: AdminUser) => (
              <div
                key={user.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <p className="font-semibold text-foreground">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-2 flex gap-2">
                    <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                      {user.role}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.active
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {user.active ? "active" : "inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <select
                    defaultValue={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground"
                    disabled={isUpdatingRole || user.id === profile.id}
                  >
                    <option value="member">member</option>
                    <option value="staff">staff</option>
                    <option value="admin">admin</option>
                  </select>

                  <Button
                    type="button"
                    variant={user.active ? "destructive" : "secondary"}
                    disabled={isUpdatingActive || user.id === profile.id}
                    onClick={() => handleToggleActive(user.id, !user.active)}
                  >
                    {user.active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
