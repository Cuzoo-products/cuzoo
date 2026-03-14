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

export type PayoutData = {
  id: string;
  referenceNo: string;
  amount: string;
  status: string;
  requestedAt: string;
  bankAccount: string;
};

export const columns: ColumnDef<PayoutData>[] = [
  {
    accessorKey: "referenceNo",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Reference No." />;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Amount" />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
  },
  {
    accessorKey: "requestedAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Requested" />;
    },
  },
  {
    accessorKey: "bankAccount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Bank Account" />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payout = row.original;
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payout.referenceNo)}>
              Copy Reference No.
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`${payout.id}`}>View details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
