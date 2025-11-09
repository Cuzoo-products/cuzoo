import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Admins/UsersDataTable";
import { useUsers } from "@/api/admin/useUsers";
import Loader from "@/components/utilities/Loader";

function Users() {
  const { data: users, isLoading } = useUsers();

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Users</h3>
        <p>Manage all users data and information</p>
      </div>

      <DataTable columns={columns} data={users?.data?.data} />
    </div>
  );
}

export default Users;
