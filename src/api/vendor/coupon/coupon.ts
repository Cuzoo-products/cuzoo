import axiosInstance from "@/api/axiosInstances";

export type CouponData = {
  code: string;
  value: number;
  expiryDate: string;
  maxUsage: number | null;
  description: string;
  minimumSpend: number;
};

/** One coupon row from GET /vendors/coupons (supports Id or id). */
export type VendorCouponRow = {
  Id?: string;
  id?: string;
  vendorId?: string;
  code: string;
  value: number;
  expiryDate: string;
  maxUsage: number;
  usage: number;
  minimumSpend: number;
  createdAt?: string;
  updatedAt?: string;
};

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
  if (Array.isArray(d)) return d;
  if (typeof d === "object") {
    const inner = (d as { data?: unknown }).data;
    if (Array.isArray(inner)) return inner as VendorCouponRow[];
    if (inner && typeof inner === "object" && "code" in inner) {
      return [inner as VendorCouponRow];
    }
    if ("code" in (d as object)) return [d as VendorCouponRow];
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
