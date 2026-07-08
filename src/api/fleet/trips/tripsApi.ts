import axiosInstance from "@/api/axiosInstances";

export type FleetTripStatus =
  | "queued"
  | "pre-payment"
  | "pre-packaged"
  | "packaged"
  | "pending"
  | "pre-pickup"
  | "delivery"
  | "failed"
  | "success";

export type GetFleetTripsParams = {
  status?: FleetTripStatus;
  cursor?: number | string;
  limit?: number;
};

export type FleetTripsListMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

function buildFleetTripsQueryParams(params?: GetFleetTripsParams) {
  if (!params) return undefined;

  const query: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query[key] = value;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

export function parseFleetTripsListMeta(
  payload: unknown,
): FleetTripsListMeta | null {
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

export function parseFleetTripsListPayload(
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

export const getFleetTrips = async (params?: GetFleetTripsParams) => {
  const response = await axiosInstance.get("fleets/trips", {
    params: buildFleetTripsQueryParams(params),
  });
  return response.data;
};

export const getFleetTripById = async (id: string) => {
  const response = await axiosInstance.get(`fleets/trips/${id}`);
  return response.data;
};
