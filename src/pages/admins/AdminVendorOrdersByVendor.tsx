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
import { useGetOrdersForAdminByVendorId } from "@/api/admin/orders/useOrders";

/** Matches GET /admins/orders?orderType=&vendorId= */
type VendorOrdersResponse = {
  success?: boolean;
  statusCode?: number;
  data?: {
    count?: number;
    lastCursor?: number;
    limit?: number;
    data?: {
      id: string;
      status: string;
      createdAt: string;
      amount: number;
      customer?: string;
      vendor?: string;
      paymentMethod?: string;
      orderType?: string;
      items?: { name: string; quantity: string | number }[];
    }[];
  };
};

const ORDER_TYPE = "Shopping";

function formatItemsCell(
  items: { name: string; quantity: string | number }[] | undefined,
) {
  if (!items?.length) return "—";
  return items
    .map((item) => `${item.quantity}× ${item.name}`)
    .join("\n");
}

export default function AdminVendorOrdersByVendor() {
  const { id: routeId } = useParams<{ id: string }>();
  const vendorId =
    routeId && routeId !== "undefined" && routeId !== "null" ? routeId : undefined;

  const { data: payload, isLoading, error } = useGetOrdersForAdminByVendorId(
    ORDER_TYPE,
    vendorId,
  );

  const envelope = (payload as VendorOrdersResponse | undefined)?.data;
  const apiOrders = envelope?.data ?? [];

  const rows = apiOrders.map((o) => ({
    id: o.id,
    customer: o.customer ?? "—",
    vendor: o.vendor ?? "—",
    itemsLabel: formatItemsCell(o.items),
    total: o.amount,
    payment: o.paymentMethod ?? "—",
    status: o.status,
    orderType: o.orderType ?? ORDER_TYPE,
    createdAt: o.createdAt,
  }));

  if (!vendorId) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Vendor Orders</h3>
          <p className="text-sm text-red-500">No vendor ID in the URL.</p>
        </div>
      </div>
    );
  }

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Vendor Orders</h3>
          <p className="text-sm text-red-500">Failed to load orders.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to={`/admins/vendors/${vendorId}`}>Back to vendor</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main">
      <div className="my-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Vendor Orders</h3>
          <p className="text-muted-foreground">
            Orders for this vendor ({envelope?.count ?? rows.length} total).
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/admins/vendors/${vendorId}`}>Back to vendor</Link>
        </Button>
      </div>

      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            Shopping orders returned for vendor ID{" "}
            <span className="font-mono">{vendorId}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center text-muted-foreground"
                  >
                    No orders for this vendor.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell>{r.customer}</TableCell>
                    <TableCell>{r.vendor}</TableCell>
                    <TableCell className="max-w-[220px] whitespace-pre-line text-xs">
                      {r.itemsLabel}
                    </TableCell>
                    <TableCell>{r.payment}</TableCell>
                    <TableCell>
                      ₦
                      {r.total.toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>{r.orderType}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleString("en-NG")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="link" className="h-auto p-0" asChild>
                        <Link to={`/admins/orders/${r.id}`}>View</Link>
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
