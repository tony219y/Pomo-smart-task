import api from "@/api/axios";
import { AdminUser } from "../types/admin-user.types";

export const getAdminUsers = async () => {
  const response = await api.get("/users");
  return response.data as AdminUser[];
};

export const updateAdminUserRole = async (userId: number, role: string) => {
  const response = await api.patch(`/users/${userId}/role`, { role });
  return response.data;
};

export const updateAdminUserActive = async (userId: number, active: boolean) => {
  const response = await api.patch(`/users/${userId}/active`, { active });
  return response.data;
};
