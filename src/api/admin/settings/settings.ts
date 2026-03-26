import axiosInstance from "@/api/axiosInstances";

export type GeneralSetting = {
  pricingPerKm: {
    car: number;
    van: number;
    truck: number;
    bike: number;
    bicycle: number;
    rickshaw: number;
  };
  lockAllWallet: boolean;
  lockAllRidersWallet: boolean;
  lockAllVendorsWallet: boolean;
  lockAllUsersWallet: boolean;
  lockAllFleetManagersWallet: boolean;
  maintenanceMode: boolean;
  fleetCommission: number;
  vendorCommission: number;
  riderCommission: number;
  searchRadius: number;
};

export const getGeneralSetting = async () => {
  const response = await axiosInstance.get("/settings");
  return response.data;
};

export const updateGeneralSetting = async (data: GeneralSetting) => {
  const response = await axiosInstance.put("/settings", data);
  return response.data;
};
