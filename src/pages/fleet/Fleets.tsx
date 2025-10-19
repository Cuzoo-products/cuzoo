import { useGetVehicles } from "@/api/fleet/vehicles/useVehicles";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Fleet/VehicleTableFormat";

function Fleets() {
  const { data: vehicles } = useGetVehicles();

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Vehicles</h3>
        <p>Manage all vehicles data and information</p>
      </div>

      <DataTable columns={columns} data={vehicles?.data?.data || []} />
    </div>
  );
}
export default Fleets;
