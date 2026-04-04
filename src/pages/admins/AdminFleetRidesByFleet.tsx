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
import Loader from "@/components/utilities/Loader";
import { useGetOrdersForAdminByCompanyId } from "@/api/admin/orders/useOrders";
import { parseAdminTripsPayload } from "@/api/admin/trips/trips";

const PACKAGE_ORDER_TYPE = "Package";

type TripRow = ReturnType<typeof parseAdminTripsPayload>[number];

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

function scheduleText(row: TripRow): string {
  const s = row.startTime ? formatWhen(row.startTime) : "—";
  const e = row.endTime ? formatWhen(row.endTime) : "—";
  if (s === "—" && e === "—") return "—";
  return `${s}\n–\n${e}`;
}

function DestinationsCell({ row }: { row: TripRow }) {
  const list = row.destinations?.filter((d) => String(d).trim() !== "") ?? [];
  if (!list.length) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <div className="max-h-36 max-w-[min(280px,100%)] min-w-0 overflow-y-auto pr-1">
      <div className="flex min-w-0 w-full flex-col gap-1">
        {list.map((line, index) => (
          <div
            key={index}
            className="min-w-0 truncate text-left text-sm leading-snug"
            title={String(line)}
          >
            {String(line)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminFleetRidesByFleet() {
  const { id: routeId } = useParams<{ id: string }>();
  const fleetId =
    routeId && routeId !== "undefined" && routeId !== "null"
      ? routeId
      : undefined;

  const { data: payload, isLoading, isError } =
    useGetOrdersForAdminByCompanyId(PACKAGE_ORDER_TYPE, fleetId);

  const rows = useMemo(() => parseAdminTripsPayload(payload), [payload]);

  const meta = useMemo(() => {
    const root = payload as
      | { data?: { count?: number; limit?: number } }
      | undefined;
    return {
      count: root?.data?.count,
      limit: root?.data?.limit,
    };
  }, [payload]);

  if (!fleetId) {
    return (
      <div className="@container/main p-6">
        <h3 className="!font-bold text-3xl">Fleet rides</h3>
        <p className="mt-2 text-sm text-destructive">No fleet ID in the URL.</p>
      </div>
    );
  }

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="@container/main p-6">
        <h3 className="!font-bold text-3xl">Fleet rides</h3>
        <p className="mt-2 text-sm text-destructive">
          Failed to load rides for this fleet.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to={`/admins/fleet_managers/${fleetId}`}>Back to fleet</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="@container/main">
      <div className="my-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Fleet rides</h3>
          <p className="text-muted-foreground">
            Package trips for riders under this fleet
            {meta.count != null ? (
              <span className="text-foreground"> · {meta.count} total</span>
            ) : null}  
             
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/admins/fleet_managers/${fleetId}`}>Back to fleet</Link>
        </Button>
      </div>

      <Card className="bg-secondary py-4">
        <CardHeader>
          <CardTitle>Rides</CardTitle>
          <CardDescription>Package trips for this fleet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ride ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Destinations</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center text-muted-foreground"
                  >
                    No rides for this fleet.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="max-w-[140px] font-mono text-xs">
                      <span className="line-clamp-2" title={row.id}>
                        {row.id}
                      </span>
                    </TableCell>
                    <TableCell>{row.orderType ?? "—"}</TableCell>
                    <TableCell className="max-w-[160px]">
                      <span
                        className="line-clamp-2 text-sm"
                        title={row.from ?? ""}
                      >
                        {row.from?.trim() || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DestinationsCell row={row} />
                    </TableCell>
                    <TableCell className="max-w-[140px]">
                      <span
                        className="line-clamp-2 text-sm"
                        title={row.driver ?? ""}
                      >
                        {row.driver?.trim() || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {naira(row.amount)}
                    </TableCell>
                    <TableCell className="capitalize">{row.status ?? "—"}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatWhen(row.createdAt ?? row.date)}
                    </TableCell>
                    <TableCell className="max-w-[180px] whitespace-pre-wrap text-xs leading-snug text-muted-foreground">
                      {scheduleText(row)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admins/trips/${row.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
