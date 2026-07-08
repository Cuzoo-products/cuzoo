import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type AdminOrderData,
} from "@/components/utilities/Admins/AdminOrdersDataTable";
import AdminOrdersFilters, {
  adminOrdersParamsToSearchParams,
  adminOrdersSearchParamsToForm,
  adminOrdersSearchParamsToParams,
} from "@/components/utilities/Admins/AdminOrdersFilters";
import { useGetOrdersForAdmin } from "@/api/admin/orders/useOrders";
import {
  parseAdminOrdersListMeta,
  parseAdminOrdersListPayload,
  type GetAdminOrdersParams,
} from "@/api/admin/orders/orders";
import Loader from "@/components/utilities/Loader";

const DEFAULT_LIMIT = 20;

function mapOrderToRow(order: Record<string, unknown>): AdminOrderData {
  const id = String(order.id ?? order.Id ?? "").trim();
  const amount =
    typeof order.amount === "number"
      ? order.amount
      : Number(order.amount) || 0;
  const items = Array.isArray(order.items)
    ? order.items
        .map((item) => {
          const row = item as Record<string, unknown>;
          const quantity = row.quantity != null ? String(row.quantity) : "";
          const name = row.name != null ? String(row.name) : "";
          return quantity ? `${quantity}x ${name}` : name;
        })
        .filter(Boolean)
        .join("\n")
    : "—";

  return {
    id,
    orderID: id,
    customer: order.customer != null ? String(order.customer) : "—",
    vendor: order.vendor != null ? String(order.vendor) : "—",
    orderType: order.orderType != null ? String(order.orderType) : "—",
    items: items || "—",
    status: order.status != null ? String(order.status) : "—",
    payment:
      order.paymentMethod != null ? String(order.paymentMethod) : "—",
    total: amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    createdAt:
      order.createdAt != null
        ? new Date(String(order.createdAt)).toLocaleString("en-NG")
        : "—",
  };
}

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilters = useMemo(
    () => adminOrdersSearchParamsToParams(searchParams),
    [searchParams],
  );
  const filterFormFromUrl = useMemo(
    () => adminOrdersSearchParamsToForm(searchParams),
    [searchParams],
  );

  const [appliedFilters, setAppliedFilters] =
    useState<GetAdminOrdersParams>(urlFilters);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  useEffect(() => {
    setAppliedFilters(urlFilters);
    setCursorStack([undefined]);
  }, [urlFilters]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetAdminOrdersParams>(() => {
    const params: GetAdminOrdersParams = {
      ...appliedFilters,
      orderType: "Shopping",
      limit,
    };

    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }

    return params;
  }, [appliedFilters, currentCursor, limit]);

  const { data, isLoading, isFetching, error } =
    useGetOrdersForAdmin(queryParams);

  const orders = useMemo(
    () => parseAdminOrdersListPayload(data),
    [data],
  );

  const meta = useMemo(() => parseAdminOrdersListMeta(data), [data]);

  const tableData: AdminOrderData[] = useMemo(
    () => orders.map(mapOrderToRow).filter((row) => row.id !== ""),
    [orders],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    orders.length >= limit;

  const resetPagination = () => {
    setCursorStack([undefined]);
  };

  const handleApplyFilters = (filters: GetAdminOrdersParams) => {
    setAppliedFilters(filters);
    resetPagination();
    setSearchParams(adminOrdersParamsToSearchParams(filters), {
      replace: true,
    });
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    resetPagination();
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
      <div className="space-y-5">
        <PageHeader title="Orders" subtitle="Failed to load orders." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Orders"
        subtitle={
          meta?.count != null
            ? `Manage all orders · ${meta.count.toLocaleString("en-NG")} total`
            : "Manage all orders here"
        }
      />

      <AdminOrdersFilters
        key={searchParams.toString()}
        initialValues={filterFormFromUrl}
        onApply={handleApplyFilters}
      />

      <DataTable
        adminVariant
        hidePagination
        searchPlaceholder="Search this page..."
        columns={columns}
        data={tableData}
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
