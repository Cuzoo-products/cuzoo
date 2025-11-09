import axiosInstance from "@/api/axiosInstances";

export const getFleets = async () => {
  const response = await axiosInstance.get("/fleets");
  return response.data;
};

export const getOneFleet = async (id: string) => {
  const response = await axiosInstance.get(`/fleets/${id}`);
  return response.data;
};
