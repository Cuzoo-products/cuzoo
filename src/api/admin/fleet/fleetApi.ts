import axiosInstance from "@/api/axiosInstances";

export type FleetApprovalStatus = "pending" | "approved" | "declined";

export type GetFleetManagersParams = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  businessName?: string;
  registrationNumber?: string;
  tinNumber?: string;
  companyType?: string;
  approvalStatus?: FleetApprovalStatus;
  from?: string;
  to?: string;
  cursor?: number | string;
  limit?: number;
};

export type FleetManagersListMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

function buildFleetManagersQueryParams(params?: GetFleetManagersParams) {
  if (!params) return undefined;

  const query: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query[key] = value;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

export const getFleets = async (params?: GetFleetManagersParams) => {
  const response = await axiosInstance.get("/fleets", {
    params: buildFleetManagersQueryParams(params),
  });
  return response.data;
};

export const getOneFleet = async (id: string) => {
  const response = await axiosInstance.get(`/fleets/${id}`);
  return response.data;
};

export const approveFleet = async (id: string) => {
  const response = await axiosInstance.patch(`/fleets/${id}/approve`);
  return response.data;
};

export const fleetWalletAction = async (id: string, action: string) => {
  const response = await axiosInstance.patch(`/fleets/${id}/wallet`, {
    action,
  });
  return response.data;
};

export const fleetAccountAction = async (id: string, action: string) => {
  const response = await axiosInstance.patch(`/fleets/${id}/account`, {
    action,
  });
  return response.data;
};

/** Parses `{ data: { count, lastCursor, limit, data: fleets[] } }` meta from list responses. */
export function parseFleetManagersListMeta(
  payload: unknown,
): FleetManagersListMeta | null {
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

/** Parses `{ data: { count, lastCursor, limit, data: fleets[] } }` from list endpoints. */
export function parseFleetManagersListPayload(
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
