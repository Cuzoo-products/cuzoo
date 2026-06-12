import VendorStatusBadge from "@/components/utilities/Vendors/VendorStatusBadge";
import type { ColumnDef } from "@tanstack/react-table";

import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTableIdCell } from "@/components/ui/data-table-id-cell";

// This type is used to define the shape of our data.
export type OrderData = {
  id: string;
  orderID: string;
  customer: string;
  items: string;
  total: string;
  status: string;
  payment: string;
};

export const columns: ColumnDef<OrderData>[] = [
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
    accessorKey: "items",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Items" />;
    },
    cell: ({ getValue }) => {
      const raw = (getValue() as string) ?? "";
      if (!raw || raw === "—") return <span className="text-muted-foreground">—</span>;

      const items = raw.split("\n").filter(Boolean);
      const maxToShow = 3;
      const shown = items.slice(0, maxToShow);
      const remaining = items.length - shown.length;

      const truncate = (text: string, maxLen: number) => {
        const s = text.trim();
        if (s.length <= maxLen) return s;
        return `${s.slice(0, Math.max(0, maxLen - 1))}…`;
      };

      const formatLine = (line: string) => {
        // Expected format: "<qty>x <name>" (qty comes from API as number, but stringify can vary)
        const match = line.match(/^(\s*\d+(?:\.\d+)?)x\s*(.*)$/i);
        if (!match) return truncate(line, 28);

        const qty = match[1];
        const name = match[2] ?? "";
        return `${qty}x ${truncate(name, 18)}`;
      };

      return (
        <div className="space-y-0.5 max-w-[260px]">
          {shown.map((t, idx) => (
            <div key={idx} className="text-sm leading-tight">
              {formatLine(t)}
            </div>
          ))}
          {remaining > 0 && (
            <div className="text-xs text-muted-foreground">
              +{remaining} more
            </div>
          )}
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
      <VendorStatusBadge status={String(getValue() ?? "")} />
    ),
  },
  {
    accessorKey: "payment",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Payment" />;
    },
  },
  createViewActionsColumn<OrderData>({
    getHref: (order) => order.id,
  }),
];
