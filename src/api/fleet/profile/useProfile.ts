import { useMutation, useQuery } from "@tanstack/react-query";
import { fleetKyc, getFleetProfile } from "./profileApi";
import { toast } from "sonner";
import {
  isTimeoutLikeError,
  KYC_TIMEOUT_SOFT_MESSAGE,
} from "@/lib/imageUpload";

export const useGetFleetProfile = () => {
  return useQuery({
    queryKey: ["getFleetProfile"],
    queryFn: () => getFleetProfile(),
  });
};

export const useFleetKyc = () => {
  return useMutation({
    mutationFn: fleetKyc,
    onSuccess: () => {
      toast.success("KYC submitted successfully");
    },
    onError: (error) => {
      if (isTimeoutLikeError(error)) {
        toast.message("Still processing…", {
          description: KYC_TIMEOUT_SOFT_MESSAGE,
          duration: 12_000,
        });
        return;
      }
      const message =
        (error as { message?: string })?.message ||
        "Unable to submit KYC, please try again.";
      toast.error(message);
    },
  });
};
