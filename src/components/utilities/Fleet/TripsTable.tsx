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
export type TripData = {
  id: string;
  refNo: string;
  to: string;
  fro: string;
  date: string;
  startTime: string;
  endTime: string;
  driver: string;
  amount: string;
};

export const columns: ColumnDef<TripData>[] = [
  {
    accessorKey: "refNo",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Reference No." />;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Date" />;
    },
  },
  {
    accessorKey: "fro",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="From" />;
    },
  },
  {
    accessorKey: "to",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Destination" />;
    },
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Start Time" />;
    },
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="End Time" />;
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
    id: "actions",
    cell: ({ row }) => {
      const TripData = row.original;

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
              onClick={() => navigator.clipboard.writeText(TripData.id)}
            >
              Copy Trip Reference No.
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`${TripData.id}`}>View Trip</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
