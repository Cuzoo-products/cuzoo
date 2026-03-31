import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { approveFleet, getFleets, getOneFleet, fleetWalletAction, fleetAccountAction } from "./fleetApi";
import { toast } from "sonner";

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
      toast.success("Fleet approved successfully");
      if (id) queryClient.invalidateQueries({ queryKey: ["fleet", id] });
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
    },
    onError: () => {
      toast.error("Failed to approve fleet");
    },
  });
};

export const useFleetWalletAction = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: string) => fleetWalletAction(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleet", id] });
      toast.success("Fleet wallet updated successfully");
    },
    onError: () => {
      toast.error("Failed to update fleet wallet");
    },
  });
};

export const useFleetAccountAction = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: string) => fleetAccountAction(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleet", id] });
      toast.success("Fleet account updated successfully");
    },
    onError: () => {
      toast.error("Failed to update fleet account");
    },
  });
};