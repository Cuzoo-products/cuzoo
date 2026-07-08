import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCoupon,
  getCoupons,
  type GetVendorCouponsParams,
} from "./coupon";

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      toast.success("Coupon created successfully");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (e) => {
      toast.error(e.message || "Failed to create coupon");
    },
  });
};

export const useGetCoupons = (params?: GetVendorCouponsParams) => {
  return useQuery({
    queryKey: ["coupons", params],
    queryFn: () => getCoupons(params),
  });
};
