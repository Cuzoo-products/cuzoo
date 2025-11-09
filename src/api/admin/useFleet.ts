import { useQuery } from "@tanstack/react-query";
import { getFleets, getOneFleet } from "./fleetApi";

export const useGetOneFleet = (id: string) => {
  return useQuery({
    queryKey: ["fleet", id],
    queryFn: () => getOneFleet(id),
  });
};

export const useGetAllFleets = () => {
  return useQuery({
    queryKey: ["fleets"],
    queryFn: () => getFleets(),
  });
};
