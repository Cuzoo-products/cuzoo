import axiosInstance from "@/api/axiosInstances";

export type CouponData = {
  code: string;
  value: number;
  expiryDate: string;
  maxUsage: number | null;
  description: string;
  minimumSpend: number;
};

/** Firestore Timestamp JSON shape sometimes returned by the API. */
export type FirestoreTimestampLike = {
  _seconds?: number;
  _nanoseconds?: number;
  seconds?: number;
  nanoseconds?: number;
};

/** One coupon row from GET /vendors/coupons (supports Id or id). */
export type VendorCouponRow = {
  Id?: string;
  id?: string;
  vendorId?: string;
  code: string;
  value: number;
  /** ISO string, or Firestore `{ _seconds, _nanoseconds }` — see `normalizeCouponRow`. */
  expiryDate: string | FirestoreTimestampLike;
  maxUsage: number;
  usage: number;
  minimumSpend: number;
  createdAt?: string;
  updatedAt?: string;
};

function normalizeCouponRow(row: unknown): VendorCouponRow {
  const r = row as Record<string, unknown>;
  const expiryRaw =
    r.expiryDate ?? r.ExpiryDate ?? r.expiry_date ?? r.expiry;
  return {
    ...(row as VendorCouponRow),
    expiryDate: (expiryRaw ?? "") as VendorCouponRow["expiryDate"],
  };
}

type CouponsListEnvelope = {
  success?: boolean;
  statusCode?: number;
  data?: {
    count?: number;
    lastCursor?: number;
    limit?: number;
    data?: VendorCouponRow[];
  };
};

/** Extract coupon rows from API envelope (paginated list or legacy shapes). */
export function parseVendorCouponsResponse(
  payload: unknown,
): VendorCouponRow[] {
  if (payload == null || typeof payload !== "object") return [];
  const root = payload as CouponsListEnvelope & { data?: unknown };
  const d = root.data;
  if (d == null) return [];
  if (Array.isArray(d)) return d.map(normalizeCouponRow);
  if (typeof d === "object") {
    const inner = (d as { data?: unknown }).data;
    if (Array.isArray(inner)) return inner.map(normalizeCouponRow);
    if (inner && typeof inner === "object" && "code" in inner) {
      return [normalizeCouponRow(inner)];
    }
    if ("code" in (d as object)) return [normalizeCouponRow(d)];
  }
  return [];
}

export const createCoupon = async (couponData: CouponData) => {
  const response = await axiosInstance.post("vendors/coupons", couponData);
  return response.data;
};

export const getCoupons = async () => {
  const response = await axiosInstance.get("vendors/coupons");
  return response.data;
};
