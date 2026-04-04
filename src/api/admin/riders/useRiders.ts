import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRiders,
  getOneRider,
  riderAction,
  riderWalletAction,
  riderAccountAction,
  getRidersByFleetId,
} from "./riders";
import { toast } from "sonner";

export const useGetRiders = () => {
  return useQuery({
    queryKey: ["riders"],
    queryFn: () => getRiders(),
  });
};

export const useGetOneRider = (id: string) => {
  return useQuery({
    queryKey: ["rider", id],
    queryFn: () => getOneRider(id),
  });
};

export const useRiderAction = (id: string, action: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => riderAction(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rider", id] });
      toast.success(`Rider ${action}d successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "Failed to update rider.");
    },
  });
};


export const useRiderWalletAction = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: string) => riderWalletAction(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rider", id] });
      toast.success(`Rider wallet updated successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "Failed to update rider wallet.");
    },
  });
};

export const useRiderAccountAction = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: string) => riderAccountAction(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rider", id] });
      toast.success(`Rider account updated successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "Failed to update rider account.");
    },
  });
};

export const useGetRidersByFleetId = (fleetId: string | undefined) => {
  const safe =
    fleetId && fleetId !== "" && fleetId !== "undefined" && fleetId !== "null"
      ? fleetId
      : undefined;
  return useQuery({
    queryKey: ["riders-by-fleet", safe],
    queryFn: () => getRidersByFleetId(safe as string),
    enabled: Boolean(safe),
  });
};