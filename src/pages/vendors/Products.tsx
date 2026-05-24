import { useGetProducts } from "@/api/vendor/products/useProducts";
import PageHeader from "@/components/admin/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Vendors/ProductsDataTable";
import Loader from "@/components/utilities/Loader";

function Products() {
  const { data: products, isLoading } = useGetProducts();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        subtitle="Manage all products information"
      />
      <DataTable
        adminVariant
        searchPlaceholder="Search products..."
        columns={columns}
        data={products?.data?.data}
      />
    </div>
  );
}

export default Products;
