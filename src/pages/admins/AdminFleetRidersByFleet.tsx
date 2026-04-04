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
import { useGetRidersByFleetId } from "@/api/admin/riders/useRiders";
import { parseRidersListPayload } from "@/api/admin/riders/riders";

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

function pickId(raw: Record<string, unknown>): string {
  const v = raw.Id ?? raw.id;
  return v != null ? String(v).trim() : "";
}

function pickPhone(raw: Record<string, unknown>): string {
  const pn = raw.phoneNumber;
  if (pn == null || typeof pn !== "object") return "—";
  const o = pn as Record<string, unknown>;
  const intl = o.internationalFormat ?? o.nationalFormat ?? o.number;
  return intl != null ? String(intl) : "—";
}

function statusLabel(raw: Record<string, unknown>): string {
  if (raw.suspended === true) return "Suspended";
  if (raw.approved === true) return "Active";
  return "Pending";
}

export default function AdminFleetRidersByFleet() {
  const { id: routeId } = useParams<{ id: string }>();
  const fleetId =
    routeId && routeId !== "undefined" && routeId !== "null"
      ? routeId
      : undefined;

  const { data: payload, isLoading, isError } = useGetRidersByFleetId(fleetId);

  const rawRows = useMemo(() => parseRidersListPayload(payload), [payload]);

  const rows = useMemo(() => {
    return rawRows.map((r) => {
      const id = pickId(r);
      const first = r.firstName != null ? String(r.firstName) : "";
      const last = r.lastName != null ? String(r.lastName) : "";
      const name = [first, last].filter(Boolean).join(" ").trim() || "—";
      const email = r.email != null ? String(r.email) : "—";
      return {
        id,
        name,
        email,
        phone: pickPhone(r),
        status: statusLabel(r),
        companyName:
          r.companyName != null ? String(r.companyName) : "—",
        createdAt: formatWhen(
          r.createdAt != null ? String(r.createdAt) : undefined,
        ),
      };
    });
  }, [rawRows]);

  if (!fleetId) {
    return (
      <div className="@container/main p-6">
        <h3 className="!font-bold text-3xl">Fleet riders</h3>
        <p className="mt-2 text-sm text-destructive">No fleet ID in the URL.</p>
      </div>
    );
  }

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="@container/main p-6">
        <h3 className="!font-bold text-3xl">Fleet riders</h3>
        <p className="mt-2 text-sm text-destructive">
          Failed to load riders for this fleet.
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
          <h3 className="!font-bold text-3xl">Fleet riders</h3>
          <p className="text-muted-foreground">
            Riders linked to this fleet manager
            {payload?.data?.count != null ? (
              <span className="text-foreground">
                {" "}
                · {payload.data.count} total
              </span>
            ) : null}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/admins/fleet_managers/${fleetId}`}>Back to fleet</Link>
        </Button>
      </div>

      <Card className="bg-secondary py-4">
        <CardHeader>
          <CardTitle>Riders</CardTitle>
          <CardDescription>
            Riders linked to this fleet manager.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rider ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground"
                  >
                    No riders for this fleet.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id || r.email}>
                    <TableCell className="max-w-[120px] font-mono text-xs">
                      <span className="line-clamp-2" title={r.id}>
                        {r.id || "—"}
                      </span>
                    </TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell className="max-w-[180px] truncate text-sm">
                      {r.email}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {r.phone}
                    </TableCell>
                    <TableCell className="max-w-[140px] truncate text-sm">
                      {r.companyName}
                    </TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {r.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      {r.id ? (
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admins/drivers/${r.id}`}>View</Link>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
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
