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
import AdminOrdersFilters, {
  adminOrdersParamsToSearchParams,
  adminOrdersSearchParamsToForm,
  adminOrdersSearchParamsToParams,
} from "@/components/utilities/Admins/AdminOrdersFilters";
import { useGetOrdersForAdmin } from "@/api/admin/orders/useOrders";
import {
  parseAdminOrdersListMeta,
  type GetAdminOrdersParams,
} from "@/api/admin/orders/orders";
import {
  parseAdminTripsPayload,
  type AdminTripListItem,
} from "@/api/admin/trips/trips";
import Loader from "@/components/utilities/Loader";
import { DataTableIdCell } from "@/components/ui/data-table-id-cell";

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

function summaryText(row: AdminTripListItem): string {
  const t = row.orderType?.toLowerCase() ?? "";
  if (t === "shopping") {
    const parts = [row.vendor, row.customer].filter(Boolean);
    return parts.length ? parts.join(" · ") : "—";
  }
  if (t === "package") {
    const from = row.from?.trim() || "";
    const dest = row.destinations?.filter(Boolean).length
      ? row.destinations!.join(", ")
      : "";
    const parts = [from, dest].filter(Boolean);
    return parts.length ? parts.join(" → ") : "—";
  }
  return "—";
}

function ItemsCell({ row }: { row: AdminTripListItem }) {
  const t = row.orderType?.toLowerCase() ?? "";
  if (t !== "shopping" || !row.items?.length) {
    return <span className="text-muted-foreground">—</span>;
  }
  const lines = row.items.map((i) => {
    const q = i.quantity != null ? String(i.quantity) : "";
    const n = i.name ?? "";
    return q ? `${q}× ${n}` : n || "—";
  });
  return (
    <div className="max-h-36 max-w-[min(280px,100%)] min-w-0 overflow-y-auto pr-1">
      <div className="flex min-w-0 w-full flex-col gap-1">
        {lines.map((line, index) => (
          <div
            key={index}
            className="min-w-0 truncate text-left text-sm leading-snug"
            title={line}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function viewPath(row: AdminTripListItem): string {
  const t = row.orderType?.toLowerCase() ?? "";
  if (t === "package") {
    return `/admins/trips/${row.id}`;
  }
  return `/admins/orders/${row.id}`;
}

export default function AdminUserOrdersByUser() {
  const { id } = useParams<{ id: string }>();
  const userId = id ?? "";
  const [searchParams, setSearchParams] = useSearchParams();

  const urlFilters = useMemo(
    () => ({
      ...adminOrdersSearchParamsToParams(searchParams),
      userId,
    }),
    [searchParams, userId],
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
      userId,
      limit,
    };

    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }

    return params;
  }, [appliedFilters, currentCursor, limit, userId]);

  const { data: payload, isLoading, isFetching, isError } =
    useGetOrdersForAdmin(queryParams);

  const rows = useMemo(() => parseAdminTripsPayload(payload), [payload]);
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
    const next = { ...filters, userId };
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

  const userBack = `/admins/users/${encodeURIComponent(userId)}`;
  const crumbs = [
    { label: "Dashboard", href: "/admins/dashboard" },
    { label: "Users", href: "/admins/users" },
    { label: "User", href: userBack },
    { label: "Orders" },
  ];

  if (!userId) {
    return (
      <NestedAdminPage
        backHref="/admins/users"
        backLabel="Users"
        crumbs={crumbs}
        title="User orders"
        subtitle="No user ID in the URL."
      >
        <></>
      </NestedAdminPage>
    );
  }

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <NestedAdminPage
        backHref={userBack}
        backLabel="User"
        crumbs={crumbs}
        title="User orders"
        subtitle="Failed to load orders for this user."
      >
        <></>
      </NestedAdminPage>
    );
  }

  const subtitle = `Orders linked to this user${
    meta?.count != null ? ` · ${meta.count.toLocaleString("en-NG")} total` : ""
  }`;

  return (
    <NestedAdminPage
      backHref={userBack}
      backLabel="User"
      crumbs={crumbs}
      title="User orders"
      subtitle={subtitle}
    >
      <div className="space-y-5">
        <AdminOrdersFilters
          key={searchParams.toString()}
          initialValues={filterFormFromUrl}
          onApply={handleApplyFilters}
          hiddenFields={["userId"]}
        />

        <Section
          title="Orders"
          subtitle="Shopping and package rows may appear together. Use View to open the correct admin screen."
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Items</TableHead>
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
                      No orders for this user.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <DataTableIdCell id={row.id} />
                      </TableCell>
                      <TableCell>{row.orderType ?? "—"}</TableCell>
                      <TableCell className="max-w-[220px]">
                        <span
                          className="line-clamp-2 text-sm"
                          title={summaryText(row)}
                        >
                          {summaryText(row)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ItemsCell row={row} />
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {naira(row.amount)}
                      </TableCell>
                      <TableCell>
                        {row.status ? (
                          <StatusBadge status={row.status} />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatWhen(row.createdAt ?? row.date)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={viewPath(row)}>View</Link>
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
