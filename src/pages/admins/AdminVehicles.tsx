import { useMemo } from "react";
import PageHeader from "@/components/admin/PageHeader";
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

/** Non-empty riderId means the vehicle is assigned to a driver. */
function hasAssignedRiderId(v: VehicleApi): boolean {
  const r = v.riderId;
  if (r == null) return false;
  if (typeof r === "string") return r.trim() !== "";
  return String(r).trim() !== "";
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
      rawList.map((v, index) => {
        const riderIdStr =
          v.riderId != null && String(v.riderId).trim() !== ""
            ? String(v.riderId).trim()
            : "—";
        return {
          id: rowId(v, index),
          plateNumber: v.plateNumber ?? "—",
          model: v.model ?? "—",
          type: v.type ?? "—",
          year: v.year != null ? String(v.year) : "—",
          color: v.color ?? "—",
          companyId: v.companyId ?? "—",
          riderId: riderIdStr,
          assigned: hasAssignedRiderId(v) ? "Yes" : "No",
          status: v.status ?? "—",
        };
      }),
    [rawList],
  );

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
        subtitle={`All registered vehicles${meta.count != null ? ` · ${meta.count} total` : ""}${meta.limit != null ? ` (limit ${meta.limit})` : ""}`}
      />

      <DataTable adminVariant searchPlaceholder="Search..." columns={columns} data={tableData} />
    </div>
  );
}
