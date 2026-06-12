import type { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "@/components/admin/StatusBadge";
import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DriverData = {
  id: string;
  name: string;
  status: "Active" | "Disabled";
  email: string;
};

export const columns: ColumnDef<DriverData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ getValue }) => (
      <StatusBadge status={String(getValue() ?? "—")} />
    ),
  },
  createViewActionsColumn<DriverData>({
    getHref: (driver) => `/admins/drivers/${driver.id}`,
  }),
];
