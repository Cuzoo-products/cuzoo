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
  details?: string;
  driver?: string;
  amount: string;
  /** Start – end times when present */
  schedule: string;
};

const idColumn: ColumnDef<AdminTripData> = {
  accessorKey: "id",
  header: ({ column }) => {
    return <DataTableColumnHeader column={column} title="ID" />;
  },
  cell: ({ getValue }) => <DataTableIdCell id={getValue() as string} />,
};

const typeColumn: ColumnDef<AdminTripData> = {
  accessorKey: "orderType",
  header: ({ column }) => {
    return <DataTableColumnHeader column={column} title="Type" />;
  },
};

const statusColumn: ColumnDef<AdminTripData> = {
  accessorKey: "status",
  header: ({ column }) => {
    return <DataTableColumnHeader column={column} title="Status" />;
  },
  cell: ({ getValue }) => (
    <StatusBadge status={String(getValue() ?? "—")} />
  ),
};

const createdAtColumn: ColumnDef<AdminTripData> = {
  accessorKey: "createdAt",
  header: ({ column }) => {
    return <DataTableColumnHeader column={column} title="Created" />;
  },
};

const detailsColumn: ColumnDef<AdminTripData> = {
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
};

const driverColumn: ColumnDef<AdminTripData> = {
  accessorKey: "driver",
  header: ({ column }) => {
    return <DataTableColumnHeader column={column} title="Driver" />;
  },
};

const amountColumn: ColumnDef<AdminTripData> = {
  accessorKey: "amount",
  header: ({ column }) => {
    return <DataTableColumnHeader column={column} title="Amount" />;
  },
};

const scheduleColumn: ColumnDef<AdminTripData> = {
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
};

const actionsColumn = createViewActionsColumn<AdminTripData>({
  getHref: (trip) => `/admins/trips/${trip.id}`,
});

/** Full columns (e.g. per-driver trip lists). */
export const columns: ColumnDef<AdminTripData>[] = [
  idColumn,
  typeColumn,
  statusColumn,
  createdAtColumn,
  detailsColumn,
  driverColumn,
  amountColumn,
  scheduleColumn,
  actionsColumn,
];

/** /admins/trips list — no Details or Driver columns. */
export const adminTripsListColumns: ColumnDef<AdminTripData>[] = [
  idColumn,
  typeColumn,
  statusColumn,
  createdAtColumn,
  amountColumn,
  scheduleColumn,
  actionsColumn,
];
