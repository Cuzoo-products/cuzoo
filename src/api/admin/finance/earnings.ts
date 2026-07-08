import axiosInstance from "@/api/axiosInstances";

export type AdminEarnings = {
  totalRevenue: number;
  platformEarnings: number;
  vendorEarnings: number;
  riderEarnings: number;
  fleetEarnings: number;
};

export const getAdminEarnings = async () => {
  const response = await axiosInstance.get("/admins/earnings");
  return response.data;
};

export function parseAdminEarnings(payload: unknown): AdminEarnings | null {
  if (payload == null || typeof payload !== "object") return null;
  const root = payload as { data?: unknown };
  const data = root.data;
  if (data == null || typeof data !== "object") return null;

  const row = data as Record<string, unknown>;

  return {
    totalRevenue: Number(row.totalRevenue ?? 0) || 0,
    platformEarnings: Number(row.platformEarnings ?? 0) || 0,
    vendorEarnings: Number(row.vendorEarnings ?? 0) || 0,
    riderEarnings: Number(row.riderEarnings ?? 0) || 0,
    fleetEarnings: Number(row.fleetEarnings ?? 0) || 0,
  };
}
