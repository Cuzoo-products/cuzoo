import PageHeader from "@/components/admin/PageHeader";
import { useGetAllFleets } from "@/api/admin/fleet/useFleet";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Admins/FleetManagersDataTable";
import Loader from "@/components/utilities/Loader";

function FleetOwners() {
  const { data: fleetManagers, isLoading } = useGetAllFleets();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Fleet Managers"
        subtitle="Manage all fleet managers data and information"
      />

      <DataTable adminVariant searchPlaceholder="Search..." columns={columns} data={fleetManagers?.data?.data} />
    </div>
  );
}

export default FleetOwners;
