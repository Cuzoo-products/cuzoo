import type { ColumnDef } from "@tanstack/react-table";

import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: {
    internationalFormat: string;
    nationalFormat: string;
    number: string;
    countryCode: string;
    countryCallingCode: string;
  };
};

export const columns: ColumnDef<UserData>[] = [
  {
    id: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => {
      return (
        <div>
          {`${row.original.firstName || ""} ${
            row.original.lastName || ""
          }`.trim()}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Number" />;
    },
    cell: ({ row }) => {
      return <div>{`${row.original.phoneNumber.number || ""}`}</div>;
    },
  },
  createViewActionsColumn<UserData>({
    getHref: (user) => user.id,
  }),
];
