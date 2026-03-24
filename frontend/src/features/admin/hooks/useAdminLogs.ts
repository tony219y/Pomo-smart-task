import { useQuery } from "@tanstack/react-query";
import { getAdminLogs } from "../services/admin-log.service";

export const useAdminLogs = () => {
  return useQuery({
    queryKey: ["admin-logs"],
    queryFn: getAdminLogs,
    staleTime: 1000 * 30,
  });
};
