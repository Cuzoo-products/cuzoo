import { useGetOrdersForAdmin } from "@/api/admin/orders/useOrders";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/components/utilities/Loader";
import {
  columns,
  type AdminOrderData,
} from "@/components/utilities/Admins/AdminOrdersDataTable";
import { useState } from "react";

type OrdersResponse = {
  success: boolean;
  statusCode: number;
  data: {
    count: number;
    lastCursor: number;
    limit: number;
    data: {
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

export default function AdminOrders() {
  const { data, isLoading } = useGetOrdersForAdmin("Shopping") as {
    data?: OrdersResponse;
    isLoading: boolean;
  };
  const [value, setValue] = useState<string>("All");

  const apiOrders = data?.data?.data ?? [];

  const tableData: AdminOrderData[] = apiOrders.map((order) => ({
    id: order.id,
    orderID: order.id,
    customer: order.customer ?? "—",
    vendor: order.vendor ?? "—",
    orderType: order.orderType ?? "Shopping",
    items:
      order.items && order.items.length
        ? order.items
            .map(
              (item) =>
                `${item.quantity}x ${item.name}`,
            )
            .join("\n")
        : "—",
    status: order.status,
    payment: order.paymentMethod ?? "—",
    total: order.amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    createdAt: order.createdAt
      ? new Date(order.createdAt).toLocaleString("en-NG")
      : "—",
  }));

  const filteredData =
    value === "All"
      ? tableData
      : tableData.filter(
          (order) => order.status.toLowerCase() === value.toLowerCase(),
        );

  if (isLoading) return <Loader />;

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Orders</h3>
        <p>Manage all orders here</p>
      </div>

      <div className="md:absolute right-25 my-5 md:my-0">
        <Select onValueChange={(v) => setValue(v)} value={value}>
          <SelectTrigger className="h-11 w-full border-[#d6d6d6]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded bg-background border-0 shadow-accent shadow-sm">
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Ongoing">Ongoing</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="All">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
