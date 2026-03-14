import axiosInstance from "@/api/axiosInstances";

export const getDashboard = async () => {
  const response = await axiosInstance.get("/vendors/dashboard");
  return response.data;
};
