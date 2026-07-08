import axiosInstance from "@/api/axiosInstances";

export type AdminOrderStatus =
  | "queued"
  | "pre-payment"
  | "pre-packaged"
  | "packaged"
  | "pending"
  | "pre-pickup"
  | "delivery"
  | "failed"
  | "success";

export type AdminOrderType = "Shopping" | "Package";

export type GetAdminOrdersParams = {
  status?: AdminOrderStatus;
  orderType?: AdminOrderType;
  vendorId?: string;
  userId?: string;
  companyId?: string;
  riderId?: string;
  cursor?: number | string;
  limit?: number;
};

export type AdminOrdersListMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

function buildAdminOrdersQueryParams(params?: GetAdminOrdersParams) {
  if (!params) return undefined;

  const query: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query[key] = value;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

export const getOrdersForAdmin = async (params?: GetAdminOrdersParams) => {
  const response = await axiosInstance.get("/admins/orders", {
    params: buildAdminOrdersQueryParams(params),
  });
  return response.data;
};

export const getOrderForAdmin = async (id: string) => {
  const response = await axiosInstance.get(`/admins/orders/${id}`);
  return response.data;
};

/** Parses `{ data: { count, lastCursor, limit, data: orders[] } }` meta from list responses. */
export function parseAdminOrdersListMeta(
  payload: unknown,
): AdminOrdersListMeta | null {
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

/** Parses `{ data: { count, lastCursor, limit, data: orders[] } }` from list endpoints. */
export function parseAdminOrdersListPayload(
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

/**
 * Lists orders for a user. Omit `orderType` to include mixed types (e.g. Shopping + Package).
 */
export const getOrdersForAdminByUserId = async (
  userId: string,
  orderType?: string,
) => {
  return getOrdersForAdmin({
    userId,
    ...(orderType ? { orderType: orderType as AdminOrderType } : {}),
  });
};

export const getOrderForAdminByFleetId = async (
  orderType: string,
  fleetId: string,
) => {
  return getOrdersForAdmin({
    orderType: orderType as AdminOrderType,
    companyId: fleetId,
  });
};

export const getOrdersForAdminByVendorId = async (
  orderType: string,
  vendorId: string,
) => {
  return getOrdersForAdmin({
    orderType: orderType as AdminOrderType,
    vendorId,
  });
};

export const getOrdersForAdminByRiderId = async (
  orderType: string,
  riderId: string,
) => {
  return getOrdersForAdmin({
    orderType: orderType as AdminOrderType,
    riderId,
  });
};
