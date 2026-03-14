import { useQuery } from "@tanstack/react-query";
import { getFleetDashboard } from "./dashboardApi";

export const useGetFleetDashboard = () => {
  return useQuery({
    queryKey: ["getFleetDashboard"],
    queryFn: getFleetDashboard,
  });
};
