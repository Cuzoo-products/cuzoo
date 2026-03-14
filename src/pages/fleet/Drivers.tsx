import { useGetRiders } from "@/api/fleet/rider/useRiderQuery";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/utilities/Fleet/DriverTableFormate";
import Loader from "@/components/utilities/Loader";

function Drivers() {
  const { data: riders, isLoading } = useGetRiders();

  if (isLoading) {
    return <Loader />;
  }

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
