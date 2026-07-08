import axiosInstance from "@/api/axiosInstances";

export type VendorApprovalStatus = "pending" | "approved" | "declined";

export type GetVendorsParams = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  businessName?: string;
  registrationNumber?: string;
  businessType?: string;
  approvalStatus?: VendorApprovalStatus;
  from?: string;
  to?: string;
  cursor?: number | string;
  limit?: number;
};

export type VendorsListMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

function buildVendorsQueryParams(params?: GetVendorsParams) {
  if (!params) return undefined;

  const query: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query[key] = value;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

export const getVendors = async (params?: GetVendorsParams) => {
  const response = await axiosInstance.get("/vendors", {
    params: buildVendorsQueryParams(params),
  });
  return response.data;
};

export const getVendor = async (vendorId: string) => {
  const response = await axiosInstance.get(`/vendors/${vendorId}`);
  return response.data;
};

export const approveVendor = async (id: string) => {
  const response = await axiosInstance.patch(`/vendors/${id}/approve`);
  return response.data;
};

export const vendorWalletAction = async (id: string, action: string) => {
  const response = await axiosInstance.patch(`/vendors/${id}/wallet`, {
    action,
  });
  return response.data;
};

export const vendorAccountAction = async (id: string, action: string) => {
  const response = await axiosInstance.patch(`/vendors/${id}/account`, {
    action,
  });
  return response.data;
};

/** Parses `{ data: { count, lastCursor, limit, data: vendors[] } }` meta from list responses. */
export function parseVendorsListMeta(payload: unknown): VendorsListMeta | null {
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

/** Parses `{ data: { count, lastCursor, limit, data: vendors[] } }` from list endpoints. */
export function parseVendorsListPayload(
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
