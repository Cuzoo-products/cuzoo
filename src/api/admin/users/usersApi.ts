import axiosInstance from "../../axiosInstances";

export const getUser = async (id: string) => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};

export const getUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

export const userWalletAction = async (id: string, action: string) => {
  const response = await axiosInstance.patch(`/users/${id}/wallet`, { action });
  return response.data;
};

export const userAccountAction = async (id: string, action: string) => {
  const response = await axiosInstance.patch(`/users/${id}/account`, { action });
  return response.data;
};