import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import NestedAdminPage from "@/components/admin/NestedAdminPage";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import StatusBadge from "@/components/admin/StatusBadge";
import { Section } from "@/components/admin/DetailShell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Loader from "@/components/utilities/Loader";
import { DataTableIdCell } from "@/components/ui/data-table-id-cell";
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

const DEFAULT_LIMIT = 20;
const ORDER_TYPE = "Shopping";

function formatItemsCell(
  items: { name: string; quantity: string | number }[] | undefined,
) {
  if (!items?.length) return "—";
  return items
    .map((item) => `${item.quantity}× ${item.name}`)
    .join("\n");
}

function mapOrderRow(order: Record<string, unknown>) {
  const id = String(order.id ?? order.Id ?? "").trim();
  const amount =
    typeof order.amount === "number"
      ? order.amount
      : Number(order.amount) || 0;
  const itemsRaw = order.items;
  const items = Array.isArray(itemsRaw)
    ? itemsRaw.map((item) => {
        const row = item as Record<string, unknown>;
        return {
          name: row.name != null ? String(row.name) : "",
          quantity:
            row.quantity != null
              ? (row.quantity as string | number)
              : "",
        };
      })
    : undefined;

  return {
    id,
    customer: order.customer != null ? String(order.customer) : "—",
    vendor: order.vendor != null ? String(order.vendor) : "—",
    itemsLabel: formatItemsCell(items),
    total: amount,
    payment: order.paymentMethod != null ? String(order.paymentMethod) : "—",
    status: order.status != null ? String(order.status) : "—",
    orderType:
      order.orderType != null ? String(order.orderType) : ORDER_TYPE,
    createdAt: order.createdAt != null ? String(order.createdAt) : undefined,
  };
}

export default function AdminVendorOrdersByVendor() {
  const { id: routeId } = useParams<{ id: string }>();
  const vendorId =
    routeId && routeId !== "undefined" && routeId !== "null"
      ? routeId
      : undefined;

  const [searchParams, setSearchParams] = useSearchParams();

  const urlFilters = useMemo(
    () => ({
      ...adminOrdersSearchParamsToParams(searchParams),
      ...(vendorId ? { vendorId } : {}),
    }),
    [searchParams, vendorId],
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
      vendorId,
      orderType: ORDER_TYPE,
      limit,
    };

    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }

    return params;
  }, [appliedFilters, currentCursor, limit, vendorId]);

  const { data: payload, isLoading, isFetching, error } =
    useGetOrdersForAdmin(vendorId ? queryParams : undefined);

  const rows = useMemo(() => {
    return parseAdminOrdersListPayload(payload).map(mapOrderRow);
  }, [payload]);

  const meta = useMemo(() => parseAdminOrdersListMeta(payload), [payload]);

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    rows.length >= limit;

  const resetPagination = () => {
    setCursorStack([undefined]);
  };

  const handleApplyFilters = (filters: GetAdminOrdersParams) => {
    const next = { ...filters, vendorId };
    setAppliedFilters(next);
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

  const vendorBack = `/admins/vendors/${vendorId ?? ""}`;
  const crumbs = [
    { label: "Dashboard", href: "/admins/dashboard" },
    { label: "Vendors", href: "/admins/vendors" },
    { label: "Vendor", href: vendorBack },
    { label: "Orders" },
  ];

  if (!vendorId) {
    return (
      <NestedAdminPage
        backHref="/admins/vendors"
        backLabel="Vendors"
        crumbs={crumbs}
        title="Vendor orders"
        subtitle="No vendor ID in the URL."
      >
        <></>
      </NestedAdminPage>
    );
  }

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <NestedAdminPage
        backHref={vendorBack}
        backLabel="Vendor"
        crumbs={crumbs}
        title="Vendor orders"
        subtitle="Failed to load orders."
      >
        <></>
      </NestedAdminPage>
    );
  }

  const subtitle = `Orders for this vendor${
    meta?.count != null ? ` · ${meta.count.toLocaleString("en-NG")} total` : ""
  }`;

  return (
    <NestedAdminPage
      backHref={vendorBack}
      backLabel="Vendor"
      crumbs={crumbs}
      title="Vendor orders"
      subtitle={subtitle}
    >
      <div className="space-y-5">
        <AdminOrdersFilters
          key={searchParams.toString()}
          initialValues={filterFormFromUrl}
          onApply={handleApplyFilters}
          hiddenFields={["vendorId"]}
        />

        <Section
          title="Orders"
          subtitle={`Shopping orders for vendor ID ${vendorId}.`}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center text-muted-foreground"
                    >
                      No orders for this vendor.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <DataTableIdCell id={r.id} />
                      </TableCell>
                      <TableCell>{r.customer}</TableCell>
                      <TableCell>{r.vendor}</TableCell>
                      <TableCell className="max-w-[220px] whitespace-pre-line text-xs">
                        {r.itemsLabel}
                      </TableCell>
                      <TableCell>{r.payment}</TableCell>
                      <TableCell>
                        ₦
                        {r.total.toLocaleString("en-NG", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>{r.orderType}</TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell>
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleString("en-NG")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admins/orders/${r.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Section>

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
    </NestedAdminPage>
  );
}
