import axiosInstance from "@/api/axiosInstances";

export const getFleets = async () => {
  const response = await axiosInstance.get("/fleets");
  return response.data;
};

export const getOneFleet = async (id: string) => {
  const response = await axiosInstance.get(`/fleets/${id}`);
  return response.data;
};

export const approveFleet = async (id: string) => {
  const response = await axiosInstance.patch(`/fleets/${id}/approve`);
  return response.data;
};

export const fleetWalletAction = async (id: string, action: string) => {
  const response = await axiosInstance.patch(`/fleets/${id}/wallet`, { action });
  return response.data;
};

export const fleetAccountAction = async (id: string, action: string) => {
  const response = await axiosInstance.patch(`/fleets/${id}/account`, { action });
  return response.data;
};