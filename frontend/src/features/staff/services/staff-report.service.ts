import api from "@/api/axios";
import { StaffReportSummary } from "../types/staff-report.types";

export const getStaffReportSummary = async () => {
  const response = await api.get("/reports/team-summary");
  return response.data as StaffReportSummary;
};
