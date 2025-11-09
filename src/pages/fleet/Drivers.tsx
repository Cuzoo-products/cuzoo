import { useGetRiders } from "@/api/fleet/rider/useRiderQuery";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Fleet/DriverTableFormate";

function Drivers() {
  const { data: riders } = useGetRiders();

  console.log(riders?.data);

  console.log(riders?.data?.data);
  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Drivers</h3>
        <p>Manage all drivers data and information</p>
      </div>

      <DataTable columns={columns} data={riders?.data?.data || []} />
    </div>
  );
}

export default Drivers;
