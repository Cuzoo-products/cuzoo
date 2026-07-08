import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { useGetVehicles } from "@/api/admin/vehicle/useVehicle";
import { DataTable } from "@/components/ui/data-table";
import Loader from "@/components/utilities/Loader";
import {
  columns,
  type AdminVehicleData,
} from "@/components/utilities/Admins/AdminVehiclesDataTable";
import AdminVehiclesFilters, {
  vehiclesParamsToSearchParams,
  vehiclesSearchParamsToForm,
  vehiclesSearchParamsToParams,
} from "@/components/utilities/Admins/AdminVehiclesFilters";
import {
  parseVehiclesListMeta,
  parseVehiclesListPayload,
  type GetVehiclesParams,
} from "@/api/admin/vehicle/vehicle";

const DEFAULT_LIMIT = 20;

function rowId(v: Record<string, unknown>, index: number): string {
  const id = v.id != null ? String(v.id).trim() : "";
  if (id) return id;
  const plate =
    v.plateNumber != null ? String(v.plateNumber).trim() : "";
  if (plate) return plate;
  return `idx-${index}`;
}

function hasAssignedRiderId(v: Record<string, unknown>): boolean {
  const r = v.riderId;
  if (r == null) return false;
  if (typeof r === "string") return r.trim() !== "";
  return String(r).trim() !== "";
}

function mapVehicleToRow(v: Record<string, unknown>, index: number): AdminVehicleData {
  const riderIdStr =
    v.riderId != null && String(v.riderId).trim() !== ""
      ? String(v.riderId).trim()
      : "—";

  return {
    id: rowId(v, index),
    plateNumber: v.plateNumber != null ? String(v.plateNumber) : "—",
    model: v.model != null ? String(v.model) : "—",
    type: v.type != null ? String(v.type) : "—",
    year: v.year != null ? String(v.year) : "—",
    color: v.color != null ? String(v.color) : "—",
    companyId: v.companyId != null ? String(v.companyId) : "—",
    riderId: riderIdStr,
    assigned: hasAssignedRiderId(v) ? "Yes" : "No",
    status: v.status != null ? String(v.status) : "—",
  };
}

export default function AdminVehicles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilters = useMemo(
    () => vehiclesSearchParamsToParams(searchParams),
    [searchParams],
  );
  const filterFormFromUrl = useMemo(
    () => vehiclesSearchParamsToForm(searchParams),
    [searchParams],
  );

  const [appliedFilters, setAppliedFilters] =
    useState<GetVehiclesParams>(urlFilters);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  useEffect(() => {
    setAppliedFilters(urlFilters);
    setCursorStack([undefined]);
  }, [urlFilters]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetVehiclesParams>(() => {
    const params: GetVehiclesParams = {
      ...appliedFilters,
      limit,
    };

    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }

    return params;
  }, [appliedFilters, currentCursor, limit]);

  const { data: payload, isLoading, isFetching, isError } =
    useGetVehicles(queryParams);

  const rawList = useMemo(
    () => parseVehiclesListPayload(payload),
    [payload],
  );

  const meta = useMemo(() => parseVehiclesListMeta(payload), [payload]);

  const tableData: AdminVehicleData[] = useMemo(
    () => rawList.map(mapVehicleToRow),
    [rawList],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    rawList.length >= limit;

  const resetPagination = () => {
    setCursorStack([undefined]);
  };

  const handleApplyFilters = (filters: GetVehiclesParams) => {
    setAppliedFilters(filters);
    resetPagination();
    setSearchParams(vehiclesParamsToSearchParams(filters), { replace: true });
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

  if (isError) {
    return (
      <div className="space-y-5">
        <PageHeader
          title="Vehicles"
          subtitle="Failed to load vehicles. Check that GET /admins/vehicles is available."
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vehicles"
        subtitle={
          meta?.count != null
            ? `All registered vehicles · ${meta.count.toLocaleString("en-NG")} total`
            : "All registered vehicles"
        }
      />

      <AdminVehiclesFilters
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
