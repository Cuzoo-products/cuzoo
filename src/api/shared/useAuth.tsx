import { useMutation, useQuery } from "@tanstack/react-query";
import {
  forgotPassword,
  getUserDetails,
  resetPassword,
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
      toast.error(error.message || "Failed to send verification mail");
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
      toast.error(error.message || "Failed to verify email, please try again");
    },
  });
};

export const useVerifyEmailToken = (token: string) => {
  return useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: () => verifyEmail(token),
    enabled: Boolean(token),
    retry: false,
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
      toast.error(error.message || "Failed to send password reset email");
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      token,
      password,
      confirmPassword,
    }: {
      token: string;
      password: string;
      confirmPassword: string;
    }) => resetPassword(token, { password, confirmPassword }),
  });
};
