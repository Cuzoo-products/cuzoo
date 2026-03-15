import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { approveFleet, getFleets, getOneFleet } from "./fleetApi";

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

export const useApproveFleet = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => approveFleet(id!),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: ["fleet", id] });
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
    },
  });
};
