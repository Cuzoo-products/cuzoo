import type { ColumnDef } from "@tanstack/react-table";

import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type FleetManagerData = {
  id: string;
  businessName: string;
  email: string;
  approvalStatus: string;
};

export const columns: ColumnDef<FleetManagerData>[] = [
  {
    accessorKey: "businessName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Business Name" />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
  },
  {
    accessorKey: "approvalStatus",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
  },
  createViewActionsColumn<FleetManagerData>({
    getHref: (manager) =>
      manager.id ? `/admins/fleet_managers/${manager.id}` : undefined,
  }),
];
