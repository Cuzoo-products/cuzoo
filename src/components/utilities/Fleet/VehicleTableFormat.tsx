import type { ColumnDef } from "@tanstack/react-table";

import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type VehicleData = {
  id: string;
  model: string;
  type: string;
  status: "Available" | "In Use" | "Under Maintenance" | "Disabled";
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
  createViewActionsColumn<VehicleData>({
    getHref: (vehicle) => vehicle.id,
  }),
];
