import axiosInstance from "@/api/axiosInstances";

export const getVendorsPayouts = async () => {
  const response = await axiosInstance.get("/admins/vendors/payouts");
  return response.data;
};

export const getVendorPayout = async (id: string) => {
  const response = await axiosInstance.get(`/admins/vendors/payouts/${id}`);
  return response.data;
};

export const rejectVendorPayout = async (
  id: string,
  reason: { reason: string },
) => {
  const response = await axiosInstance.post(
    `/admins/vendors/payouts/${id}/reject`,
    reason,
  );
  return response.data;
};

export const approveVendorPayout = async (id: string) => {
  const response = await axiosInstance.post(
    `/admins/vendors/payouts/${id}/approve`,
  );
  return response.data;
};

export const getFleetsPayouts = async () => {
  const response = await axiosInstance.get("/admins/fleets/payouts");
  return response.data;
};

export const getFleetPayout = async (id: string) => {
  const response = await axiosInstance.get(`/admins/fleets/payouts/${id}`);
  return response.data;
};

export const rejectFleetPayout = async (
  id: string,
  reason: { reason: string },
) => {
  const response = await axiosInstance.post(
    `/admins/fleets/payouts/${id}/reject`,
    reason,
  );
  return response.data;
};

export const approveFleetPayout = async (id: string) => {
  const response = await axiosInstance.post(
    `/admins/fleets/payouts/${id}/approve`,
  );
  return response.data;
};

export const getRidersPayouts = async () => {
  const response = await axiosInstance.get("/admins/riders/payouts");
  return response.data;
};

export const getRiderPayout = async (id: string) => {
  const response = await axiosInstance.get(`/admins/riders/payouts/${id}`);
  return response.data;
};

export const rejectRiderPayout = async (
  id: string,
  reason: { reason: string },
) => {
  const response = await axiosInstance.post(
    `/admins/riders/payouts/${id}/reject`,
    reason,
  );
  return response.data;
};

export const approveRiderPayout = async (id: string) => {
  const response = await axiosInstance.post(
    `/admins/riders/payouts/${id}/approve`,
  );
  return response.data;
};
