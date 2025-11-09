import { useGetAllFleets } from "@/api/admin/useFleet";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Admins/FleetManagersDataTable";
import Loader from "@/components/utilities/Loader";

function FleetOwners() {
  const { data: fleetManagers, isLoading } = useGetAllFleets();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Fleet Manager</h3>
        <p>Manage all drivers data and information</p>
      </div>

      <DataTable columns={columns} data={fleetManagers?.data?.data} />
    </div>
  );
}

export default FleetOwners;
