import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVendors, getVendor, approveVendor } from "./vendorsApi";
import { toast } from "sonner";

export const useVendors = () => {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: () => getVendors(),
  });
};

export const useGetVendor = (vendorId: string) => {
  return useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: () => getVendor(vendorId),
  });
};

export const useApproveVendor = (vendorId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", vendorId] });
      toast.success("Vendor approved successfully");
    },
    onError: () => {
      toast.error("Failed to approve vendor");
    },
  });
};
