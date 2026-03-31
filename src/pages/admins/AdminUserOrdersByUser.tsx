import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type UserOrder = {
  id: string;
  userId: string;
  vendor: string;
  itemCount: number;
  total: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  createdAt: string;
};

const DUMMY_USER_ORDERS: UserOrder[] = [
  { id: "U-ORD-1001", userId: "user-1", vendor: "Fresh Mart", itemCount: 3, total: 12500, status: "Pending", createdAt: "2026-03-10T10:15:00Z" },
  { id: "U-ORD-1002", userId: "user-1", vendor: "Prime Stores", itemCount: 2, total: 8500, status: "Completed", createdAt: "2026-03-12T13:20:00Z" },
  { id: "U-ORD-1003", userId: "user-2", vendor: "Urban Foods", itemCount: 4, total: 19000, status: "Processing", createdAt: "2026-03-11T09:00:00Z" },
];

export default function AdminUserOrdersByUser() {
  const { id } = useParams<{ id: string }>();
  const userId = id ?? "";
  const rows = DUMMY_USER_ORDERS.filter((o) => o.userId === userId);

  return (
    <div className="@container/main">
      <div className="my-6 flex items-center justify-between">
        <div>
          <h3 className="!font-bold text-3xl">User Orders</h3>
          <p className="text-muted-foreground">Orders requested by this user only.</p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/admins/users/${userId}`}>Back to user</Link>
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
                <TableHead>Vendor</TableHead>
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
                    No user orders for this ID in dummy data.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono">{r.id}</TableCell>
                    <TableCell>{r.vendor}</TableCell>
                    <TableCell>{r.itemCount}</TableCell>
                    <TableCell>₦{r.total.toLocaleString("en-NG")}</TableCell>
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
