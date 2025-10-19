import axiosInstance from "@/api/axiosInstances";

export const registerFleet = async (userData: unknown) => {
  const response = await axiosInstance.post("auth/fleet", userData);
  return response.data;
};
