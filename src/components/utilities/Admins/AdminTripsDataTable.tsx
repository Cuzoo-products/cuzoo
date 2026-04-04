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

export type AdminTripData = {
  id: string;
  orderType: string;
  status: string;
  createdAt: string;
  /** Multiline: route or shopping summary */
  details: string;
  driver: string;
  amount: string;
  /** Start – end times when present */
  schedule: string;
};

export const columns: ColumnDef<AdminTripData>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" />;
    },
    cell: ({ getValue }) => {
      const id = (getValue() as string) ?? "";
      return (
        <span className="font-mono text-xs max-w-[120px] truncate block" title={id}>
          {id}
        </span>
      );
    },
  },
  {
    accessorKey: "orderType",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Type" />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Created" />;
    },
  },
  {
    accessorKey: "details",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Details" />;
    },
    cell: ({ getValue }) => {
      const raw = (getValue() as string) ?? "";
      if (!raw || raw === "—") {
        return <span className="text-muted-foreground">—</span>;
      }
      const lines = raw.split("\n").filter(Boolean);
      return (
        <div className="max-h-36 max-w-[min(320px,100%)] min-w-0 overflow-y-auto pr-1">
          <div className="flex min-w-0 flex-col gap-1">
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
    accessorKey: "driver",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Driver" />;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Amount" />;
    },
  },
  {
    accessorKey: "schedule",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Schedule" />;
    },
    cell: ({ getValue }) => {
      const v = (getValue() as string) ?? "—";
      if (v === "—") return <span className="text-muted-foreground">—</span>;
      return (
        <span className="text-xs max-w-[200px] whitespace-pre-wrap leading-snug">
          {v}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const trip = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border-0 bg-background shadow-accent shadow-sm"
            align="end"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(trip.id)}
            >
              Copy trip ID
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/admins/trips/${trip.id}`}>View trip</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
