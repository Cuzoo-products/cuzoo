import axiosInstance from "@/api/axiosInstances";

export const getUserDetails = async () => {
  const response = await axiosInstance.get("auth");
  return response.data;
};
