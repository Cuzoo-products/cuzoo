import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type VendorOrder = {
  id: string;
  vendorId: string;
  customer: string;
  itemCount: number;
  total: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  createdAt: string;
};

const DUMMY_VENDOR_ORDERS: VendorOrder[] = [
  { id: "V-ORD-1001", vendorId: "vendor-1", customer: "Ada Nwosu", itemCount: 3, total: 25500, status: "Pending", createdAt: "2026-03-10T10:15:00Z" },
  { id: "V-ORD-1002", vendorId: "vendor-1", customer: "Tunde Bello", itemCount: 5, total: 11200, status: "Processing", createdAt: "2026-03-11T09:20:00Z" },
  { id: "V-ORD-1003", vendorId: "vendor-2", customer: "Ifeoma Okafor", itemCount: 2, total: 42000, status: "Completed", createdAt: "2026-03-08T08:00:00Z" },
  { id: "V-ORD-1004", vendorId: "vendor-3", customer: "Musa Sani", itemCount: 1, total: 7800, status: "Cancelled", createdAt: "2026-03-07T19:22:00Z" },
];

export default function AdminVendorOrdersByVendor() {
  const { id } = useParams<{ id: string }>();
  const vendorId = id ?? "";

  const rows = DUMMY_VENDOR_ORDERS.filter((o) => o.vendorId === vendorId);

  return (
    <div className="@container/main">
      <div className="my-6 flex items-center justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Vendor Orders</h3>
          <p className="text-muted-foreground">Orders that belong to this vendor only.</p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/admins/vendors/${vendorId}`}>Back to vendor</Link>
        </Button>
      </div>

      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Dummy data for now.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No vendor orders for this ID in dummy data.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono">{r.id}</TableCell>
                    <TableCell>{r.customer}</TableCell>
                    <TableCell>{r.itemCount}</TableCell>
                    <TableCell>?{r.total.toLocaleString("en-NG")}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>{new Date(r.createdAt).toLocaleDateString("en-NG")}</TableCell>
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
