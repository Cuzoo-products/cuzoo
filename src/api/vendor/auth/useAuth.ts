import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getVendorProfile,
  registerVendor,
  updateVendorProfile,
} from "./authApi";
import { toast } from "sonner";
import {
  isTimeoutLikeError,
  KYC_TIMEOUT_SOFT_MESSAGE,
} from "@/lib/imageUpload";

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
      if (isTimeoutLikeError(e)) {
        toast.message("Still processing…", {
          description: KYC_TIMEOUT_SOFT_MESSAGE,
          duration: 12_000,
        });
        return;
      }
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
