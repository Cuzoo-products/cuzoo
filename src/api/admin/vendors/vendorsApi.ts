import axiosInstance from "@/api/axiosInstances";

export const getVendors = async () => {
  const response = await axiosInstance.get("/vendors");
  return response.data;
};

export const getVendor = async (vendorId: string) => {
  const response = await axiosInstance.get(`/vendors/${vendorId}`);
  return response.data;
};

export const approveVendor = async (id: string) => {
  const response = await axiosInstance.patch(`/vendors/${id}/approve`);
  return response.data;
};

export const vendorWalletAction = async (id: string, action: string) => {
  const response = await axiosInstance.patch(`/vendors/${id}/wallet`, { action });
  return response.data;
};

export const vendorAccountAction = async (id: string, action: string) => {
  const response = await axiosInstance.patch(`/vendors/${id}/account`, { action });
  return response.data;
};