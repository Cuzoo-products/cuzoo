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

  const vendorBack = `/admins/vendors/${vendorId ?? ""}`;
  const crumbs = [
    { label: "Dashboard", href: "/admins/dashboard" },
    { label: "Vendors", href: "/admins/vendors" },
    { label: "Vendor", href: vendorBack },
    { label: "Orders" },
  ];

  if (!vendorId) {
    return (
      <NestedAdminPage
        backHref="/admins/vendors"
        backLabel="Vendors"
        crumbs={crumbs}
        title="Vendor orders"
        subtitle="No vendor ID in the URL."
      >
        <></>
      </NestedAdminPage>
    );
  }

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <NestedAdminPage
        backHref={vendorBack}
        backLabel="Vendor"
        crumbs={crumbs}
        title="Vendor orders"
        subtitle="Failed to load orders."
      >
        <></>
      </NestedAdminPage>
    );
  }

  const subtitle = `Orders for this vendor (${envelope?.count ?? rows.length} total).`;

  return (
    <NestedAdminPage
      backHref={vendorBack}
      backLabel="Vendor"
      crumbs={crumbs}
      title="Vendor orders"
      subtitle={subtitle}
    >
      <Section
        title="Orders"
        subtitle={`Shopping orders for vendor ID ${vendorId}.`}
      >
        <div className="overflow-x-auto">
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
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
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
        </div>
      </Section>
    </NestedAdminPage>
  );
}
