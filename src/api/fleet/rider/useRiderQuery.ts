import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRiders,
  getRider,
  getRiders,
  releaseRider,
  suspendRider,
  updateRider,
  type GetFleetRidersParams,
} from "./riderApi";
import { toast } from "sonner";

export const useGetRiders = (params?: GetFleetRidersParams) => {
  return useQuery({
    queryKey: ["getRiders", params],
    queryFn: () => getRiders(params),
  });
};

export const useGetRider = (id: string | undefined) => {
  const safe = id?.trim() ?? "";
  return useQuery({
    queryKey: ["getRider", safe],
    queryFn: () => getRider(safe),
    enabled: safe.length > 0,
  });
};

export const useCreateRiders = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRiders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getRiders"] });
    },
    onError: (error) => {
      const message =
        error.message || "unable to create riders, please try again.";
      toast.error(message);
    },
  });
};

export const useUpdateRider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getRiders"] });
      // queryClient.invalidateQueries({ queryKey: ["getRider", data.id] });
      toast.success("Rider updated successfully");
    },
    onError: (error) => {
      const message =
        error.message || "unable to update rider, please try again.";
      toast.error(message);
    },
  });
};

export const useReleaseRider = () => {
  return useMutation({
    mutationFn: releaseRider,
    onSuccess: () => {
      toast.success("Rider released successfully");
    },
    onError: (error) => {
      const message =
        error.message || "unable to release rider, please try again.";
      toast.error(message);
    },
  });
};

export const useSuspendRider = () => {
  return useMutation({
    mutationFn: suspendRider,
    onSuccess: () => {
      toast.success("Rider suspended successfully");
    },
    onError: (error) => {
      const message =
        error.message || "unable to suspend rider, please try again.";
      toast.error(message);
    },
  });
};
