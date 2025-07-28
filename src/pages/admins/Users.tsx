import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type UserData,
} from "@/components/utilities/Admins/UsersDataTable";

const data: UserData[] = [
  {
    id: "728ed52f",
    name: "Emmanuel",
    status: "Active",
    number: "08123456789",
    email: "m@businessname.com",
  },
  {
    id: "728ed52f",
    name: "John",
    status: "Active",
    number: "08123456789",
    email: "john@businessname.com",
  },
  {
    id: "489e1d42",
    name: "David",
    status: "Active",
    number: "08123456789",
    email: "example@businessname.com",
  },
  {
    id: "48901d42",
    name: "Blackie",
    status: "Disabled",
    number: "08123456789",
    email: "blackie@businessname.com",
  },
];

function Users() {
  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Users</h3>
        <p>Manage all users data and information</p>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default Users;
