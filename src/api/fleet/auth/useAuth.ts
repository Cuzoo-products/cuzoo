import { useMutation } from "@tanstack/react-query";
import { registerFleet } from "./authApi";

export const useCreateFleetManager = () => {
  return useMutation({
    mutationFn: registerFleet,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      const message =
        error.message || "unable to create user, please try again.";
      console.log(message);
    },
  });
};
