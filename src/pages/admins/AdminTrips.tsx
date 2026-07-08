import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { DataTable } from "@/components/ui/data-table";
import {
  adminTripsListColumns,
  type AdminTripData,
} from "@/components/utilities/Admins/AdminTripsDataTable";
import AdminOrdersFilters, {
  adminOrdersParamsToSearchParams,
  adminOrdersSearchParamsToForm,
  adminOrdersSearchParamsToParams,
} from "@/components/utilities/Admins/AdminOrdersFilters";
import { useGetAdminTrips } from "@/api/admin/trips/useTrips";
import {
  parseAdminTripsPayload,
  type AdminTripListItem,
} from "@/api/admin/trips/trips";
import {
  parseAdminOrdersListMeta,
  type GetAdminOrdersParams,
} from "@/api/admin/orders/orders";
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
    orderType: row.orderType ?? "Package",
    status: row.status ?? "—",
    createdAt: formatWhen(row.createdAt ?? row.date),
    amount: naira(row.amount),
    schedule: buildSchedule(row),
  };
}

export default function AdminTrips() {
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
      orderType: "Package",
      limit,
    };

    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }

    return params;
  }, [appliedFilters, currentCursor, limit]);

  const { data, isLoading, isFetching, error } = useGetAdminTrips(queryParams);

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
        <PageHeader title="Trips" subtitle="Failed to load trips." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Trips"
        subtitle={
          meta?.count != null
            ? `Package delivery trips · ${meta.count.toLocaleString("en-NG")} total`
            : "Manage package delivery trips"
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
        columns={adminTripsListColumns}
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
