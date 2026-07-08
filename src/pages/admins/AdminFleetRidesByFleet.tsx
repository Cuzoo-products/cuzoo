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

function formatWhen(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function naira(n: number): string {
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
}

function orderDetailsHref(id: string, orderType?: string): string {
  if (orderType?.toLowerCase() === "package") {
    return `/admins/trips/${id}`;
  }
  return `/admins/orders/${id}`;
}

function mapOrderRow(order: Record<string, unknown>) {
  const id = String(order.id ?? order.Id ?? "").trim();
  const amount =
    typeof order.amount === "number"
      ? order.amount
      : Number(order.amount) || 0;
  const orderType =
    order.orderType != null ? String(order.orderType) : "—";

  return {
    id,
    orderType,
    customer: order.customer != null ? String(order.customer) : "—",
    amount,
    status: order.status != null ? String(order.status) : "—",
    payment:
      order.paymentMethod != null ? String(order.paymentMethod) : "—",
    createdAt: formatWhen(
      order.createdAt != null ? String(order.createdAt) : undefined,
    ),
    href: orderDetailsHref(id, orderType),
  };
}

export default function AdminFleetRidesByFleet() {
  const { id: routeId } = useParams<{ id: string }>();
  const fleetId =
    routeId && routeId !== "undefined" && routeId !== "null"
      ? routeId
      : undefined;

  const [searchParams, setSearchParams] = useSearchParams();

  const urlFilters = useMemo(
    () => ({
      ...adminOrdersSearchParamsToParams(searchParams),
      ...(fleetId ? { companyId: fleetId } : {}),
    }),
    [searchParams, fleetId],
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
      companyId: fleetId,
      limit,
    };

    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }

    return params;
  }, [appliedFilters, currentCursor, fleetId, limit]);

  const { data: payload, isLoading, isFetching, isError } =
    useGetOrdersForAdmin(fleetId ? queryParams : undefined);

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
    const next = { ...filters, companyId: fleetId };
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

  const fleetBack = `/admins/fleet_managers/${fleetId ?? ""}`;
  const crumbs = [
    { label: "Dashboard", href: "/admins/dashboard" },
    { label: "Fleet Managers", href: "/admins/fleet_managers" },
    { label: "Fleet", href: fleetBack },
    { label: "Orders" },
  ];

  if (!fleetId) {
    return (
      <NestedAdminPage
        backHref="/admins/fleet_managers"
        backLabel="Fleet Managers"
        crumbs={crumbs}
        title="Fleet orders"
        subtitle="No fleet ID in the URL."
      >
        <></>
      </NestedAdminPage>
    );
  }

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <NestedAdminPage
        backHref={fleetBack}
        backLabel="Fleet"
        crumbs={crumbs}
        title="Fleet orders"
        subtitle="Failed to load orders for this fleet."
      >
        <></>
      </NestedAdminPage>
    );
  }

  const subtitle = `Orders for this fleet${
    meta?.count != null ? ` · ${meta.count.toLocaleString("en-NG")} total` : ""
  }`;

  return (
    <NestedAdminPage
      backHref={fleetBack}
      backLabel="Fleet"
      crumbs={crumbs}
      title="Fleet orders"
      subtitle={subtitle}
    >
      <div className="space-y-5">
        <AdminOrdersFilters
          key={searchParams.toString()}
          initialValues={filterFormFromUrl}
          onApply={handleApplyFilters}
          hiddenFields={["companyId"]}
        />

        <Section title="Orders" subtitle="All orders belonging to this company.">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground"
                    >
                      No orders for this fleet.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <DataTableIdCell id={row.id} />
                      </TableCell>
                      <TableCell>{row.orderType}</TableCell>
                      <TableCell>{row.customer}</TableCell>
                      <TableCell>{row.payment}</TableCell>
                      <TableCell className="tabular-nums">
                        {naira(row.amount)}
                      </TableCell>
                      <TableCell>
                        {row.status !== "—" ? (
                          <StatusBadge status={row.status} />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {row.createdAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={row.href}>View</Link>
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
