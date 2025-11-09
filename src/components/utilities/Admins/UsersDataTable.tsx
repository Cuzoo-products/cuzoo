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

export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: {
    internationalFormat: string;
    nationalFormat: string;
    number: string;
    countryCode: string;
    countryCallingCode: string;
  };
};

export const columns: ColumnDef<UserData>[] = [
  {
    id: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => {
      return (
        <div>
          {`${row.original.firstName || ""} ${
            row.original.lastName || ""
          }`.trim()}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Number" />;
    },
    cell: ({ row }) => {
      return <div>{`${row.original.phoneNumber.number || ""}`}</div>;
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
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`${fleetManagerData.id}`}>View User</Link>
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
