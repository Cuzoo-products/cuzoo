import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type VendorData,
} from "@/components/utilities/Admins/VendorDataTable";

const data: VendorData[] = [
  {
    id: "728ed52f",
    storeCode: "123",
    status: "Active",
    name: "Emmanuel Logistic",
    number: "09012345678",
    email: "m@businessname.com",
  },
  {
    id: "728ed52f",
    name: "Emmanuel Logistic",
    storeCode: "123",
    status: "Active",
    number: "09012345678",
    email: "m@businessname.com",
  },
  {
    id: "728ed52f",
    name: "Emmanuel Logistic",
    storeCode: "123",
    status: "Active",
    number: "09012345678",
    email: "m@businessname.com",
  },
  {
    id: "728ed52f",
    name: "Emmanuel Logistic",
    storeCode: "123",
    status: "Active",
    number: "09012345678",
    email: "m@businessname.com",
  },
];

function AdminVendor() {
  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Vendors</h3>
        <p>Manage all vendors data and information</p>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default AdminVendor;
