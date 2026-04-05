import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getVendorProfile,
  registerVendor,
  updateVendorProfile,
} from "./authApi";
import { toast } from "sonner";

export const useCreateVendor = () => {
  return useMutation({
    mutationFn: registerVendor,
    onSuccess: () => {
      toast.success("Vendor registered successfully");
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
};

export const useUpdateVendorProfile = () => {
  return useMutation({
    mutationFn: updateVendorProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (e) => {
      toast.error(e.message || "Failed to update profile");
    },
  });
};

export const useGetVendorProfile = () => {
  return useQuery({
    queryKey: ["vendor-profile"],
    queryFn: getVendorProfile,
  });
};
