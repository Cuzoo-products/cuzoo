import { useMutation } from "@tanstack/react-query";
import { registerVendor, updateVendorProfile } from "./authApi";
import { toast } from "sonner";

export const useCreateVendor = () => {
  return useMutation({
    mutationFn: registerVendor,
    onSuccess: () => {
      toast.success("Vendor registered successfully");
    },
    onError: () => {
      toast.error("Failed to register vendor");
    },
  });
};

export const useUpdateVendorProfile = () => {
  return useMutation({
    mutationFn: updateVendorProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });
};
