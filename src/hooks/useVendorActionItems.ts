import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  getOrders,
  parseVendorOrdersListMeta,
  type VendorOrderStatus,
} from "@/api/vendor/order/order";
import type { AdminActionItem } from "@/hooks/useAdminActionItems";

/** Orders that still need vendor attention (not finished or already out for delivery). */
const ACTION_NEEDED_STATUSES: VendorOrderStatus[] = [
  "queued",
  "pre-payment",
  "pre-packaged",
  "packaged",
  "pending",
  "pre-pickup",
];

export type VendorActionItem = AdminActionItem;

export function useVendorActionItems(): VendorActionItem[] {
  const results = useQueries({
    queries: ACTION_NEEDED_STATUSES.map((status) => ({
      queryKey: ["getOrders", "action-needed", status],
      queryFn: () => getOrders({ status, limit: 1 }),
    })),
  });

  return useMemo(() => {
    const isLoading = results.some((r) => r.isLoading);
    const count = results.reduce((sum, r) => {
      return sum + (parseVendorOrdersListMeta(r.data)?.count ?? 0);
    }, 0);

    if (!isLoading && count === 0) return [];

    return [
      {
        id: "orders-action-needed",
        title: "Orders needing action",
        description:
          "Orders that are not yet successful, failed, or out for delivery.",
        href: "/vendor/orders",
        count,
        isLoading,
      },
    ];
  }, [results]);
}
