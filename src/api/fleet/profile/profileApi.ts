import axiosInstance, {
  KYC_REQUEST_TIMEOUT_MS,
} from "@/api/axiosInstances";
import type { fleetKycformSchema } from "@/lib/zodVaildation";
import type { z } from "zod";

export const getFleetProfile = async () => {
  const response = await axiosInstance.get("fleets/auth");
  return response.data;
};

export const fleetKyc = async (
  fleetData: z.infer<typeof fleetKycformSchema>,
) => {
  const response = await axiosInstance.patch("fleets/auth", fleetData, {
    timeout: KYC_REQUEST_TIMEOUT_MS,
  });
  return response.data;
};
