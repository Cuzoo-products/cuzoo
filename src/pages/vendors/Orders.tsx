import { useGetOrders } from "@/api/vendor/order/useOrder";
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
        ? order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")
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
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Orders</h3>
        <p>Manage all orders here</p>
      </div>

      <div className="md:absolute right-25 my-5 md:my-0">
        <Select onValueChange={(value) => setValue(value)} value={value}>
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

export default Orders;
