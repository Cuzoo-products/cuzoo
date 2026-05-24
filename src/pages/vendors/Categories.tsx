import PageHeader from "@/components/admin/PageHeader";
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
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        subtitle="Manage all categories information"
      />
      <DataTable
        adminVariant
        searchPlaceholder="Search categories..."
        columns={columns}
        data={categories?.data || []}
      />
    </div>
  );
}

export default Categories;
