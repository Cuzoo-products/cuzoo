import { useGetRiders } from "@/api/fleet/rider/useRiderQuery";
import PageHeader from "@/components/admin/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Fleet/DriverTableFormate";
import Loader from "@/components/utilities/Loader";

function Drivers() {
  const { data: riders, isLoading } = useGetRiders();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Drivers"
        subtitle="Manage all drivers data and information"
      />
      <DataTable
        adminVariant
        searchPlaceholder="Search drivers..."
        columns={columns}
        data={riders?.data?.data || []}
      />
    </div>
  );
}

export default Drivers;
