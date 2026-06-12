import type { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "@/components/admin/StatusBadge";
import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTableIdCell } from "@/components/ui/data-table-id-cell";

export type AdminTripData = {
  id: string;
  orderType: string;
  status: string;
  createdAt: string;
  /** Multiline: route or shopping summary */
  details: string;
  driver: string;
  amount: string;
  /** Start – end times when present */
  schedule: string;
};

export const columns: ColumnDef<AdminTripData>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" />;
    },
    cell: ({ getValue }) => <DataTableIdCell id={getValue() as string} />,
  },
  {
    accessorKey: "orderType",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Type" />;
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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Created" />;
    },
  },
  {
    accessorKey: "details",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Details" />;
    },
    cell: ({ getValue }) => {
      const raw = (getValue() as string) ?? "";
      if (!raw || raw === "—") {
        return <span className="text-muted-foreground">—</span>;
      }
      const lines = raw.split("\n").filter(Boolean);
      return (
        <div className="max-h-36 max-w-[min(320px,100%)] min-w-0 overflow-y-auto pr-1">
          <div className="flex min-w-0 flex-col gap-1">
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
  {
    accessorKey: "schedule",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Schedule" />;
    },
    cell: ({ getValue }) => {
      const v = (getValue() as string) ?? "—";
      if (v === "—") return <span className="text-muted-foreground">—</span>;
      return (
        <span className="text-xs max-w-[200px] whitespace-pre-wrap leading-snug">
          {v}
        </span>
      );
    },
  },
  createViewActionsColumn<AdminTripData>({
    getHref: (trip) => `/admins/trips/${trip.id}`,
  }),
];
