import { useQuery } from "@tanstack/react-query";
import { getAdminReportSummary } from "../services/admin-report.service";

export const useAdminReport = () => {
  return useQuery({
    queryKey: ["admin-report-summary"],
    queryFn: getAdminReportSummary,
    staleTime: 1000 * 30,
  });
};
