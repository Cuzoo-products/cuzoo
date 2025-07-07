import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Link } from "react-router";

// This type is used to define the shape of our data.
export type OrderData = {
  id: string;
  orderID: string;
  customer: string;
  items: string;
  total: string;
  status: string;
  payment: string;
};

export const columns: ColumnDef<OrderData>[] = [
  {
    accessorKey: "orderID",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Order ID" />;
    },
  },
  {
    accessorKey: "customer",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Customer" />;
    },
  },
  {
    accessorKey: "items",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Items" />;
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Total" />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
  },
  {
    accessorKey: "payment",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Payment" />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const orderData = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-background shadow-accent shadow-sm border-0"
            align="end"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(orderData.id)}
            >
              Copy Order ID
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`${orderData.id}`}>View Order</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
