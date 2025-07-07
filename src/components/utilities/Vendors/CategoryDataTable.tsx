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
import Image from "@/components/ui/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryData = {
  id: string;
  name: string;
  icon: string;
};

export const columns: ColumnDef<CategoryData>[] = [
  {
    accessorKey: "icon",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Icon" />;
    },
    cell: ({ row }) => {
      const categoryData = row.original;
      return (
        <div>
          <Image className="w-12 h-12" alt="" source={categoryData.icon} />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const categoryData = row.original;

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
              onClick={() => navigator.clipboard.writeText(categoryData.id)}
            >
              Copy Category ID
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`${categoryData.id}`}>View Category</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
