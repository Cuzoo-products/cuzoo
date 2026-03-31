import axiosInstance from "@/api/axiosInstances";

export const getUserDetails = async () => {
  const response = await axiosInstance.get("auth");
  return response.data;
};

export const sendVerificationMail = async (data: {
  email: string;
  accountType: string;
}) => {
  const response = await axiosInstance.post(
    "auth/send-verification-mail",
    data,
  );
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await axiosInstance.get(`auth/verify-email?token=${token}`);
  return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await axiosInstance.post("auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (
  token: string,
  data: {
    password: string;
    confirmPassword: string;
  },
) => {
  const response = await axiosInstance.post(
    `auth/reset-password?token=${token}`,
    data,
  );
  return response.data;
};
