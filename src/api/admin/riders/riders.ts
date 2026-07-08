import axiosInstance from "@/api/axiosInstances";

export type RiderGender = "Male" | "Female" | "Others";

export type GetRidersParams = {
  approved?: boolean;
  suspended?: boolean;
  regComplete?: boolean;
  companyId?: string;
  country?: string;
  state?: string;
  referralCode?: string;
  gender?: RiderGender;
  from?: string;
  to?: string;
  cursor?: number | string;
  limit?: number;
};

export type RidersListMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

function buildRidersQueryParams(params?: GetRidersParams) {
  if (!params) return undefined;

  const query: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query[key] = value;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

export const getRiders = async (params?: GetRidersParams) => {
  const response = await axiosInstance.get("/riders", {
    params: buildRidersQueryParams(params),
  });
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

/** Parses `{ data: { count, lastCursor, limit, data: riders[] } }` meta from list responses. */
export function parseRidersListMeta(payload: unknown): RidersListMeta | null {
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
