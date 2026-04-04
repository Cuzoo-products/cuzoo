import axiosInstance from "@/api/axiosInstances";

export const getVehicles = async () => {
  const response = await axiosInstance.get("/admins/vehicles");
  return response.data;
};

export const getVehicle = async (id: string) => {
  const response = await axiosInstance.get(`/admins/vehicles/${id}`);
  return response.data;
};
