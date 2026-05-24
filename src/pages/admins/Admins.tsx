import PageHeader from "@/components/admin/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Admins/AdminsDataTable";
import { useGetAllAdmins } from "@/api/admin/admin/useAdmin";
import Loader from "@/components/utilities/Loader";

function Admins() {
  const { data: admins, isLoading } = useGetAllAdmins();

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Admins"
        subtitle="Manage all admins data and information"
      />

      <DataTable adminVariant searchPlaceholder="Search..." columns={columns} data={admins?.data?.data} />
    </div>
  );
}

export default Admins;
