import { useMemo } from "react";
import { Link, useParams } from "react-router";
import NestedAdminPage from "@/components/admin/NestedAdminPage";
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
import { useGetVehicleByFleetId } from "@/api/admin/vehicle/useVehicle";
import Loader from "@/components/utilities/Loader";

type FleetVehicleApi = {
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
  image?: { path?: string; url?: string; type?: string };
};

type FleetVehiclesListResponse = {
  success?: boolean;
  statusCode?: number;
  data?: {
    count?: number;
    lastCursor?: number;
    limit?: number;
    data?: FleetVehicleApi[];
  };
};

function parseFleetVehicleList(payload: unknown): FleetVehicleApi[] {
  if (payload == null || typeof payload !== "object") return [];
  const root = payload as { data?: { data?: unknown } };
  const list = root.data?.data;
  if (!Array.isArray(list)) return [];
  return list.filter(
    (x) => x != null && typeof x === "object",
  ) as FleetVehicleApi[];
}

function rowId(v: FleetVehicleApi, index: number): string {
  const raw =
    v.id != null && String(v.id).trim() !== ""
      ? String(v.id)
      : v.plateNumber != null && String(v.plateNumber).trim() !== ""
        ? String(v.plateNumber)
        : `idx-${index}`;
  return raw;
}

function hasAssignedRiderId(v: FleetVehicleApi): boolean {
  const r = v.riderId;
  if (r == null) return false;
  if (typeof r === "string") return r.trim() !== "";
  return String(r).trim() !== "";
}

export default function AdminFleetVehiclesByFleet() {
  const { id } = useParams<{ id: string }>();
  const fleetId = id ?? "";
  const fleetBack = `/admins/fleet_managers/${encodeURIComponent(fleetId)}`;

  const { data: payload, isLoading, isError } = useGetVehicleByFleetId(fleetId);

  const meta = useMemo(() => {
    const p = payload as FleetVehiclesListResponse | undefined;
    return {
      count: p?.data?.count,
      lastCursor: p?.data?.lastCursor,
      limit: p?.data?.limit,
    };
  }, [payload]);

  const vehicles = useMemo(() => parseFleetVehicleList(payload), [payload]);

  const crumbs = [
    { label: "Dashboard", href: "/admins/dashboard" },
    { label: "Fleet Managers", href: "/admins/fleet_managers" },
    { label: "Fleet", href: fleetBack },
    { label: "Vehicles" },
  ];

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <NestedAdminPage
        backHref={fleetBack}
        backLabel="Fleet"
        crumbs={crumbs}
        title="Fleet vehicles"
        subtitle="Failed to load vehicles for this fleet."
      >
        <></>
      </NestedAdminPage>
    );
  }

  const subtitle = `Vehicles linked to this fleet manager${
    meta.count != null ? ` · ${meta.count} total` : ""
  }${meta.limit != null ? ` (limit ${meta.limit})` : ""}`;

  return (
    <NestedAdminPage
      backHref={fleetBack}
      backLabel="Fleet"
      crumbs={crumbs}
      title="Fleet vehicles"
      subtitle={subtitle}
    >
      <Section
        title="Vehicles"
        subtitle={`Company ID ${fleetId}`}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plate</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead className="w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-[var(--admin-text-muted)]"
                  >
                    No vehicles for this fleet.
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map((v, index) => {
                  const vid = rowId(v, index);
                  return (
                    <TableRow key={vid}>
                      <TableCell className="font-mono text-sm">
                        {v.plateNumber ?? "—"}
                      </TableCell>
                      <TableCell>{v.model ?? "—"}</TableCell>
                      <TableCell className="capitalize">
                        {v.type ?? "—"}
                      </TableCell>
                      <TableCell>
                        {v.year != null ? String(v.year) : "—"}
                      </TableCell>
                      <TableCell>{v.color ?? "—"}</TableCell>
                      <TableCell>
                        {v.status ? (
                          <StatusBadge status={v.status} />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {hasAssignedRiderId(v) ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        <Button asChild variant="ghost" size="sm" className="h-8">
                          <Link
                            to={`/admins/vehicles/${encodeURIComponent(vid)}`}
                          >
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Section>
    </NestedAdminPage>
  );
}
