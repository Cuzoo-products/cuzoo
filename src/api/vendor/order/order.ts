import axiosInstance from "@/api/axiosInstances";

export type VendorOrderStatus =
  | "queued"
  | "pre-payment"
  | "pre-packaged"
  | "packaged"
  | "pending"
  | "pre-pickup"
  | "delivery"
  | "failed"
  | "success";

export type GetVendorOrdersParams = {
  status?: VendorOrderStatus;
  cursor?: number | string;
  limit?: number;
};

export type VendorOrdersListMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

function buildVendorOrdersQueryParams(params?: GetVendorOrdersParams) {
  if (!params) return undefined;

  const query: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query[key] = value;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

export function parseVendorOrdersListMeta(
  payload: unknown,
): VendorOrdersListMeta | null {
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

export function parseVendorOrdersListPayload(
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

export const getOrders = async (params?: GetVendorOrdersParams) => {
  const response = await axiosInstance.get("/vendors/orders", {
    params: buildVendorOrdersQueryParams(params),
  });
  return response.data;
};

export const getOrder = async (id: string) => {
  const response = await axiosInstance.get(`/vendors/orders/${id}`);
  return response.data;
};

export const processOrder = async (id: string) => {
  const response = await axiosInstance.put(`/vendors/orders/${id}/process`);
  return response.data;
};

export const requestOtp = async (id: string) => {
  const response = await axiosInstance.put(`/vendors/orders/${id}/request-otp`);
  return response.data;
};

export const confirmPickup = async (id: string, data: { otp: string }) => {
  const response = await axiosInstance.put(
    `/vendors/orders/${id}/confirm-pickup`,
    data,
  );
  return response.data;
};
