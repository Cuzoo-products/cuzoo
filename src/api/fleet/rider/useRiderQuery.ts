import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRiders, getRider, getRiders, updateRider } from "./riderApi";
import { toast } from "sonner";

export const useGetRiders = () => {
  return useQuery({
    queryKey: ["getRiders"],
    queryFn: () => getRiders(),
  });
};

export const useGetRider = (id: string) => {
  return useQuery({
    queryKey: ["getRider", id],
    queryFn: () => getRider(id),
  });
};

export const useCreateRiders = () => {
  return useMutation({
    mutationFn: createRiders,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Riders created successfully");
    },
    onError: (error) => {
      const message =
        error.message || "unable to create riders, please try again.";
      console.log(message);
      toast.error(message);
    },
  });
};

export const useUpdateRider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRider,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["getRiders"] });
      // queryClient.invalidateQueries({ queryKey: ["getRider", data.id] });
      toast.success("Rider updated successfully");
    },
    onError: (error) => {
      const message =
        error.message || "unable to update rider, please try again.";
      console.log(message);
      toast.error(message);
    },
  });
};
