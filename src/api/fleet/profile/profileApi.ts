import axiosInstance from "@/api/axiosInstances";

export const getFleetProfile = async () => {
  const response = await axiosInstance.get("fleets/auth");
  return response.data;
};

export const fleetKyc = async (fleetData: any) => {
  const response = await axiosInstance.patch("fleets/auth", fleetData);
  return response.data;
};
