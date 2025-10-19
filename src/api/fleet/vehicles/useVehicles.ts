import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addVehicles,
  getVehicle,
  getVehicles,
  updateVehicle,
} from "./vehiclesApi";
import { toast } from "sonner";

export const useGetVehicles = () => {
  return useQuery({
    queryKey: ["getVehicles"],
    queryFn: () => getVehicles(),
  });
};

export const useGetVehicle = (id: string) => {
  return useQuery({
    queryKey: ["getVehicle"],
    queryFn: () => getVehicle(id),
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
    onError: () => {
      toast.error("Failed to add vehicle!");
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
    onError: () => {
      toast.error("Failed to update vehicle!");
    },
  });
};
