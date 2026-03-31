import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  columns,
  type AdminOrderData,
} from "@/components/utilities/Admins/AdminOrdersDataTable";
import { useGetOrdersForAdmin } from "@/api/admin/orders/useOrders";
import Loader from "@/components/utilities/Loader";

type AdminOrderItem = {
  id: string;
  customer: string;
  vendor: string;
  payment: string;
  total: number;
  items: { name: string; quantity: number }[];
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  createdAt: string;
};

const orders: AdminOrderItem[] = [
  {
    id: "ORD-1001",
    customer: "Ada Nwosu",
    vendor: "Fresh Mart",
    payment: "Wallet",
    total: 25500,
    items: [
      { name: "Parboiled Rice", quantity: 2 },
      { name: "Vegetable Oil", quantity: 1 },
      { name: "Chicken", quantity: 3 },
    ],
    status: "Pending",
    createdAt: "2026-03-10T10:15:00Z",
  },
  {
    id: "ORD-1002",
    customer: "Tunde Bello",
    vendor: "Speedy Groceries",
    payment: "Card",
    total: 11200,
    items: [
      { name: "Milk", quantity: 2 },
      { name: "Bread", quantity: 2 },
      { name: "Eggs", quantity: 1 },
    ],
    status: "Processing",
    createdAt: "2026-03-09T15:40:00Z",
  },
  {
    id: "ORD-1003",
    customer: "Ifeoma Okafor",
    vendor: "Urban Foods",
    payment: "Transfer",
    total: 42000,
    items: [
      { name: "Tomatoes", quantity: 5 },
      { name: "Pepper", quantity: 4 },
    ],
    status: "Completed",
    createdAt: "2026-03-08T08:00:00Z",
  },
  {
    id: "ORD-1004",
    customer: "Musa Sani",
    vendor: "Prime Stores",
    payment: "Cash",
    total: 7800,
    items: [{ name: "Bread", quantity: 2 }],
    status: "Cancelled",
    createdAt: "2026-03-07T19:22:00Z",
  },
];

export default function AdminOrders() {
  const [value, setValue] = useState<string>("All");
  const { data: ordersData, isLoading: isLoadingOrders, isError: isErrorOrders } = useGetOrdersForAdmin("Package");

  console.log(ordersData)

  if (isLoadingOrders) {
    return <Loader />;
  }

  if (isErrorOrders) {
    return <div>Error loading orders</div>;
  }

  const tableData: AdminOrderData[] = orders.map((order) => ({
    id: order.id,
    orderID: order.id,
    customer: order.customer,
    vendor: order.vendor,
    items: order.items.map((item) => `${item.quantity}x ${item.name}`).join("\n"),
    total: order.total.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    status: order.status,
    payment: order.payment,
    createdAt: new Date(order.createdAt).toLocaleString(),
  }));

  const filteredData =
    value === "All"
      ? tableData
      : tableData.filter(
          (order) => order.status.toLowerCase() === value.toLowerCase(),
        );

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Orders</h3>
        <p>View and manage all orders from vendors</p>
      </div>

      <div className="md:absolute right-25 my-5 md:my-0">
        <Select onValueChange={(next) => setValue(next)} value={value}>
          <SelectTrigger className="h-11 w-full border-[#d6d6d6]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded bg-background border-0 shadow-accent shadow-sm">
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="All">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}

