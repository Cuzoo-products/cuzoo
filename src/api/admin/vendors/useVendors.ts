import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getVendors,
  getVendor,
  approveVendor,
  vendorWalletAction,
  vendorAccountAction,
} from "./vendorsApi";
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

export const useVendorWalletAction = (vendorId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: string) => vendorWalletAction(vendorId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", vendorId] });
      toast.success("Vendor wallet updated successfully");
    },
    onError: () => {
      toast.error("Failed to update vendor wallet");
    },
  });
};

export const useVendorAccountAction = (vendorId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: string) => vendorAccountAction(vendorId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", vendorId] });
      toast.success("Vendor account updated successfully");
    },
    onError: () => {
      toast.error("Failed to update vendor account");
    },
  });
};
