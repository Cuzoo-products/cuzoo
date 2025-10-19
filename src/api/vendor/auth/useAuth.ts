import { useMutation } from "@tanstack/react-query";
import { registerVendor } from "./authApi";
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
