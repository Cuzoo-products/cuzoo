import axiosInstance from "../axiosInstances";

export const getUser = async (id: string) => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};

export const getUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};
