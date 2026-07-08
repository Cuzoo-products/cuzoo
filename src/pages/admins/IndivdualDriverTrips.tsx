import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import NestedAdminPage from "@/components/admin/NestedAdminPage";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { DataTable } from "@/components/ui/data-table";
import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import {
  adminTripsListColumns,
  type AdminTripData,
} from "@/components/utilities/Admins/AdminTripsDataTable";
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

function buildSchedule(row: AdminTripListItem): string {
  const s = row.startTime ? formatWhen(row.startTime) : "—";
  const e = row.endTime ? formatWhen(row.endTime) : "—";
  if (s === "—" && e === "—") return "—";
  return `${s}\n–\n${e}`;
}

function mapRow(row: AdminTripListItem): AdminTripData {
  return {
    id: row.id,
    orderType: row.orderType ?? "—",
    status: row.status ?? "—",
    createdAt: formatWhen(row.createdAt ?? row.date),
    amount: naira(row.amount),
    schedule: buildSchedule(row),
  };
}

function viewPath(row: AdminTripData): string {
  const t = row.orderType?.toLowerCase() ?? "";
  if (t === "package") {
    return `/admins/trips/${row.id}`;
  }
  return `/admins/orders/${row.id}`;
}

export default function IndivdualDriverTrips() {
  const { id: routeId } = useParams<{ id: string }>();
  const driverId =
    routeId && routeId !== "undefined" && routeId !== "null"
      ? routeId
      : undefined;

  const [searchParams, setSearchParams] = useSearchParams();

  const urlFilters = useMemo(
    () => ({
      ...adminOrdersSearchParamsToParams(searchParams),
      ...(driverId ? { riderId: driverId } : {}),
    }),
    [searchParams, driverId],
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
      riderId: driverId,
      limit,
    };

    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }

    return params;
  }, [appliedFilters, currentCursor, driverId, limit]);

  const { data, isLoading, isFetching, isError } =
    useGetOrdersForAdmin(driverId ? queryParams : undefined);

  const trips = useMemo(() => parseAdminTripsPayload(data), [data]);
  const meta = useMemo(() => parseAdminOrdersListMeta(data), [data]);

  const tableData: AdminTripData[] = useMemo(
    () => trips.map(mapRow).filter((row) => row.id !== ""),
    [trips],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    trips.length >= limit;

  const resetPagination = () => {
    setCursorStack([undefined]);
  };

  const handleApplyFilters = (filters: GetAdminOrdersParams) => {
    const next = { ...filters, riderId: driverId };
    setAppliedFilters(next);
    resetPagination();
    setSearchParams(adminOrdersParamsToSearchParams(filters), {
      replace: true,
    });
  };

  const columns = useMemo(() => {
    const viewColumn = createViewActionsColumn<AdminTripData>({
      getHref: viewPath,
    });
    return [...adminTripsListColumns.slice(0, -1), viewColumn];
  }, []);

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

  const driverLabel = useMemo(() => {
    const name = trips[0]?.driver?.trim();
    return name || "Driver";
  }, [trips]);

  const driverBack = `/admins/drivers/${driverId ?? ""}`;
  const crumbs = [
    { label: "Dashboard", href: "/admins/dashboard" },
    { label: "Riders", href: "/admins/drivers" },
    { label: "Driver", href: driverBack },
    { label: "Trips" },
  ];

  if (!driverId) {
    return (
      <NestedAdminPage
        backHref="/admins/drivers"
        backLabel="Riders"
        crumbs={crumbs}
        title="Driver trips"
        subtitle="No driver ID in the URL."
      >
        <></>
      </NestedAdminPage>
    );
  }

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <NestedAdminPage
        backHref={driverBack}
        backLabel="Driver"
        crumbs={crumbs}
        title="Driver trips"
        subtitle="Failed to load trips for this driver."
      >
        <></>
      </NestedAdminPage>
    );
  }

  const subtitle = `Shopping and package orders assigned to this driver${
    meta?.count != null ? ` · ${meta.count.toLocaleString("en-NG")} total` : ""
  }`;

  return (
    <NestedAdminPage
      backHref={driverBack}
      backLabel="Driver"
      crumbs={crumbs}
      title={`${driverLabel} trips`}
      subtitle={subtitle}
    >
      <div className="space-y-5">
        <AdminOrdersFilters
          key={searchParams.toString()}
          initialValues={filterFormFromUrl}
          onApply={handleApplyFilters}
          hiddenFields={["riderId"]}
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
    </NestedAdminPage>
  );
}
