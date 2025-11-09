import axiosInstance from "../axiosInstances";

export const createAdmin = async (adminData: unknown) => {
  const response = await axiosInstance.post("/admins", adminData);
  return response.data;
};

export const getAdmin = async (id: string) => {
  const response = await axiosInstance.get(`/admins/${id}`);
  return response.data;
};

export const toggleReleaseAdmin = async ({
  id,
  release,
}: {
  id: string;
  release: string;
}) => {
  const response = await axiosInstance.post(`/admins/${id}/${release}`);
  return response.data;
};

export const getAllAdmins = async () => {
  const response = await axiosInstance.get("/admins");
  return response.data;
};
