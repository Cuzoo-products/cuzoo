import PageHeader from "@/components/admin/PageHeader";
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
    <div className="space-y-5">
      <PageHeader
        title="Orders"
        subtitle="Manage all orders here"
        actions={
          <Select onValueChange={(v) => setValue(v)} value={value}>
            <SelectTrigger className="h-10 w-[180px] border-[var(--admin-border)] bg-[var(--admin-bg-card-alt)]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="admin-select-menu">
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="All">All</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <DataTable adminVariant searchPlaceholder="Search..." columns={columns} data={filteredData} />
    </div>
  );
}
