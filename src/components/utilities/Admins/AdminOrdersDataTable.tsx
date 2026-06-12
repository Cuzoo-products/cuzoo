import type { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "@/components/admin/StatusBadge";
import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTableIdCell } from "@/components/ui/data-table-id-cell";

export type AdminOrderData = {
  id: string;
  orderID: string;
  customer: string;
  vendor: string;
  orderType: string;
  items: string;
  total: string;
  status: string;
  payment: string;
  createdAt: string;
};

export const columns: ColumnDef<AdminOrderData>[] = [
  {
    accessorKey: "orderID",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Order ID" />;
    },
    cell: ({ getValue }) => <DataTableIdCell id={getValue() as string} />,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Customer" />;
    },
  },
  {
    accessorKey: "vendor",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Vendor" />;
    },
  },
  {
    accessorKey: "orderType",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Order type" />;
    },
  },
  {
    accessorKey: "items",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Items" />;
    },
    cell: ({ getValue }) => {
      const raw = (getValue() as string) ?? "";
      if (!raw || raw === "—") return <span className="text-muted-foreground">—</span>;

      const lines = raw.split("\n").filter(Boolean);

      return (
        <div className="max-w-[min(280px,100%)] min-w-0 max-h-36 overflow-y-auto pr-1">
          <div className="flex min-w-0 w-full flex-col gap-1">
            {lines.map((line, index) => (
              <div
                key={index}
                className="min-w-0 truncate text-left text-sm leading-snug"
                title={line}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Total" />;
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
  {
    accessorKey: "payment",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Payment" />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Created At" />;
    },
  },
  createViewActionsColumn<AdminOrderData>({
    getHref: (order) => `/admins/orders/${order.id}`,
  }),
];

