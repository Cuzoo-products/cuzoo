import axiosInstance from "@/api/axiosInstances";

export const getBankList = async () => {
  const response = await axiosInstance.get("payments/banks");
  return response.data;
};

export const getVerifyAccount = async (
  accountNumber: string,
  bankCode: string,
) => {
  const response = await axiosInstance.get(
    `/payments/verify-account?accountNumber=${accountNumber}&bankCode=${bankCode}`,
  );
  return response.data;
};

export const addBankAccount = async (data: any) => {
  const response = await axiosInstance.post("/vendors/wallet", data);
  return response.data;
};

export const deleteBankAccount = async (data: any) => {
  const response = await axiosInstance.put("/vendors/wallet", data);
  return response.data;
};

export const accountBalance = async () => {
  const response = await axiosInstance.get("/vendors/wallet");
  return response.data;
};

export const getWalletDetails = async () => {
  const response = await axiosInstance.get("/vendors/wallet");
  return response.data;
};

export type GetVendorFinanceHistoryParams = {
  cursor?: number | string;
  limit?: number;
};

export type VendorFinanceHistoryMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

export type VendorFinanceHistoryRow = {
  amount: number;
  date: string;
};

function buildFinanceHistoryQueryParams(
  params?: GetVendorFinanceHistoryParams,
) {
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

export function parseVendorFinanceHistoryMeta(
  payload: unknown,
): VendorFinanceHistoryMeta | null {
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

export function parseVendorFinanceHistoryPayload(
  payload: unknown,
): VendorFinanceHistoryRow[] {
  if (payload == null || typeof payload !== "object") return [];
  const root = payload as { data?: unknown };
  const wrap = root.data;
  if (wrap == null) return [];

  const list = Array.isArray(wrap)
    ? wrap
    : typeof wrap === "object"
      ? (wrap as { data?: unknown }).data
      : null;

  if (!Array.isArray(list)) return [];

  return list.map((row) => {
    const r = row as Record<string, unknown>;
    const amount =
      typeof r.amount === "number" ? r.amount : Number(r.amount) || 0;
    return {
      amount,
      date: r.date != null ? String(r.date) : "—",
    };
  });
}

export const getFinanceOverview = async () => {
  const response = await axiosInstance.get("/vendors/finance/overview");
  return response.data;
};

export const inflowHistory = async (
  params?: GetVendorFinanceHistoryParams,
) => {
  const response = await axiosInstance.get("/vendors/finance/inflow-history", {
    params: buildFinanceHistoryQueryParams(params),
  });
  return response.data;
};

export const outflowHistory = async (
  params?: GetVendorFinanceHistoryParams,
) => {
  const response = await axiosInstance.get(
    "/vendors/finance/outflow-history",
    {
      params: buildFinanceHistoryQueryParams(params),
    },
  );
  return response.data;
};

export const requestWithdrawal = async (data: {
  accountNumber: string;
  amount: number;
}) => {
  const response = await axiosInstance.post(
    "/vendors/wallet/request-withdrawal",
    data,
  );
  return response.data;
};

export type VendorPayoutStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "failed"
  | "success";

export type GetVendorPayoutsParams = {
  status?: VendorPayoutStatus;
  reference?: string;
  cursor?: number | string;
  limit?: number;
};

export type VendorPayoutsListMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

function buildVendorPayoutsQueryParams(params?: GetVendorPayoutsParams) {
  if (!params) return undefined;

  const query: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query[key] = value;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

export function parseVendorPayoutsListMeta(
  payload: unknown,
): VendorPayoutsListMeta | null {
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

export function parseVendorPayoutsListPayload(
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

export const getPayouts = async (params?: GetVendorPayoutsParams) => {
  const response = await axiosInstance.get("/vendors/payouts", {
    params: buildVendorPayoutsQueryParams(params),
  });
  return response.data;
};

export const getPayout = async (id: string) => {
  const response = await axiosInstance.get(`/vendors/payouts/${id}`);
  return response.data;
};
