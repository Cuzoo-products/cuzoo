import { useMemo } from "react";
import { useGetVehicles } from "@/api/admin/vehicle/useVehicle";
import { DataTable } from "@/components/ui/data-table";
import Loader from "@/components/utilities/Loader";
import {
  columns,
  type AdminVehicleData,
} from "@/components/utilities/Admins/AdminVehiclesDataTable";

type VehicleApi = {
  id?: string;
  color?: string;
  model?: string;
  type?: string;
  plateNumber?: string;
  companyId?: string;
  year?: number;
  assigned?: boolean;
  riderId?: string;
  status?: string;
};

type VehiclesListResponse = {
  success?: boolean;
  data?: {
    count?: number;
    limit?: number;
    data?: VehicleApi[];
  };
};

function parseVehicleList(payload: unknown): VehicleApi[] {
  if (payload == null || typeof payload !== "object") return [];
  const root = payload as { data?: { data?: unknown } };
  const list = root.data?.data;
  if (!Array.isArray(list)) return [];
  return list.filter((x) => x != null && typeof x === "object") as VehicleApi[];
}

function rowId(v: VehicleApi, index: number): string {
  const raw =
    v.id != null && String(v.id).trim() !== ""
      ? String(v.id)
      : v.plateNumber != null && String(v.plateNumber).trim() !== ""
        ? String(v.plateNumber)
        : `idx-${index}`;
  return raw;
}

export default function AdminVehicles() {
  const { data: payload, isLoading, isError } = useGetVehicles();

  const meta = useMemo(() => {
    const p = payload as VehiclesListResponse | undefined;
    return {
      count: p?.data?.count,
      limit: p?.data?.limit,
    };
  }, [payload]);

  const rawList = useMemo(() => parseVehicleList(payload), [payload]);

  const tableData: AdminVehicleData[] = useMemo(
    () =>
      rawList.map((v, index) => ({
        id: rowId(v, index),
        plateNumber: v.plateNumber ?? "—",
        model: v.model ?? "—",
        type: v.type ?? "—",
        year: v.year != null ? String(v.year) : "—",
        color: v.color ?? "—",
        companyId: v.companyId ?? "—",
        riderId: v.riderId ?? "—",
        assigned: v.assigned === true ? "Yes" : v.assigned === false ? "No" : "—",
        status: v.status ?? "—",
      })),
    [rawList],
  );

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="@container/main p-6">
        <h3 className="!font-bold text-3xl">Vehicles</h3>
        <p className="mt-2 text-sm text-destructive">
          Failed to load vehicles. Check that GET /admins/vehicles is available.
        </p>
      </div>
    );
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Vehicles</h3>
        <p className="text-muted-foreground">
          All registered vehicles
          {meta.count != null ? (
            <span className="text-foreground"> · {meta.count} total</span>
          ) : null}
          {meta.limit != null ? (
            <span className="text-muted-foreground"> (limit {meta.limit})</span>
          ) : null}
        </p>
      </div>

      <DataTable columns={columns} data={tableData} />
    </div>
  );
}
