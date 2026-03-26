import axiosInstance from "@/api/axiosInstances";

export const getAdminDashboard = async () => {
  const response = await axiosInstance.get("/admins/dashboard");
  return response.data;
};
