import axiosInstance from "@/api/axiosInstances";

export const registerVendor = async (userData: unknown) => {
  const response = await axiosInstance.post("auth/vendor", userData);
  return response.data;
};

export const updateVendorProfile = async (userData: unknown) => {
  const response = await axiosInstance.patch("vendors/auth", userData);
  return response.data;
};

export const getVendorProfile = async () => {
  const response = await axiosInstance.get("vendors/auth");
  return response.data;
};
