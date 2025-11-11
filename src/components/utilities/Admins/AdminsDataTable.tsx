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
export type AdminData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  suspended: string;
  position: string;
};

export const columns: ColumnDef<AdminData>[] = [
  {
    id: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => {
      const name = row.original.firstName + " " + row.original.lastName;
      return <div>{name}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
  },
  {
    accessorKey: "suspended",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Suspended" />;
    },
  },
  {
    accessorKey: "position",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Position" />;
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
              Copy Admin ID
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`${fleetManagerData.id}`}>View Admin</Link>
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
