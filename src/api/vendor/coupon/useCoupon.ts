import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCoupon, getCoupons } from "./coupon";

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      toast.success("Coupon created successfully");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: () => {
      toast.error("Failed to create coupon");
    },
  });
};

export const useGetCoupons = () => {
  return useQuery({
    queryKey: ["coupons"],
    queryFn: getCoupons,
  });
};
