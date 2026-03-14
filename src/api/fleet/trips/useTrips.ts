import { useQuery } from "@tanstack/react-query";
import { getFleetTripById, getFleetTrips } from "./tripsApi";

export const useGetFleetTrips = () => {
  return useQuery({
    queryKey: ["getFleetTrips"],
    queryFn: getFleetTrips,
  });
};

export const useGetFleetTripById = (id: string) => {
  return useQuery({
    queryKey: ["getFleetTripById", id],
    queryFn: () => getFleetTripById(id),
  });
};
