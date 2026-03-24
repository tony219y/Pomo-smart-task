import api from "@/api/axios";
import { AdminLog } from "../types/admin-log.types";

export const getAdminLogs = async () => {
  const response = await api.get("/admin/logs");
  return response.data as AdminLog[];
};
