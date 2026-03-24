"use client";

import { useQuery } from "@tanstack/react-query";
import { getReportSummary } from "../services/report.service";

export const useReportSummary = () => {
  return useQuery({
    queryKey: ["report-summary"],
    queryFn: getReportSummary,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};
