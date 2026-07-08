import axiosInstance from "@/api/axiosInstances";

export type GetVehiclesParams = {
  companyId?: string;
  cursor?: number | string;
  limit?: number;
};

export type VehiclesListMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

function buildVehiclesQueryParams(params?: GetVehiclesParams) {
  if (!params) return undefined;

  const query: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query[key] = value;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

export const getVehicles = async (params?: GetVehiclesParams) => {
  const response = await axiosInstance.get("/admins/vehicles", {
    params: buildVehiclesQueryParams(params),
  });
  return response.data;
};

export const getVehicle = async (id: string) => {
  const response = await axiosInstance.get(`/admins/vehicles/${id}`);
  return response.data;
};

export const getVehicleByFleetId = async (id: string) => {
  return getVehicles({ companyId: id });
};

/** Parses `{ data: { count, lastCursor, limit, data: vehicles[] } }` meta from list responses. */
export function parseVehiclesListMeta(payload: unknown): VehiclesListMeta | null {
  if (payload == null || typeof payload !== "object") return null;
  const root = payload as { data?: unknown };
  const wrap = root.data;
  if (wrap == null || typeof wrap !== "object") return null;
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

/** Parses `{ data: { count, lastCursor, limit, data: vehicles[] } }` from list endpoints. */
export function parseVehiclesListPayload(
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
