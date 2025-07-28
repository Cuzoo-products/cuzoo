import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type FleetManagerData,
} from "@/components/utilities/Admins/FleetManagersDataTable";

const data: FleetManagerData[] = [
  {
    id: "728ed52f",
    name: "Emmanuel Logistic",
    number: "09012345678",
    email: "m@businessname.com",
  },
  {
    id: "728ed52f",
    name: "Emmanuel Logistic",
    number: "09012345678",
    email: "m@businessname.com",
  },
  {
    id: "728ed52f",
    name: "Emmanuel Logistic",
    number: "09012345678",
    email: "m@businessname.com",
  },
  {
    id: "728ed52f",
    name: "Emmanuel Logistic",
    number: "09012345678",
    email: "m@businessname.com",
  },
];

function FleetOwners() {
  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Fleet Manager</h3>
        <p>Manage all drivers data and information</p>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default FleetOwners;
