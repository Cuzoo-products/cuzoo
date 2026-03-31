import axiosInstance from "@/api/axiosInstances";

export const getOrdersForAdmin = async (orderTypes) => {
  const response = await axiosInstance.get(`/admins/orders?orderType=${orderTypes}`);
  return response.data;
};

export const getOrderForAdmin = async (id: string) => {
  const response = await axiosInstance.get(`/admins/orders/${id}`);
  return response.data;
};
