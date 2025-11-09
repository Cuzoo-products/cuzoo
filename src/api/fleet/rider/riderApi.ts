import axiosInstance from "@/api/axiosInstances";

export const createRiders = async (driverDetails: any) => {
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

export const updateRider = async (id: string, riderDetails: any) => {
  const response = await axiosInstance.patch(
    `/fleets/riders/${id}`,
    riderDetails
  );
  return response.data;
};
