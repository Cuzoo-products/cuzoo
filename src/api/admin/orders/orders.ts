import axiosInstance from "@/api/axiosInstances";

export const getOrdersForAdmin = async () => {
  const response = await axiosInstance.get("/admins/orders");
  return response.data;
};

export const getOrderForAdmin = async (id: string) => {
  const response = await axiosInstance.get(`/admins/orders/${id}`);
  return response.data;
};
