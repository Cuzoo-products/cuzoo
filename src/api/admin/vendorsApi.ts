import axiosInstance from "../axiosInstances";

export const getVendors = async () => {
  const response = await axiosInstance.get("/vendors");
  return response.data;
};

export const getVendor = async (vendorId: string) => {
  const response = await axiosInstance.get(`/vendors/${vendorId}`);
  return response.data;
};
