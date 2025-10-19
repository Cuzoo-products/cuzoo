import axiosInstance from "@/api/axiosInstances";

export const getVehicles = async () => {
  const response = await axiosInstance.get("/fleets/vehicles");
  return response.data;
};

export const addVehicles = async (vehicleData: any) => {
  const response = await axiosInstance.post("/fleets/vehicles", vehicleData);
  return response.data;
};

export const getVehicle = async (id: string) => {
  const response = await axiosInstance.get(`fleets/vehicles/${id}`);
  return response.data;
};

export const updateVehicle = async (id: string, vehicleData: any) => {
  const response = await axiosInstance.patch(
    `fleets/vehicles/${id}`,
    vehicleData
  );
  return response.data;
};
