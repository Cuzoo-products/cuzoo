import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { confirmPickup, getOrder, getOrders, processOrder, requestOtp } from "./order";
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
    onError: (e) => {
      toast.error(e.message || "Failed to process order");
    },
  });
};

export const useRequestOtp = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => requestOtp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getOrder", id] });
      toast.success("OTP generated. Share it with the rider.");
    },
    onError: (e) => {
      toast.error(e.message || "Failed to request OTP");
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
    onError: (e) => {
      toast.error(e.message || "Failed to confirm pickup");
    },
  });
};
