import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export type AdminOrderData = {
  id: string;
  orderID: string;
  customer: string;
  vendor: string;
  orderType: string;
  items: string;
  total: string;
  status: string;
  payment: string;
  createdAt: string;
};

export const columns: ColumnDef<AdminOrderData>[] = [
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
    accessorKey: "vendor",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Vendor" />;
    },
  },
  {
    accessorKey: "orderType",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Order type" />;
    },
  },
  {
    accessorKey: "items",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Items" />;
    },
    cell: ({ getValue }) => {
      const raw = (getValue() as string) ?? "";
      if (!raw || raw === "—") return <span className="text-muted-foreground">—</span>;

      const lines = raw.split("\n").filter(Boolean);

      return (
        <div className="max-w-[min(280px,100%)] min-w-0 max-h-36 overflow-y-auto pr-1">
          <div className="flex min-w-0 w-full flex-col gap-1">
            {lines.map((line, index) => (
              <div
                key={index}
                className="min-w-0 truncate text-left text-sm leading-snug"
                title={line}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      );
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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Created At" />;
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
              <Link to={`/admins/orders/${orderData.id}`}>View Order</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

