import type { ColumnDef } from "@tanstack/react-table";

import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import Image from "@/components/ui/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type IconProps = {
  url: string;
};
export type CategoryData = {
  id: string;
  name: string;
  image: IconProps;
};

export const columns: ColumnDef<CategoryData>[] = [
  {
    accessorKey: "icon",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Icon" />;
    },
    cell: ({ row }) => {
      const categoryData = row.original;
      return (
        <div>
          <Image className="w-12 h-12" alt="" source={categoryData.image.url} />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
  },
  createViewActionsColumn<CategoryData>({
    getHref: (category) => category.id,
  }),
];
