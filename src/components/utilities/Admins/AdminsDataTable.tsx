import type { ColumnDef } from "@tanstack/react-table";

import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

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
  createViewActionsColumn<AdminData>({
    getHref: (admin) => admin.id,
  }),
];
