import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Vendors/CategoryDataTable";
import { useGetCategories } from "@/api/vendor/categories/useCategories";
import Loader from "@/components/utilities/Loader";

function Categories() {
  const { data: categories, isLoading } = useGetCategories();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Categories</h3>
        <p>Manage all categories information</p>
      </div>

      <DataTable columns={columns} data={categories?.data || []} />
    </div>
  );
}

export default Categories;
