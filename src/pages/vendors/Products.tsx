import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type ProductData,
} from "@/components/utilities/Vendors/ProductsDataTable";

const data: ProductData[] = [
  {
    id: "728ed52f",
    productName: "Phones",
    image: "https://github.com/shadcn.png",
    price: "25000",
    stock: "14",
    shorDes: "this is a short des...",
  },
  {
    id: "728ei52f",
    productName: "Phones",
    image: "https://github.com/shadcn.png",
    price: "25000",
    stock: "14",
    shorDes: "this is a short des...",
  },
  {
    id: "728ed52f",
    productName: "Phones",
    image: "https://github.com/shadcn.png",
    price: "25000",
    stock: "14",
    shorDes: "this is a short des...",
  },
  {
    id: "728ed52f",
    productName: "Phones",
    image: "https://github.com/shadcn.png",
    price: "25000",
    stock: "14",
    shorDes: "this is a short des...",
  },
];

function Products() {
  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Products</h3>
        <p>Manage all Products information</p>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default Products;
