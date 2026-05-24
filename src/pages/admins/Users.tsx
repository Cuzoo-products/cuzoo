import PageHeader from "@/components/admin/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Admins/UsersDataTable";
import { useUsers } from "@/api/admin/users/useUsers";
import Loader from "@/components/utilities/Loader";

function Users() {
  const { data: users, isLoading } = useUsers();

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="space-y-5">
      <PageHeader
        title="Users"
        subtitle="Manage all users data and information"
      />
      <DataTable adminVariant searchPlaceholder="Search..." columns={columns} data={users?.data?.data} />
    </div>
  );
}

export default Users;
