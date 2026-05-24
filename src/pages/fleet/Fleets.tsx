import { useGetVehicles } from "@/api/fleet/vehicles/useVehicles";
import PageHeader from "@/components/admin/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Fleet/VehicleTableFormat";
import Loader from "@/components/utilities/Loader";

function Fleets() {
  const { data: vehicles, isLoading } = useGetVehicles();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vehicles"
        subtitle="Manage all vehicles data and information"
      />
      <DataTable
        adminVariant
        searchPlaceholder="Search vehicles..."
        columns={columns}
        data={vehicles?.data?.data || []}
      />
    </div>
  );
}
export default Fleets;
