import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Admins/VendorDataTable";
import { useVendors } from "@/api/admin/useVendors";
import Loader from "@/components/utilities/Loader";

function AdminVendor() {
  const { data: vendors, isLoading } = useVendors();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Vendors</h3>
        <p>Manage all vendors data and information</p>
      </div>

      <DataTable columns={columns} data={vendors?.data?.data || []} />
    </div>
  );
}

export default AdminVendor;
