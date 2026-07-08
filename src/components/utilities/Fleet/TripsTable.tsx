import type { ColumnDef } from "@tanstack/react-table";

import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTableIdCell } from "@/components/ui/data-table-id-cell";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TripData = {
  id: string;
  refNo: string;
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
    cell: ({ getValue }) => <DataTableIdCell id={getValue() as string} />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Date" />;
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
  createViewActionsColumn<TripData>({
    getHref: (trip) => trip.id,
  }),
];
