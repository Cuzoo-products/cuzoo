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

export type AdminVehicleData = {
  id: string;
  plateNumber: string;
  model: string;
  type: string;
  year: string;
  color: string;
  companyId: string;
  riderId: string;
  assigned: string;
  status: string;
};

export const columns: ColumnDef<AdminVehicleData>[] = [
  {
    accessorKey: "plateNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plate" />
    ),
  },
  {
    accessorKey: "model",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
  },
  {
    accessorKey: "color",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Color" />
    ),
  },
  {
    accessorKey: "companyId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company ID" />
    ),
    cell: ({ getValue }) => {
      const v = (getValue() as string) ?? "—";
      return (
        <span className="font-mono text-xs max-w-[120px] truncate block" title={v}>
          {v}
        </span>
      );
    },
  },
  {
    accessorKey: "riderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rider ID" />
    ),
    cell: ({ getValue }) => {
      const v = (getValue() as string) ?? "—";
      return (
        <span className="font-mono text-xs max-w-[120px] truncate block" title={v}>
          {v}
        </span>
      );
    },
  },
  {
    accessorKey: "assigned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const v = row.original;
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
              onClick={() => navigator.clipboard.writeText(v.id)}
            >
              Copy vehicle ID
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/admins/vehicles/${encodeURIComponent(v.id)}`}>
                View vehicle
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
