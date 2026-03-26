import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "./dashboard";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });
};
