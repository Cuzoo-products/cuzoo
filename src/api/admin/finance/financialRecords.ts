import axiosInstance from "@/api/axiosInstances";

export type GetFinancialRecordsParams = {
  cursor?: number | string;
  limit?: number;
};

export type FinancialRecordRow = {
  amount: number;
  date: string;
};

export type FinancialRecordsMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

function buildFinancialRecordsQueryParams(
  params?: GetFinancialRecordsParams,
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

export const getFinancialRecords = async (
  params?: GetFinancialRecordsParams,
) => {
  const response = await axiosInstance.get("/admins/financial-records", {
    params: buildFinancialRecordsQueryParams(params),
  });
  return response.data;
};

export function parseFinancialRecordsMeta(
  payload: unknown,
): FinancialRecordsMeta | null {
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

export function parseFinancialRecordsPayload(
  payload: unknown,
): FinancialRecordRow[] {
  if (payload == null || typeof payload !== "object") return [];
  const root = payload as { data?: unknown };
  const wrap = root.data;
  if (wrap == null || typeof wrap !== "object" || Array.isArray(wrap)) {
    return [];
  }
  const list = (wrap as { data?: unknown }).data;
  if (!Array.isArray(list)) return [];

  return list
    .filter((x) => x != null && typeof x === "object")
    .map((raw) => {
      const row = raw as Record<string, unknown>;
      const amount =
        typeof row.amount === "number"
          ? row.amount
          : Number(row.amount) || 0;
      return {
        amount,
        date: row.date != null ? String(row.date) : "—",
      };
    });
}
