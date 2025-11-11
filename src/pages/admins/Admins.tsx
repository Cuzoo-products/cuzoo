import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Admins/AdminsDataTable";
import { useGetAllAdmins } from "@/api/admin/useAdmin";
import Loader from "@/components/utilities/Loader";

function Admins() {
  const { data: admins, isLoading } = useGetAllAdmins();

  if (isLoading) return <Loader />;

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Admins</h3>
        <p>Manage all admins data and information</p>
      </div>

      <DataTable columns={columns} data={admins?.data?.data} />
    </div>
  );
}

export default Admins;
