import axiosInstance from "@/api/axiosInstances";

/** Row from admin trip/order list APIs — `orderType` may be `Package` or `Shopping`. */
export type AdminTripListItem = {
  id: string;
  status?: string;
  createdAt?: string;
  amount: number;
  driver?: string;
  from?: string;
  date?: string;
  destinations?: string[];
  startTime?: string;
  endTime?: string;
  orderType?: string;
  customer?: string;
  vendor?: string;
  paymentMethod?: string;
  items?: Array<{ name?: string; quantity?: string | number }>;
};

function normalizeTripRow(raw: unknown): AdminTripListItem {
  const r = raw as Record<string, unknown>;
  const id = String(r.id ?? r.Id ?? "").trim();
  const amt = r.amount;
  const amount =
    typeof amt === "number" && !Number.isNaN(amt)
      ? amt
      : Number(amt) || 0;
  const destinations = r.destinations;
  const itemsRaw = r.items;

  return {
    id,
    status: r.status != null ? String(r.status) : undefined,
    createdAt: r.createdAt != null ? String(r.createdAt) : undefined,
    amount,
    driver: r.driver != null ? String(r.driver) : undefined,
    from: r.from != null ? String(r.from) : undefined,
    date: r.date != null ? String(r.date) : undefined,
    destinations: Array.isArray(destinations)
      ? destinations.map((d) => String(d))
      : undefined,
    startTime: r.startTime != null ? String(r.startTime) : undefined,
    endTime: r.endTime != null ? String(r.endTime) : undefined,
    orderType: r.orderType != null ? String(r.orderType) : undefined,
    customer: r.customer != null ? String(r.customer) : undefined,
    vendor: r.vendor != null ? String(r.vendor) : undefined,
    paymentMethod:
      r.paymentMethod != null ? String(r.paymentMethod) : undefined,
    items: Array.isArray(itemsRaw)
      ? itemsRaw.map((it) => {
          const x = it as Record<string, unknown>;
          return {
            name: x.name != null ? String(x.name) : "",
            quantity: x.quantity ?? "",
          };
        })
      : undefined,
  };
}

/**
 * Reads `{ data: { count, lastCursor, limit, data: [...] } }` from list responses.
 */
export function parseAdminTripsPayload(
  payload: unknown,
): AdminTripListItem[] {
  if (payload == null || typeof payload !== "object") return [];
  const root = payload as { data?: unknown };
  const wrap = root.data;
  if (wrap == null || typeof wrap !== "object") return [];
  const list = (wrap as { data?: unknown }).data;
  if (!Array.isArray(list)) return [];
  return list.map(normalizeTripRow).filter((row) => row.id !== "");
}

export const getAdminTrips = async () => {
  const response = await axiosInstance.get("/admins/trips");
  return response.data;
};
