import axiosInstance from "@/api/axiosInstances";

export const getOrdersForAdmin = async (orderTypes: string) => {
  const response = await axiosInstance.get(
    `/admins/orders?orderType=${encodeURIComponent(orderTypes)}`,
  );
  return response.data;
};

export const getOrderForAdmin = async (id: string) => {
  const response = await axiosInstance.get(`/admins/orders/${id}`);
  return response.data;
};


/**
 * Lists orders for a user. Omit `orderType` to include mixed types (e.g. Shopping + Package).
 */
export const getOrdersForAdminByUserId = async (
  userId: string,
  orderType?: string,
) => {
  const params = new URLSearchParams();
  params.set("userId", userId);
  if (orderType) {
    params.set("orderType", orderType);
  }
  const response = await axiosInstance.get(`/admins/orders?${params.toString()}`);
  return response.data;
};


export const getOrderForAdminByFleetId = async (orderType: string, fleetId: string) => {
  const response = await axiosInstance.get(`/admins/orders?orderType=${encodeURIComponent(orderType)}&companyId=${encodeURIComponent(fleetId)}`);
  return response.data;
};

export const getOrdersForAdminByVendorId = async (orderType: string, vendorId: string) => {
  const response = await axiosInstance.get(`/admins/orders?orderType=${encodeURIComponent(orderType)}&vendorId=${encodeURIComponent(vendorId)}`);
  return response.data;
};


export const getOrdersForAdminByRiderId = async (orderType: string, riderId: string) => {
  const response = await axiosInstance.get(`/admins/orders?orderType=${encodeURIComponent(orderType)}&riderId=${encodeURIComponent(riderId)}`);
  return response.data;
};