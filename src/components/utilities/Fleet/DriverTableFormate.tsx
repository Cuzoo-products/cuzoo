import type { ColumnDef } from "@tanstack/react-table";

import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DriverData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export const columns: ColumnDef<DriverData>[] = [
  {
    id: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      return `${firstName} ${lastName}`;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
  },
  createViewActionsColumn<DriverData>({
    getHref: (driver) => driver.id,
  }),
];
