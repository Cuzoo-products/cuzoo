import axiosInstance from "@/api/axiosInstances";

export type PayoutStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "failed"
  | "success";

/** @deprecated Use PayoutStatus */
export type VendorPayoutStatus = PayoutStatus;

export type GetPayoutsListParams = {
  status?: PayoutStatus;
  reference?: string;
  ownerId?: string;
  cursor?: number | string;
  limit?: number;
};

export type GetVendorPayoutsParams = GetPayoutsListParams;
export type GetFleetPayoutsParams = GetPayoutsListParams;
export type GetRiderPayoutsParams = GetPayoutsListParams;

export type PayoutsListMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

/** @deprecated Use PayoutsListMeta */
export type VendorPayoutsListMeta = PayoutsListMeta;

function buildPayoutsQueryParams(params?: GetPayoutsListParams) {
  if (!params) return undefined;

  const query: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query[key] = value;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

export const getVendorsPayouts = async (params?: GetVendorPayoutsParams) => {
  const response = await axiosInstance.get("/admins/vendors/payouts", {
    params: buildPayoutsQueryParams(params),
  });
  return response.data;
};

export function parsePayoutsListMeta(payload: unknown): PayoutsListMeta | null {
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

export const parseVendorPayoutsListMeta = parsePayoutsListMeta;
export const parseFleetPayoutsListMeta = parsePayoutsListMeta;
export const parseRiderPayoutsListMeta = parsePayoutsListMeta;

export function parsePayoutsListPayload(
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

export const getVendorPayout = async (id: string) => {
  const response = await axiosInstance.get(`/admins/vendors/payouts/${id}`);
  return response.data;
};

export const rejectVendorPayout = async (
  id: string,
  reason: { reason: string },
) => {
  const response = await axiosInstance.put(
    `/admins/vendors/payouts/${id}/reject`,
    reason,
  );
  return response.data;
};

export const approveVendorPayout = async (id: string) => {
  const response = await axiosInstance.put(
    `/admins/vendors/payouts/${id}/approve`,
  );
  return response.data;
};

export const parseVendorPayoutsListPayload = parsePayoutsListPayload;
export const parseFleetPayoutsListPayload = parsePayoutsListPayload;
export const parseRiderPayoutsListPayload = parsePayoutsListPayload;

export const getFleetsPayouts = async (params?: GetFleetPayoutsParams) => {
  const response = await axiosInstance.get("/admins/fleets/payouts", {
    params: buildPayoutsQueryParams(params),
  });
  return response.data;
};

export const getFleetPayout = async (id: string) => {
  const response = await axiosInstance.get(`/admins/fleets/payouts/${id}`);
  return response.data;
};

export const rejectFleetPayout = async (
  id: string,
  reason: { reason: string },
) => {
  const response = await axiosInstance.put(
    `/admins/fleets/payouts/${id}/reject`,
    reason,
  );
  return response.data;
};

export const approveFleetPayout = async (id: string) => {
  const response = await axiosInstance.put(
    `/admins/fleets/payouts/${id}/approve`,
  );
  return response.data;
};

export const getRidersPayouts = async (params?: GetRiderPayoutsParams) => {
  const response = await axiosInstance.get("/admins/riders/payouts", {
    params: buildPayoutsQueryParams(params),
  });
  return response.data;
};

export const getRiderPayout = async (id: string) => {
  const response = await axiosInstance.get(`/admins/riders/payouts/${id}`);
  return response.data;
};

export const rejectRiderPayout = async (
  id: string,
  reason: { reason: string },
) => {
  const response = await axiosInstance.put(
    `/admins/riders/payouts/${id}/reject`,
    reason,
  );
  return response.data;
};

export const approveRiderPayout = async (id: string) => {
  const response = await axiosInstance.put(
    `/admins/riders/payouts/${id}/approve`,
  );
  return response.data;
};
