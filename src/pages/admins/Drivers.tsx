import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type DriverData,
} from "@/components/utilities/Admins/AdminDriversDataTable";
import AdminRidersFilters, {
  ridersParamsToSearchParams,
  ridersSearchParamsToForm,
  ridersSearchParamsToParams,
} from "@/components/utilities/Admins/AdminRidersFilters";
import { useGetRiders } from "@/api/admin/riders/useRiders";
import {
  parseRidersListMeta,
  parseRidersListPayload,
  type GetRidersParams,
} from "@/api/admin/riders/riders";
import Loader from "@/components/utilities/Loader";

const DEFAULT_LIMIT = 20;

function mapRiderToRow(r: Record<string, unknown>): DriverData {
  const riderId = String(r.Id ?? r.id ?? r._id ?? "").trim();
  const firstName = r.firstName != null ? String(r.firstName) : "";
  const lastName = r.lastName != null ? String(r.lastName) : "";
  const name = `${firstName} ${lastName}`.trim() || riderId;
  const isActive = Boolean(r.approved) && !Boolean(r.suspended);

  return {
    id: riderId,
    name,
    email: r.email != null ? String(r.email) : "—",
    status: isActive ? "Active" : "Disabled",
  };
}

function DriversInAdmin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilters = useMemo(
    () => ridersSearchParamsToParams(searchParams),
    [searchParams],
  );
  const filterFormFromUrl = useMemo(
    () => ridersSearchParamsToForm(searchParams),
    [searchParams],
  );

  const [appliedFilters, setAppliedFilters] =
    useState<GetRidersParams>(urlFilters);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  useEffect(() => {
    setAppliedFilters(urlFilters);
    setCursorStack([undefined]);
  }, [urlFilters]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetRidersParams>(() => {
    const params: GetRidersParams = {
      ...appliedFilters,
      limit,
    };

    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }

    return params;
  }, [appliedFilters, currentCursor, limit]);

  const { data: ridersData, isLoading, isFetching, error } = useGetRiders(
    queryParams,
  );

  const riders = useMemo(
    () => parseRidersListPayload(ridersData),
    [ridersData],
  );

  const meta = useMemo(
    () => parseRidersListMeta(ridersData),
    [ridersData],
  );

  const tableData: DriverData[] = useMemo(
    () => riders.map(mapRiderToRow),
    [riders],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    riders.length >= limit;

  const resetPagination = () => {
    setCursorStack([undefined]);
  };

  const handleApplyFilters = (filters: GetRidersParams) => {
    setAppliedFilters(filters);
    resetPagination();
    setSearchParams(ridersParamsToSearchParams(filters), { replace: true });
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

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="space-y-5">
        <PageHeader title="Riders" subtitle="Failed to load drivers." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Riders"
        subtitle={
          meta?.count != null
            ? `Manage all riders · ${meta.count.toLocaleString("en-NG")} total`
            : "Manage all riders data and information"
        }
      />

      <AdminRidersFilters
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

export default DriversInAdmin;
