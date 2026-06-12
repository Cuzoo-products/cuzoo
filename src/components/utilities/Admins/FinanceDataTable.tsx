import type { ColumnDef } from "@tanstack/react-table";

import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type FinanceData = {
  id: string;
  date: string;
  invoice: string;
  type: "Inflow" | "Outflow";
  amount: string;
};

export const columns: ColumnDef<FinanceData>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Date" />;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Type" />;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Amount" />;
    },
  },
  createViewActionsColumn<FinanceData>({
    getHref: (finance) => finance.id,
  }),
];
