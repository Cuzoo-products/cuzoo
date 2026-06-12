import { useGetOrders } from "@/api/vendor/order/useOrder";
import PageHeader from "@/components/admin/PageHeader";
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
  type OrderData,
} from "@/components/utilities/Vendors/OrdersDataTable";
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
      userDetails: {
        fullName: string;
      };
      paymentMethod: string;
      amount: number;
      items: {
        name: string;
        quantity: number;
      }[];
    }[];
  };
};

function Orders() {
  const { data, isLoading } = useGetOrders() as {
    data?: OrdersResponse;
    isLoading: boolean;
  };

  const [value, setValue] = useState<string>("All");

  const apiOrders = data?.data?.data ?? [];

  const tableData: OrderData[] = apiOrders.map((order) => ({
    id: order.id,
    orderID: order.id,
    customer: order.userDetails.fullName,
    items:
      order.items && order.items.length
        ? order.items.map((item) => `${item.quantity}x ${item.name}`).join("\n")
        : "—",
    status: order.status,
    payment: order.paymentMethod,
    total: order.amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  }));

  const filteredData =
    value === "All"
      ? tableData
      : tableData.filter(
          (order) => order.status.toLowerCase() === value.toLowerCase(),
        );

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        subtitle="Manage all orders here"
        actions={
          <Select onValueChange={(value) => setValue(value)} value={value}>
            <SelectTrigger className="h-11 w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="vendor-select-menu">
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="All">All</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <DataTable
        adminVariant
        searchPlaceholder="Search orders..."
        columns={columns}
        data={filteredData}
      />
    </div>
  );
}

export default Orders;
