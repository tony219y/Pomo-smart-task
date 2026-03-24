"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminUsers,
  updateAdminUserActive,
  updateAdminUserRole,
} from "../services/admin-user.service";

export const useAdminUsers = () => {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      updateAdminUserRole(userId, role),
    onSuccess: () => {
      toast.success("User role updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const activeMutation = useMutation({
    mutationFn: ({ userId, active }: { userId: number; active: boolean }) =>
      updateAdminUserActive(userId, active),
    onSuccess: (_, variables) => {
      toast.success(variables.active ? "User activated" : "User deactivated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  return {
    users: usersQuery.data ?? [],
    isLoadingUsers: usersQuery.isLoading,
    updateRole: roleMutation.mutateAsync,
    updateActive: activeMutation.mutateAsync,
    isUpdatingRole: roleMutation.isPending,
    isUpdatingActive: activeMutation.isPending,
  };
};
