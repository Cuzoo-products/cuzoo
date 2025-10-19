import axiosInstance from "@/api/axiosInstances";

export const registerVendor = async (userData: unknown) => {
  const response = await axiosInstance.post("auth/vendor", userData);
  return response.data;
};
