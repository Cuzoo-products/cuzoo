import { useMemo } from "react";
import { useParams, Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="@container/main p-6">
        <h3 className="!font-bold text-3xl">Fleet vehicles</h3>
        <p className="mt-2 text-sm text-destructive">
          Failed to load vehicles for this fleet.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to={`/admins/fleet_managers/${encodeURIComponent(fleetId)}`}>
            Back to fleet
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="@container/main">
      <div className="my-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Fleet vehicles</h3>
          <p className="text-muted-foreground">
            Vehicles linked to this fleet manager
            {meta.count != null ? (
              <span className="text-foreground"> · {meta.count} total</span>
            ) : null}
            {meta.limit != null ? (
              <span className="text-muted-foreground">
                {" "}
                (limit {meta.limit})
              </span>
            ) : null}
            {meta.lastCursor != null ? (
              <span className="text-muted-foreground text-xs ml-1">
                · cursor {String(meta.lastCursor)}
              </span>
            ) : null}
          </p>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link to={`/admins/fleet_managers/${encodeURIComponent(fleetId)}`}>
            Back to fleet
          </Link>
        </Button>
      </div>

      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
          <CardDescription>
            All vehicles returned for company ID{" "}
            <span className="font-mono text-xs">{fleetId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
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

                  <TableHead className="w-[100px]"> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground py-10"
                    >
                      No vehicles for this fleet.
                    </TableCell>
                  </TableRow>
                ) : (
                  vehicles.map((v, index) => {
                    const vid = rowId(v, index);
                    const riderIdDisplay =
                      v.riderId != null && String(v.riderId).trim() !== ""
                        ? String(v.riderId).trim()
                        : "—";
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
                        <TableCell className="capitalize">
                          {v.status ?? "—"}
                        </TableCell>
                        <TableCell>
                          {hasAssignedRiderId(v) ? "Yes" : "No"}
                        </TableCell>

                        <TableCell>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8"
                          >
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
        </CardContent>
      </Card>
    </div>
  );
}
