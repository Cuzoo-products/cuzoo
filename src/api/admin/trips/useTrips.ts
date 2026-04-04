import { useQuery } from "@tanstack/react-query";
import { getAdminTrips } from "./trips";

export const useGetAdminTrips = () => {
  return useQuery({
    queryKey: ["admin-trips"],
    queryFn: () => getAdminTrips(),
  });
};
