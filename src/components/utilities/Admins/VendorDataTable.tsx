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
export type VendorData = {
  id: string;
  name: string;
  email: string;
  status: string;
  storeCode: string;
  number: string;
};

export const columns: ColumnDef<VendorData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
  },
  {
    accessorKey: "storeCode",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Store Code" />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
  },
  {
    accessorKey: "number",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Number" />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const fleetManagerData = row.original;

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
              onClick={() => navigator.clipboard.writeText(fleetManagerData.id)}
            >
              Copy Vendor ID
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`${fleetManagerData.id}`}>View Vendor</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button onClick={() => {}}>Disable</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
