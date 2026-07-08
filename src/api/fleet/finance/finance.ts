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
  const response = await axiosInstance.post("/fleets/wallet", data);
  return response.data;
};

export const deleteBankAccount = async (data: any) => {
  const response = await axiosInstance.put("/fleets/wallet", data);
  return response.data;
};

export const getWalletDetails = async () => {
  const response = await axiosInstance.get("/fleets/wallet");
  return response.data;
};

export type GetFleetFinanceHistoryParams = {
  cursor?: number | string;
  limit?: number;
};

export type FleetFinanceHistoryMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

export type FleetFinanceHistoryRow = {
  amount: number;
  date: string;
};

function buildFinanceHistoryQueryParams(
  params?: GetFleetFinanceHistoryParams,
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

export function parseFleetFinanceHistoryMeta(
  payload: unknown,
): FleetFinanceHistoryMeta | null {
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

export function parseFleetFinanceHistoryPayload(
  payload: unknown,
): FleetFinanceHistoryRow[] {
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
  const response = await axiosInstance.get("/fleets/finance/overview");
  return response.data;
};

export const inflowHistory = async (
  params?: GetFleetFinanceHistoryParams,
) => {
  const response = await axiosInstance.get("/fleets/finance/inflow-history", {
    params: buildFinanceHistoryQueryParams(params),
  });
  return response.data;
};

export const outflowHistory = async (
  params?: GetFleetFinanceHistoryParams,
) => {
  const response = await axiosInstance.get(
    "/fleets/finance/outflow-history",
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
    "/fleets/wallet/request-withdrawal",
    data,
  );
  return response.data;
};

export type FleetPayoutStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "failed"
  | "success";

export type GetFleetPayoutsParams = {
  status?: FleetPayoutStatus;
  reference?: string;
  cursor?: number | string;
  limit?: number;
};

export type FleetPayoutsListMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

function buildFleetPayoutsQueryParams(params?: GetFleetPayoutsParams) {
  if (!params) return undefined;

  const query: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query[key] = value;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

export function parseFleetPayoutsListMeta(
  payload: unknown,
): FleetPayoutsListMeta | null {
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

export function parseFleetPayoutsListPayload(
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

export const getPayouts = async (params?: GetFleetPayoutsParams) => {
  const response = await axiosInstance.get("/fleets/payouts", {
    params: buildFleetPayoutsQueryParams(params),
  });
  return response.data;
};

export const getPayout = async (id: string) => {
  const response = await axiosInstance.get(`/fleets/payouts/${id}`);
  return response.data;
};
