import PageHeader from "@/components/admin/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Admins/VendorDataTable";
import { useVendors } from "@/api/admin/vendors/useVendors";
import Loader from "@/components/utilities/Loader";

function AdminVendor() {
  const { data: vendors, isLoading } = useVendors();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vendors"
        subtitle="Manage all vendors data and information"
      />

      <DataTable adminVariant searchPlaceholder="Search..." columns={columns} data={vendors?.data?.data || []} />
    </div>
  );
}

export default AdminVendor;
