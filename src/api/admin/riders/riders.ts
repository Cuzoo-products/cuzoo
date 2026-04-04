import axiosInstance from "@/api/axiosInstances";

export const getRiders = async () => {
  const response = await axiosInstance.get("/riders");
  return response.data;
};

export const getOneRider = async (id: string) => {
  const response = await axiosInstance.get(`/riders/${id}`);
  return response.data;
};

export const riderAction = async (id: string, action: string) => {
  const response = await axiosInstance.patch(`/riders/${id}/${action}`);
  return response.data;
};

export const riderWalletAction = async (id: string, action: string) => {
  const response = await axiosInstance.patch(`/riders/${id}/wallet`, {
    action,
  });
  return response.data;
};

export const riderAccountAction = async (id: string, action: string) => {
  const response = await axiosInstance.patch(`/riders/${id}/account`, {
    action,
  });
  return response.data;
};

export const getRidersByFleetId = async (fleetId: string) => {
  const response = await axiosInstance.get(
    `/riders?companyId=${encodeURIComponent(fleetId)}`,
  );
  return response.data;
};

/** Parses `{ data: { count, lastCursor, limit, data: riders[] } }` from list endpoints. */
export function parseRidersListPayload(
  payload: unknown,
): Record<string, unknown>[] {
  if (payload == null || typeof payload !== "object") return [];
  const root = payload as { data?: unknown };
  const wrap = root.data;
  if (wrap == null || typeof wrap !== "object") return [];
  const inner = (wrap as { data?: unknown }).data;
  if (!Array.isArray(inner)) return [];
  return inner.filter((x) => x != null && typeof x === "object") as Record<
    string,
    unknown
  >[];
}
