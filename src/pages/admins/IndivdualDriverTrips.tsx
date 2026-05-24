import { useMemo } from "react";
import { useParams } from "react-router";
import NestedAdminPage from "@/components/admin/NestedAdminPage";
import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type AdminTripData,
} from "@/components/utilities/Admins/AdminTripsDataTable";
import { useGetOrdersForAdminByRiderId } from "@/api/admin/orders/useOrders";
import {
  parseAdminTripsPayload,
  type AdminTripListItem,
} from "@/api/admin/trips/trips";
import Loader from "@/components/utilities/Loader";

const PACKAGE_ORDER_TYPE = "Package";

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

export default function IndivdualDriverTrips() {
  const { id: routeId } = useParams<{ id: string }>();
  const driverId =
    routeId && routeId !== "undefined" && routeId !== "null"
      ? routeId
      : undefined;

  const { data: payload, isLoading, isError } =
    useGetOrdersForAdminByRiderId(PACKAGE_ORDER_TYPE, driverId);

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

  const driverLabel = useMemo(() => {
    const name = trips[0]?.driver?.trim();
    return name || "Driver";
  }, [trips]);

  const driverBack = `/admins/drivers/${driverId ?? ""}`;
  const crumbs = [
    { label: "Dashboard", href: "/admins/dashboard" },
    { label: "Riders", href: "/admins/drivers" },
    { label: "Driver", href: driverBack },
    { label: "Trips" },
  ];

  if (!driverId) {
    return (
      <NestedAdminPage
        backHref="/admins/drivers"
        backLabel="Riders"
        crumbs={crumbs}
        title="Driver trips"
        subtitle="No driver ID in the URL."
      >
        <></>
      </NestedAdminPage>
    );
  }

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <NestedAdminPage
        backHref={driverBack}
        backLabel="Driver"
        crumbs={crumbs}
        title="Driver trips"
        subtitle="Failed to load trips for this driver."
      >
        <></>
      </NestedAdminPage>
    );
  }

  const subtitle = `Package trips assigned to this driver${
    meta.count != null ? ` · ${meta.count} total` : ""
  }${meta.limit != null ? ` (limit ${meta.limit})` : ""}`;

  return (
    <NestedAdminPage
      backHref={driverBack}
      backLabel="Driver"
      crumbs={crumbs}
      title={`${driverLabel} trips`}
      subtitle={subtitle}
    >
      <DataTable
        adminVariant
        searchPlaceholder="Search..."
        columns={columns}
        data={tableData}
      />
    </NestedAdminPage>
  );
}
