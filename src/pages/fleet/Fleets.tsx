import { useMemo, useState } from "react";
import { useGetVehicles } from "@/api/fleet/vehicles/useVehicles";
import {
  parseFleetVehiclesListMeta,
  parseFleetVehiclesListPayload,
  type GetFleetVehiclesParams,
} from "@/api/fleet/vehicles/vehiclesApi";
import PageHeader from "@/components/admin/PageHeader";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type VehicleData,
} from "@/components/utilities/Fleet/VehicleTableFormat";
import Loader from "@/components/utilities/Loader";

const DEFAULT_LIMIT = 20;

const STATUS_VALUES = [
  "Available",
  "In Use",
  "Under Maintenance",
  "Disabled",
] as const;

function mapStatus(value: unknown): VehicleData["status"] {
  const status = value != null ? String(value) : "";
  if ((STATUS_VALUES as readonly string[]).includes(status)) {
    return status as VehicleData["status"];
  }
  return "Available";
}

function mapVehicleToRow(v: Record<string, unknown>): VehicleData {
  return {
    id: String(v.id ?? v.Id ?? "").trim(),
    model: v.model != null ? String(v.model) : "—",
    type: v.type != null ? String(v.type) : "—",
    status: mapStatus(v.status),
    plateNumber: v.plateNumber != null ? String(v.plateNumber) : "—",
  };
}

function Fleets() {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetFleetVehiclesParams>(() => {
    const params: GetFleetVehiclesParams = { limit };
    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }
    return params;
  }, [currentCursor, limit]);

  const { data, isLoading, isFetching, error } = useGetVehicles(queryParams);

  const vehicles = useMemo(() => parseFleetVehiclesListPayload(data), [data]);
  const meta = useMemo(() => parseFleetVehiclesListMeta(data), [data]);

  const tableData: VehicleData[] = useMemo(
    () => vehicles.map(mapVehicleToRow).filter((row) => row.id !== ""),
    [vehicles],
  );

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    vehicles.length >= limit;

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
      <div className="space-y-5">
        <PageHeader title="Vehicles" subtitle="Failed to load vehicles." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vehicles"
        subtitle={
          meta?.count != null
            ? `Manage vehicles · ${meta.count.toLocaleString("en-NG")} total`
            : "Manage all vehicles data and information"
        }
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

export default Fleets;
