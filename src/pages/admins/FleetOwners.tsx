import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type FleetManagerData,
} from "@/components/utilities/Admins/FleetManagersDataTable";
import AdminFleetManagersFilters, {
  fleetManagersParamsToSearchParams,
  fleetManagersSearchParamsToForm,
  fleetManagersSearchParamsToParams,
} from "@/components/utilities/Admins/AdminFleetManagersFilters";
import { useGetAllFleets } from "@/api/admin/fleet/useFleet";
import {
  parseFleetManagersListMeta,
  parseFleetManagersListPayload,
  type GetFleetManagersParams,
} from "@/api/admin/fleet/fleetApi";
import Loader from "@/components/utilities/Loader";

const DEFAULT_LIMIT = 20;

function mapFleetToRow(f: Record<string, unknown>): FleetManagerData {
  const id = String(f.Id ?? f.id ?? f._id ?? "").trim();

  return {
    id,
    businessName: f.businessName != null ? String(f.businessName) : "—",
    email: f.email != null ? String(f.email) : "—",
    approvalStatus:
      f.approvalStatus != null
        ? String(f.approvalStatus)
        : f.approved === true
          ? "Approved"
          : f.approved === false
            ? "Pending"
            : "—",
  };
}

function FleetOwners() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilters = useMemo(
    () => fleetManagersSearchParamsToParams(searchParams),
    [searchParams],
  );
  const filterFormFromUrl = useMemo(
    () => fleetManagersSearchParamsToForm(searchParams),
    [searchParams],
  );

  const [appliedFilters, setAppliedFilters] =
    useState<GetFleetManagersParams>(urlFilters);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  useEffect(() => {
    setAppliedFilters(urlFilters);
    setCursorStack([undefined]);
  }, [urlFilters]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetFleetManagersParams>(() => {
    const params: GetFleetManagersParams = {
      ...appliedFilters,
      limit,
    };

    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }

    return params;
  }, [appliedFilters, currentCursor, limit]);

  const { data: fleetData, isLoading, isFetching, error } =
    useGetAllFleets(queryParams);

  const fleets = useMemo(
    () => parseFleetManagersListPayload(fleetData),
    [fleetData],
  );

  const meta = useMemo(
    () => parseFleetManagersListMeta(fleetData),
    [fleetData],
  );

  const tableData: FleetManagerData[] = useMemo(
    () => fleets.map(mapFleetToRow).filter((row) => row.id !== ""),
    [fleets],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    fleets.length >= limit;

  const resetPagination = () => {
    setCursorStack([undefined]);
  };

  const handleApplyFilters = (filters: GetFleetManagersParams) => {
    setAppliedFilters(filters);
    resetPagination();
    setSearchParams(fleetManagersParamsToSearchParams(filters), {
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

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="space-y-5">
        <PageHeader
          title="Fleet Managers"
          subtitle="Failed to load fleet managers."
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Fleet Managers"
        subtitle={
          meta?.count != null
            ? `Manage all fleet managers · ${meta.count.toLocaleString("en-NG")} total`
            : "Manage all fleet managers data and information"
        }
      />

      <AdminFleetManagersFilters
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

export default FleetOwners;
