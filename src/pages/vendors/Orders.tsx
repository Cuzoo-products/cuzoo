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
  type OrderData,
} from "@/components/utilities/Vendors/OrdersDataTable";
import { useState } from "react";

const data: OrderData[] = [
  {
    id: "728ed52f",
    orderID: "5rtee4w",
    customer: "Jane Doe",
    items: "2x T-Shirt, 1x Cap",
    status: "Completed",
    payment: "Card",
    total: "45000",
  },
  {
    id: "728ed52f",
    orderID: "5rtee4w",
    customer: "Jane Doe",
    items: "2x T-Shirt, 1x Cap",
    status: "Completed",
    payment: "Card",
    total: "45000",
  },
  {
    id: "728ed52f",
    orderID: "5rtee4w",
    customer: "Jane Doe",
    items: "2x T-Shirt, 1x Cap",
    status: "Completed",
    payment: "Card",
    total: "45000",
  },
  {
    id: "728ed52f",
    orderID: "5rtee4w",
    customer: "Jane Doe",
    items: "2x T-Shirt, 1x Cap",
    status: "Completed",
    payment: "Card",
    total: "45000",
  },
];

function Orders() {
  const [value, setValue] = useState<string | undefined>("Pending");
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

      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default Orders;
