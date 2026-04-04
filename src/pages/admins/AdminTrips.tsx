import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type AdminTripData,
} from "@/components/utilities/Admins/AdminTripsDataTable";
import { useGetAdminTrips } from "@/api/admin/trips/useTrips";
import {
  parseAdminTripsPayload,
  type AdminTripListItem,
} from "@/api/admin/trips/trips";
import Loader from "@/components/utilities/Loader";

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

function buildDetails(row: AdminTripListItem): string {
  const t = row.orderType?.toLowerCase() ?? "";

  if (t === "package") {
    const from = row.from?.trim() || "—";
    const dest =
      row.destinations?.filter(Boolean).length ?? 0
        ? row.destinations!.join(", ")
        : "—";
    return `From: ${from}\nDestinations: ${dest}`;
  }

  if (t === "shopping") {
    const lines: string[] = [];
    if (row.customer) lines.push(`Customer: ${row.customer}`);
    if (row.vendor) lines.push(`Vendor: ${row.vendor}`);
    if (row.paymentMethod) lines.push(`Payment: ${row.paymentMethod}`);
    if (row.items?.length) {
      const itemsLines = row.items.map((i) => {
        const q = i.quantity != null ? String(i.quantity) : "";
        const n = i.name ?? "";
        return q ? `${q}× ${n}` : n;
      });
      lines.push(`Items:\n${itemsLines.join("\n")}`);
    }
    return lines.length ? lines.join("\n") : "—";
  }

  const generic = [
    row.from ? `From: ${row.from}` : "",
    row.destinations?.length ? `To: ${row.destinations.join(", ")}` : "",
    row.customer ? `Customer: ${row.customer}` : "",
    row.vendor ? `Vendor: ${row.vendor}` : "",
  ].filter(Boolean);
  return generic.length ? generic.join("\n") : "—";
}

function buildSchedule(row: AdminTripListItem): string {
  const s = row.startTime ? formatWhen(row.startTime) : "—";
  const e = row.endTime ? formatWhen(row.endTime) : "—";
  if (s === "—" && e === "—") return "—";
  return `${s}\n–\n${e}`;
}

function mapRow(row: AdminTripListItem): AdminTripData {
  return {
    id: row.id,
    orderType: row.orderType ?? "—",
    status: row.status ?? "—",
    createdAt: formatWhen(row.createdAt ?? row.date),
    details: buildDetails(row),
    driver: row.driver?.trim() || "—",
    amount: naira(row.amount),
    schedule: buildSchedule(row),
  };
}

export default function AdminTrips() {
  const { data: payload, isLoading, isError } = useGetAdminTrips();

  const trips = useMemo(() => parseAdminTripsPayload(payload), [payload]);

  const meta = useMemo(() => {
    const root = payload as
      | { data?: { count?: number; limit?: number; lastCursor?: number } }
      | undefined;
    return {
      count: root?.data?.count,
      limit: root?.data?.limit,
    };
  }, [payload]);

  const tableData: AdminTripData[] = useMemo(
    () => trips.map(mapRow),
    [trips],
  );

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="@container/main p-6">
        <h3 className="!font-bold text-3xl">Trips</h3>
        <p className="mt-2 text-sm text-destructive">
          Failed to load trips. Check that GET /admins/trips is available.
        </p>
      </div>
    );
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Trips</h3>
        <p className="text-muted-foreground">
          Fleet and delivery trips
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
