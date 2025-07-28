import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type DriverData,
} from "@/components/utilities/Admins/AdminDriversDataTable";

const data: DriverData[] = [
  {
    id: "728ed52f",
    name: "Emmanuel",
    status: "Active",
    email: "m@businessname.com",
  },
  {
    id: "728ed52f",
    name: "John",
    status: "Active",
    email: "john@businessname.com",
  },
  {
    id: "489e1d42",
    name: "David",
    status: "Active",
    email: "example@businessname.com",
  },
  {
    id: "48901d42",
    name: "Blackie",
    status: "Disabled",
    email: "blackie@businessname.com",
  },
];

function DriversInAdmin() {
  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Drivers</h3>
        <p>Manage all drivers data and information</p>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default DriversInAdmin;
