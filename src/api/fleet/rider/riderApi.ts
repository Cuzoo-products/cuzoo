import axiosInstance from "@/api/axiosInstances";

export type FleetRiderGender = "Male" | "Female" | "Others";

export type GetFleetRidersParams = {
  suspended?: boolean;
  gender?: FleetRiderGender;
  from?: string;
  to?: string;
  cursor?: number | string;
  limit?: number;
};

export type FleetRidersListMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

function buildFleetRidersQueryParams(params?: GetFleetRidersParams) {
  if (!params) return undefined;

  const query: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query[key] = value;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

export function parseFleetRidersListMeta(
  payload: unknown,
): FleetRidersListMeta | null {
  if (payload == null || typeof payload !== "object") return null;
  const root = payload as { data?: unknown };
  const wrap = root.data;
  if (wrap == null || typeof wrap !== "object" || Array.isArray(wrap)) {
    return null;
  }
  const meta = wrap as {
    count?: number;
    lastCursor?: number | string | null;
    limit?: number;
  };

  return {
    count: meta.count ?? 0,
    lastCursor: meta.lastCursor ?? null,
    limit: meta.limit ?? 0,
  };
}

export function parseFleetRidersListPayload(
  payload: unknown,
): Record<string, unknown>[] {
  if (payload == null || typeof payload !== "object") return [];
  const root = payload as { data?: unknown };
  const wrap = root.data;
  if (wrap == null) return [];
  if (Array.isArray(wrap)) return wrap as Record<string, unknown>[];
  if (typeof wrap === "object") {
    const inner = (wrap as { data?: unknown }).data;
    if (Array.isArray(inner)) return inner as Record<string, unknown>[];
  }
  return [];
}

export const createRiders = async (driverDetails: unknown) => {
  const response = await axiosInstance.post("/fleets/riders", driverDetails);
  return response.data;
};

export const getRiders = async (params?: GetFleetRidersParams) => {
  const response = await axiosInstance.get("/fleets/riders", {
    params: buildFleetRidersQueryParams(params),
  });
  return response.data;
};

export const getRider = async (id: string) => {
  const response = await axiosInstance.get(`/fleets/riders/${id}`);
  return response.data;
};

export const updateRider = async (data: { id: string; data: unknown }) => {
  const response = await axiosInstance.patch(
    `/fleets/riders/${data.id}`,
    data.data,
  );
  return response.data;
};

export const releaseRider = async (id: string) => {
  const response = await axiosInstance.patch(`/fleets/riders/${id}/release`);
  return response.data;
};

export const suspendRider = async (id: string) => {
  const response = await axiosInstance.patch(`/fleets/riders/${id}/suspend`);
  return response.data;
};
