import { useQuery } from "@tanstack/react-query";
import { getStaffReportSummary } from "../services/staff-report.service";

export const useStaffReport = () => {
  return useQuery({
    queryKey: ["staff-report-summary"],
    queryFn: getStaffReportSummary,
    staleTime: 1000 * 30,
  });
};
