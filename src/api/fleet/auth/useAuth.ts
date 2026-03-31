import { useMutation } from "@tanstack/react-query";
import { registerFleet } from "./authApi";
import { toast } from "sonner";

export const useCreateFleetManager = () => {
  return useMutation({
    mutationFn: registerFleet,
    onSuccess: () => {
      toast.success(
        "User created successfully, please check your email for verification",
      );
    },
    onError: (error) => {
      toast.error(error.message || "unable to create user, please try again.");
    },
  });
};
