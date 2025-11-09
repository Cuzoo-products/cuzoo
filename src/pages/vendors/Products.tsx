import { useGetProducts } from "@/api/vendor/products/useProducts";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Vendors/ProductsDataTable";
import Loader from "@/components/utilities/Loader";

function Products() {
  const { data: products, isLoading } = useGetProducts();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Products</h3>
        <p>Manage all Products information</p>
      </div>

      <DataTable columns={columns} data={products?.data?.data} />
    </div>
  );
}

export default Products;
