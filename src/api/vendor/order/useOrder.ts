import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { confirmPickup, getOrder, getOrders, processOrder } from "./order";
import { toast } from "sonner";

export const useGetOrders = () => {
  return useQuery({
    queryKey: ["getOrders"],
    queryFn: getOrders,
  });
};

export const useGetOrder = (id: string) => {
  return useQuery({
    queryKey: ["getOrder", id],
    queryFn: () => getOrder(id),
  });
};

export const useProcessOrder = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => processOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getOrder", id] });
      toast.success("Order processed successfully");
    },
    onError: () => {
      toast.error("Failed to process order");
    },
  });
};

export const useConfirmPickup = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ otp }: { otp: string }) => confirmPickup(id, { otp }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getOrder", id] });
      toast.success("Pickup confirmed successfully");
    },
    onError: () => {
      toast.error("Failed to confirm pickup");
    },
  });
};
