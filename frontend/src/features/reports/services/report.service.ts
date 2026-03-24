import api from "@/api/axios";
import { ReportSummary } from "../types/report.types";

export const getReportSummary = async () => {
  const response = await api.get("/reports/summary");
  return response.data as ReportSummary;
};
