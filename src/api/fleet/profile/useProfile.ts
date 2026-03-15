import { useMutation, useQuery } from "@tanstack/react-query";
import { fleetKyc, getFleetProfile } from "./profileApi";
import { toast } from "sonner";

export const useGetFleetProfile = () => {
  return useQuery({
    queryKey: ["getFleetProfile"],
    queryFn: () => getFleetProfile(),
  });
};

export const useFleetKyc = () => {
  return useMutation({
    mutationFn: fleetKyc,
    onSuccess: (data) => {
      console.log(data);
      toast.success("KYC submitted successfully");
    },
    onError: (error) => {
      const message =
        error.message || "unable to submit kyc, please try again.";
      toast.error(message);
    },
  });
};
