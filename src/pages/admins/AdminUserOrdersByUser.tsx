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
import { useGetOrdersForAdminByUserId } from "@/api/admin/orders/useOrders";
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

function summaryText(row: AdminTripListItem): string {
  const t = row.orderType?.toLowerCase() ?? "";
  if (t === "shopping") {
    const parts = [row.vendor, row.customer].filter(Boolean);
    return parts.length ? parts.join(" · ") : "—";
  }
  if (t === "package") {
    const from = row.from?.trim() || "";
    const dest = row.destinations?.filter(Boolean).length
      ? row.destinations!.join(", ")
      : "";
    const parts = [from, dest].filter(Boolean);
    return parts.length ? parts.join(" → ") : "—";
  }
  return "—";
}

function ItemsCell({ row }: { row: AdminTripListItem }) {
  const t = row.orderType?.toLowerCase() ?? "";
  if (t !== "shopping" || !row.items?.length) {
    return <span className="text-muted-foreground">—</span>;
  }
  const lines = row.items.map((i) => {
    const q = i.quantity != null ? String(i.quantity) : "";
    const n = i.name ?? "";
    return q ? `${q}× ${n}` : n || "—";
  });
  return (
    <div className="max-h-36 max-w-[min(280px,100%)] min-w-0 overflow-y-auto pr-1">
      <div className="flex min-w-0 w-full flex-col gap-1">
        {lines.map((line, index) => (
          <div
            key={index}
            className="min-w-0 truncate text-left text-sm leading-snug"
            title={line}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function viewPath(row: AdminTripListItem): string {
  const t = row.orderType?.toLowerCase() ?? "";
  if (t === "package") {
    return `/admins/trips/${row.id}`;
  }
  return `/admins/orders/${row.id}`;
}

export default function AdminUserOrdersByUser() {
  const { id } = useParams<{ id: string }>();
  const userId = id ?? "";

  const { data: payload, isLoading, isError } =
    useGetOrdersForAdminByUserId(userId);

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

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="@container/main p-6">
        <h3 className="!font-bold text-3xl">User orders</h3>
        <p className="mt-2 text-sm text-destructive">
          Failed to load orders for this user.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to={`/admins/users/${userId}`}>Back to user</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="@container/main">
      <div className="my-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="!font-bold text-3xl">User orders</h3>
          <p className="text-muted-foreground">
            Orders linked to this user
            {meta.count != null ? (
              <span className="text-foreground"> · {meta.count} total</span>
            ) : null}
            {meta.limit != null ? (
              <span className="text-muted-foreground">
                {" "}
                (limit {meta.limit})
              </span>
            ) : null}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/admins/users/${userId}`}>Back to user</Link>
        </Button>
      </div>

      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            Shopping and package rows may appear together. Use View to open the
            correct admin screen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
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
                    No orders for this user.
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
                    <TableCell className="max-w-[220px]">
                      <span
                        className="line-clamp-2 text-sm"
                        title={summaryText(row)}
                      >
                        {summaryText(row)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ItemsCell row={row} />
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {naira(row.amount)}
                    </TableCell>
                    <TableCell className="capitalize">{row.status ?? "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatWhen(row.createdAt ?? row.date)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={viewPath(row)}>View</Link>
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
