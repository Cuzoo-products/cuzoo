import axiosInstance from "@/api/axiosInstances";

export const createRiders = async (driverDetails: unknown) => {
  const response = await axiosInstance.post("/fleets/riders", driverDetails);
  return response.data;
};

export const getRiders = async () => {
  const response = await axiosInstance.get("/fleets/riders");
  return response.data;
};

export const getRider = async (id: string) => {
  const response = await axiosInstance.get(`/fleets/riders/${id}`);
  return response.data;
};

export const updateRider = async (data: { id: string; data: unknown }) => {
  const response = await axiosInstance.patch(
    `/fleets/riders/${data.id}`,
    data.data
  );
  return response.data;
};
