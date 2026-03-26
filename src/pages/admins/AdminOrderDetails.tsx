import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const orders = [
  {
    id: "ORD-1001",
    customer: "Ada Nwosu",
    customerPhone: "+234 801 223 4455",
    vendor: "Fresh Mart",
    amount: "₦25,500",
    paymentMethod: "Wallet",
    status: "Pending",
    createdAt: "2026-03-10T10:15:00Z",
    deliveryAddress: "8 Admiralty Way, Lekki, Lagos",
    items: [
      { name: "Parboiled Rice", qty: 2, price: "₦8,000" },
      { name: "Vegetable Oil", qty: 1, price: "₦4,500" },
      { name: "Chicken", qty: 3, price: "₦13,000" },
    ],
  },
  {
    id: "ORD-1002",
    customer: "Tunde Bello",
    customerPhone: "+234 813 332 7788",
    vendor: "Speedy Groceries",
    amount: "₦11,200",
    paymentMethod: "Card",
    status: "Processing",
    createdAt: "2026-03-09T15:40:00Z",
    deliveryAddress: "21 Allen Avenue, Ikeja, Lagos",
    items: [
      { name: "Milk", qty: 2, price: "₦3,200" },
      { name: "Bread", qty: 2, price: "₦1,800" },
      { name: "Eggs", qty: 1, price: "₦6,200" },
    ],
  },
];

const statusVariant = (status: string) => {
  if (status === "Completed") return "default";
  if (status === "Cancelled") return "destructive";
  if (status === "Pending") return "secondary";
  return "outline";
};

export default function AdminOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const order = orders.find((item) => item.id === id) ?? orders[0];

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Order Details</h3>
        <p>Track and manage order information</p>
      </div>

      <div className="bg-secondary max-w-4xl mx-auto mb-10 p-6 rounded-lg space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="font-semibold text-lg">Order ID: {order.id}</h4>
            <p className="text-sm text-muted-foreground">
              Created: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Customer</p>
            <p className="font-medium">{order.customer}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="font-medium">{order.customerPhone}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Vendor</p>
            <p className="font-medium">{order.vendor}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Payment Method</p>
            <p className="font-medium">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className="font-medium">{order.amount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Delivery Address</p>
            <p className="font-medium">{order.deliveryAddress}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">Order Items</h4>
          <div className="overflow-x-auto rounded-md border border-line-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell className="text-right">{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link to="/admins/orders">Back to orders</Link>
          </Button>
          <Button asChild>
            <Link to="/admins/orders">Mark as reviewed</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

