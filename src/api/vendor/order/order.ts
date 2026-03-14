import axiosInstance from "@/api/axiosInstances";

export const getOrders = async () => {
  const response = await axiosInstance.get("/vendors/orders");
  return response.data;
};

export const getOrder = async (id: string) => {
  const response = await axiosInstance.get(`/vendors/orders/${id}`);
  return response.data;
};

export const processOrder = async (id: string) => {
  const response = await axiosInstance.put(`/vendors/orders/${id}/process`);
  return response.data;
};

export const requestOTP = async (id: string) => {
  const response = await axiosInstance.put(`/vendors/orders/${id}/request-otp`);
  return response.data;
};

export const confirmPickup = async (id: string, data: { otp: string }) => {
  const response = await axiosInstance.put(
    `/vendors/orders/${id}/confirm-pickup`,
    data,
  );
  return response.data;
};
