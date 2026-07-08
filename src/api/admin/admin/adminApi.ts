import axiosInstance from "@/api/axiosInstances";

export type AdminGender = "Male" | "Female" | "Others";

export type AdminPosition = "SUPER_ADMIN" | "ADMIN" | "INVESTOR";

export type GetAdminsParams = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  gender?: AdminGender;
  position?: AdminPosition;
  country?: string;
  state?: string;
  cursor?: number | string;
  limit?: number;
};

export type AdminsListMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

function buildAdminsQueryParams(params?: GetAdminsParams) {
  if (!params) return undefined;

  const query: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query[key] = value;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

export const createAdmin = async (adminData: unknown) => {
  const response = await axiosInstance.post("/admins", adminData);
  return response.data;
};

export const getAdmin = async (id: string) => {
  const response = await axiosInstance.get(`/admins/${id}`);
  return response.data;
};

export const toggleReleaseAdmin = async ({
  id,
  release,
}: {
  id: string;
  release: string;
}) => {
  const response = await axiosInstance.post(`/admins/${id}/${release}`);
  return response.data;
};

export const getAllAdmins = async (params?: GetAdminsParams) => {
  const response = await axiosInstance.get("/admins", {
    params: buildAdminsQueryParams(params),
  });
  return response.data;
};

export function parseAdminsListMeta(payload: unknown): AdminsListMeta | null {
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

export function parseAdminsListPayload(
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
