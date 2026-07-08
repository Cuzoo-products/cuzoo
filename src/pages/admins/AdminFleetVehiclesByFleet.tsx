import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import NestedAdminPage from "@/components/admin/NestedAdminPage";
import BackendCursorPagination from "@/components/admin/BackendCursorPagination";
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
import { useGetVehicles } from "@/api/admin/vehicle/useVehicle";
import {
  parseVehiclesListMeta,
  parseVehiclesListPayload,
  type GetVehiclesParams,
} from "@/api/admin/vehicle/vehicle";
import Loader from "@/components/utilities/Loader";

const DEFAULT_LIMIT = 20;

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
  const { id: routeId } = useParams<{ id: string }>();
  const fleetId =
    routeId && routeId !== "undefined" && routeId !== "null"
      ? routeId
      : undefined;

  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [cursorStack, setCursorStack] = useState<
    (number | string | undefined)[]
  >([undefined]);

  const currentCursor = cursorStack[cursorStack.length - 1];

  const queryParams = useMemo<GetVehiclesParams>(() => {
    const params: GetVehiclesParams = {
      companyId: fleetId,
      limit,
    };

    if (currentCursor != null && currentCursor !== "") {
      params.cursor = currentCursor;
    }

    return params;
  }, [currentCursor, fleetId, limit]);

  const { data: payload, isLoading, isFetching, isError } = useGetVehicles(
    fleetId ? queryParams : undefined,
  );

  const meta = useMemo(() => parseVehiclesListMeta(payload), [payload]);

  const vehicles = useMemo(() => {
    return parseVehiclesListPayload(payload) as FleetVehicleApi[];
  }, [payload]);

  const pageIndex = cursorStack.length - 1;
  const hasPrevious = pageIndex > 0;
  const hasNext =
    meta?.lastCursor != null &&
    meta.lastCursor !== "" &&
    vehicles.length >= limit;

  const resetPagination = () => {
    setCursorStack([undefined]);
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

  const fleetBack = `/admins/fleet_managers/${fleetId ?? ""}`;
  const crumbs = [
    { label: "Dashboard", href: "/admins/dashboard" },
    { label: "Fleet Managers", href: "/admins/fleet_managers" },
    { label: "Fleet", href: fleetBack },
    { label: "Vehicles" },
  ];

  if (!fleetId) {
    return (
      <NestedAdminPage
        backHref="/admins/fleet_managers"
        backLabel="Fleet Managers"
        crumbs={crumbs}
        title="Fleet vehicles"
        subtitle="No fleet ID in the URL."
      >
        <></>
      </NestedAdminPage>
    );
  }

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
    meta?.count != null ? ` · ${meta.count.toLocaleString("en-NG")} total` : ""
  }`;

  return (
    <NestedAdminPage
      backHref={fleetBack}
      backLabel="Fleet"
      crumbs={crumbs}
      title="Fleet vehicles"
      subtitle={subtitle}
    >
      <div className="space-y-5">
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
                  <TableHead className="text-right">Action</TableHead>
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
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
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
