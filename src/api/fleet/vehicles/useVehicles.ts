import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addVehicles,
  getVehicle,
  getVehicles,
  updateVehicle,
  type GetFleetVehiclesParams,
} from "./vehiclesApi";
import { toast } from "sonner";

export const useGetVehicles = (params?: GetFleetVehiclesParams) => {
  return useQuery({
    queryKey: ["getVehicles", params],
    queryFn: () => getVehicles(params),
  });
};

export const useGetVehicle = (id: string) => {
  return useQuery({
    queryKey: ["getVehicle", id],
    queryFn: () => getVehicle(id),
    enabled: Boolean(id),
  });
};

export const useAddVehicles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addVehicles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getVehicles"] });
      toast.success("Vehicle added successfully!");
    },
    onError: (e) => {
      toast.error(e.message || "Failed to add vehicle!");
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getVehicle"] });
      queryClient.invalidateQueries({ queryKey: ["getVehicles"] });
      toast.success("Vehicle updated successfully!");
    },
    onError: (e) => {
      toast.error(e.message || "Failed to update vehicle!");
    },
  });
};
