import type { ColumnDef } from "@tanstack/react-table";

import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type PhoneNumber = {
  countryCallingCode: string;
  countryCode: string;
  internationalFormat: string;
  nationalFormat: string;
  number: string;
};

export type VendorData = {
  id: string;
  businessName: string;
  email: string;
  approvalStatus: string;
  storeCode: string;
  phoneNumber?: PhoneNumber;
};

export const columns: ColumnDef<VendorData>[] = [
  {
    accessorKey: "businessName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
  },
  {
    accessorKey: "storeCode",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Store Code" />;
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
      const phoneNumber = row.original.phoneNumber;
      if (!phoneNumber) {
        return <div className="text-muted-foreground">—</div>;
      }
      const display =
        phoneNumber.internationalFormat ||
        phoneNumber.nationalFormat ||
        phoneNumber.number ||
        "—";
      return <div>{display}</div>;
    },
  },
  {
    accessorKey: "approvalStatus",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
  },
  createViewActionsColumn<VendorData>({
    getHref: (vendor) =>
      vendor.id ? `/admins/vendors/${vendor.id}` : undefined,
  }),
];
