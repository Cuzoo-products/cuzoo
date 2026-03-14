import axiosInstance from "@/api/axiosInstances";

export const getFleetDashboard = async () => {
  const response = await axiosInstance.get("fleets/dashboard");
  return response.data;
};
