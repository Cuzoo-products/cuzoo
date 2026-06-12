import type { ColumnDef } from "@tanstack/react-table";

import { createViewActionsColumn } from "@/components/ui/data-table-actions-column";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import Image from "@/components/ui/image";

// This type is used to define the shape of our data.
type image1 = {
  url: string;
};
export type ProductData = {
  id: string;
  name: string;
  image1: image1;
  price: string;
  stock: string;
};

export const columns: ColumnDef<ProductData>[] = [
  {
    accessorKey: "image1",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Image" />;
    },
    cell: ({ row }) => {
      const productData = row.original;
      return (
        <div>
          <Image className="w-12 h-12" alt="" source={productData.image1.url} />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Product Name" />;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Price" />;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Stock" />;
    },
  },
  createViewActionsColumn<ProductData>({
    getHref: (product) => product.id,
  }),
];
