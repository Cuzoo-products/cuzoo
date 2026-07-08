import axiosInstance from "@/api/axiosInstances";

export type GetVendorProductsParams = {
  name?: string;
  categoryId?: string;
  cursor?: number | string;
  limit?: number;
};

export type VendorProductsListMeta = {
  count: number;
  lastCursor: number | string | null;
  limit: number;
};

function buildVendorProductsQueryParams(params?: GetVendorProductsParams) {
  if (!params) return undefined;

  const query: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query[key] = value;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

export function parseVendorProductsListMeta(
  payload: unknown,
): VendorProductsListMeta | null {
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

export function parseVendorProductsListPayload(
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

export const createProduct = async (productData: unknown) => {
  const response = await axiosInstance.post("vendors/products", productData);
  return response.data;
};

export const getProducts = async (params?: GetVendorProductsParams) => {
  const response = await axiosInstance.get("vendors/products", {
    params: buildVendorProductsQueryParams(params),
  });
  return response.data;
};

export const getOneProduct = async (id: string) => {
  const response = await axiosInstance.get(`/vendors/products/${id}`);
  return response.data;
};

export const updateProduct = async ({
  id,
  productData,
}: {
  id: string;
  productData: unknown;
}) => {
  const response = await axiosInstance.patch(
    `/vendors/products/${id}`,
    productData,
  );
  return response.data;
};
