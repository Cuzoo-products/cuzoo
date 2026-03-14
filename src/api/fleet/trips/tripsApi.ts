import axiosInstance from "@/api/axiosInstances";

export const getFleetTrips = async () => {
  const response = await axiosInstance.get("fleets/trips");
  return response.data;
};

export const getFleetTripById = async (id: string) => {
  const response = await axiosInstance.get(`fleets/trips/${id}`);
  return response.data;
};
