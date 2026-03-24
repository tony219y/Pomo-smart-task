import api from "@/api/axios";
import { AdminReportSummary } from "../types/admin-report.types";

export const getAdminReportSummary = async () => {
  const response = await api.get("/admin/reports");
  return response.data as AdminReportSummary;
};
