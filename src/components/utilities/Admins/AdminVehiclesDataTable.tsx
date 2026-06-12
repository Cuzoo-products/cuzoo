import type { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "@/components/admin/StatusBadge";
import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTableIdCell } from "@/components/ui/data-table-id-cell";

export type AdminVehicleData = {
  id: string;
  plateNumber: string;
  model: string;
  type: string;
  year: string;
  color: string;
  companyId: string;
  riderId: string;
  assigned: string;
  status: string;
};

export const columns: ColumnDef<AdminVehicleData>[] = [
  {
    accessorKey: "plateNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plate" />
    ),
  },
  {
    accessorKey: "model",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
  },
  {
    accessorKey: "color",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Color" />
    ),
  },
  {
    accessorKey: "companyId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company ID" />
    ),
    cell: ({ getValue }) => <DataTableIdCell id={getValue() as string} />,
  },
  {
    accessorKey: "riderId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rider ID" />
    ),
    cell: ({ getValue }) => <DataTableIdCell id={getValue() as string} />,
  },
  {
    accessorKey: "assigned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ getValue }) => (
      <StatusBadge status={String(getValue() ?? "—")} />
    ),
  },
  createViewActionsColumn<AdminVehicleData>({
    getHref: (v) => `/admins/vehicles/${encodeURIComponent(v.id)}`,
  }),
];
