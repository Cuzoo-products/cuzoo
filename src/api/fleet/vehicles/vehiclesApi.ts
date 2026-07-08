import axiosInstance from "@/api/axiosInstances";

export type GetFleetVehiclesParams = {
  cursor?: number | string;
  limit?: number;
};

export type FleetVehiclesListMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

function buildFleetVehiclesQueryParams(params?: GetFleetVehiclesParams) {
  if (!params) return undefined;

  const query: Record<string, string | number> = {};
  if (params.cursor != null && params.cursor !== "") {
    query.cursor = params.cursor;
  }
  if (params.limit != null) {
    query.limit = params.limit;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

export function parseFleetVehiclesListMeta(
  payload: unknown,
): FleetVehiclesListMeta | null {
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

export function parseFleetVehiclesListPayload(
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

export const getVehicles = async (params?: GetFleetVehiclesParams) => {
  const response = await axiosInstance.get("/fleets/vehicles", {
    params: buildFleetVehiclesQueryParams(params),
  });
  return response.data;
};

export const addVehicles = async (vehicleData: unknown) => {
  const response = await axiosInstance.post("/fleets/vehicles", vehicleData);
  return response.data;
};

export const getVehicle = async (id: string) => {
  const response = await axiosInstance.get(`fleets/vehicles/${id}`);
  return response.data;
};

export const updateVehicle = async (data: {
  id: string;
  submitData: unknown;
}) => {
  const response = await axiosInstance.patch(
    `fleets/vehicles/${data.id}`,
    data.submitData,
  );
  return response.data;
};

export const vehicleAction = async (id: string, action: string) => {
  const response = await axiosInstance.post(`fleets/vehicles/${id}/${action}`);
  return response.data;
};
