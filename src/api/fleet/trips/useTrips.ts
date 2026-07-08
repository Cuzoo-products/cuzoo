import { useQuery } from "@tanstack/react-query";
import {
  getFleetTripById,
  getFleetTrips,
  type GetFleetTripsParams,
} from "./tripsApi";

export const useGetFleetTrips = (params?: GetFleetTripsParams) => {
  return useQuery({
    queryKey: ["getFleetTrips", params],
    queryFn: () => getFleetTrips(params),
  });
};

export const useGetFleetTripById = (id: string) => {
  return useQuery({
    queryKey: ["getFleetTripById", id],
    queryFn: () => getFleetTripById(id),
    enabled: Boolean(id),
  });
};
