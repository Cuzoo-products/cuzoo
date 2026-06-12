import type { ColumnDef } from "@tanstack/react-table";

import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export type PayoutData = {
  id: string;
  amount: string;
  status: string;
  requestedAt: string;
  bankAccount: string;
};

export const columns: ColumnDef<PayoutData>[] = [
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Amount" />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
  },
  {
    accessorKey: "requestedAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Requested" />;
    },
  },
  {
    accessorKey: "bankAccount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Bank Account" />;
    },
  },
  createViewActionsColumn<PayoutData>({
    getHref: (payout) => payout.id || null,
  }),
];
