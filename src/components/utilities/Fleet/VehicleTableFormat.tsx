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
// You can use a Zod schema here if you want.
export type VehicleData = {
  id: string;
  model: string;
  type: string;
  status: "Available" | "In Use" | "Under Maintenance" | "Disabled";
  // driver: string | "Unasigned";
  plateNumber: string;
};

export const columns: ColumnDef<VehicleData>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Vehicle" />;
    },
  },
  {
    accessorKey: "model",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
  },
  {
    accessorKey: "plateNumber",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Plate Number" />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
  },
  // {
  //   accessorKey: "driver",
  //   header: ({ column }) => {
  //     return <DataTableColumnHeader column={column} title="Driver" />;
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const VehicleData = row.original;

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
              onClick={() => navigator.clipboard.writeText(VehicleData.id)}
            >
              Copy Vehicle Number
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`${VehicleData.id}`}>View Vehicle</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button onClick={() => {}}>Disable Vehicle</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
