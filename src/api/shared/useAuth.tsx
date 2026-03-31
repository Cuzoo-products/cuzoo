import { useMutation, useQuery } from "@tanstack/react-query";
import {
  forgotPassword,
  getUserDetails,
  sendVerificationMail,
  verifyEmail,
} from "./auth";
import type { User } from "firebase/auth";
import { toast } from "sonner";

export const useGetUserDetails = (user: User | null) => {
  return useQuery({
    queryKey: ["getUserDetails", user?.uid],
    queryFn: () => getUserDetails(),
    enabled: !!user,
  });
};

export const useSendVerificationMail = () => {
  return useMutation({
    mutationFn: (data: { email: string; accountType: string }) =>
      sendVerificationMail(data),
    onSuccess: () => {
      toast.success(
        "Verification mail sent successfully, check your email for verifications",
      );
    },
    onError: (error) => {
      toast.error("Failed to send verification mail", {
        description: error.message,
      });
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
    onSuccess: () => {
      toast.success("Email verified successfully, you can now login");
    },
    onError: (error) => {
      toast.error("Failed to verify email, please try again", {
        description: error.message,
      });
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => forgotPassword(data),
    onSuccess: () => {
      toast.success(
        "Password reset email sent successfully, check your email for password reset",
      );
    },
    onError: (error) => {
      toast.error("Failed to send password reset email", {
        description: error.message,
      });
    },
  });
};
