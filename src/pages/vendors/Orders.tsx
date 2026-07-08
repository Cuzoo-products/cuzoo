import { useEffect, useMemo, useState } from "react";
import { useGetOrders } from "@/api/vendor/order/useOrder";
import {
  parseVendorOrdersListMeta,
  parseVendorOrdersListPayload,
  type GetVendorOrdersParams,
  type VendorOrderStatus,
} from "@/api/vendor/order/order";
import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/components/utilities/Loader";
import {
  columns,
  type OrderData,
} from "@/components/utilities/Vendors/OrdersDataTable";

const DEFAULT_LIMIT = 20;

const ORDER_STATUSES: { value: VendorOrderStatus; label: string }[] = [
  { value: "queued", label: "Queued" },
  { value: "pre-payment", label: "Pre-payment" },
  { value: "pre-packaged", label: "Pre-packaged" },
  { value: "packaged", label: "Packaged" },
  { value: "pending", label: "Pending" },
  { value: "pre-pickup", label: "Pre-pickup" },
  { value: "delivery", label: "Delivery" },
  { value: "failed", label: "Failed" },
  { value: "success", label: "Success" },
];

function mapOrderToRow(order: Record<string, unknown>): OrderData {
  const id = String(order.id ?? "").trim();
  const userDetails = order.userDetails as
    | { fullName?: string }
    | undefined;
  const itemsRaw = order.items;
  const items = Array.isArray(itemsRaw)
    ? itemsRaw
        .map((item) => {
          const it = item as { quantity?: number; name?: string };
          return `${it.quantity ?? 0}x ${it.name ?? ""}`.trim();
        })
        .filter(Boolean)
        .join("\n")
    : "—";

  const amount =
    typeof order.amount === "number"
      ? order.amount
      : Number(order.amount) || 0;

  return {
    id,
    orderID: id,
    customer: userDetails?.fullName?.trim() || "—",
    items: items || "—",
    status: order.status != null ? String(order.status) : "—",
    payment:
      order.paymentMethod != null ? String(order.paymentMethod) : "—",
    total: amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  };
}

function Orders() {
  const [status, setStatus] = useState<"" | VendorOrderStatus>("");
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  useEffect(() => {
    setCursorStack([undefined]);
  }, [status]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetVendorOrdersParams>(() => {
    const params: GetVendorOrdersParams = { limit };
    if (status) params.status = status;
    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }
    return params;
  }, [currentCursor, limit, status]);

  const { data, isLoading, isFetching, error } = useGetOrders(queryParams);

  const orders = useMemo(() => parseVendorOrdersListPayload(data), [data]);
  const meta = useMemo(() => parseVendorOrdersListMeta(data), [data]);

  const tableData: OrderData[] = useMemo(
    () => orders.map(mapOrderToRow).filter((row) => row.id !== ""),
    [orders],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    orders.length >= limit;

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setCursorStack([undefined]);
  };

  const handlePrevious = () => {
    if (!hasPrevious) return;
    setCursorStack((prev) => prev.slice(0, -1));
  };

  const handleNext = () => {
    if (!hasNext || meta?.lastCursor == null) return;
    setCursorStack((prev) => [...prev, meta.lastCursor as number | string]);
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Orders" subtitle="Failed to load orders." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        subtitle={
          meta?.count != null
            ? `Manage orders · ${meta.count.toLocaleString("en-NG")} total`
            : "Manage all orders here"
        }
      />

      <DataTable
        adminVariant
        hidePagination
        searchPlaceholder="Search this page..."
        columns={columns}
        data={tableData}
        toolbarExtra={
          <Select
            value={status || "all"}
            onValueChange={(next) =>
              setStatus(next === "all" ? "" : (next as VendorOrderStatus))
            }
          >
            <SelectTrigger className="h-10 w-[180px] shrink-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="vendor-select-menu">
              <SelectItem value="all">All</SelectItem>
              {ORDER_STATUSES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <BackendCursorPagination
        count={meta?.count}
        limit={limit}
        pageIndex={pageIndex}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        isLoading={isFetching}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}

export default Orders;
