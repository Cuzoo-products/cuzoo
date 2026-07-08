import { useQuery } from "@tanstack/react-query";
import { getAdminTrips, type GetAdminTripsParams } from "./trips";

export const useGetAdminTrips = (params?: GetAdminTripsParams) => {
  return useQuery({
    queryKey: ["admin-trips", params],
    queryFn: () => getAdminTrips(params),
  });
};
