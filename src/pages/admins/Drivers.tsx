import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type DriverData,
} from "@/components/utilities/Admins/AdminDriversDataTable";
import { useGetRiders } from "@/api/admin/riders/useRiders";
import Loader from "@/components/utilities/Loader";


function DriversInAdmin() {
  const { data: ridersData, isLoading, error } = useGetRiders() as {
    data?: {
      success: boolean;
      statusCode: number;
      data: {
        count: number;
        lastCursor: number;
        limit: number;
        data: Array<{
          Id: string;
          id?: string;
          _id?: string;
          firstName?: string;
          lastName?: string;
          email?: string;
          approved?: boolean;
          suspended?: boolean;
        }>;
      };
    };
    isLoading: boolean;
    error: unknown;
  };

  const riders = ridersData?.data?.data ?? [];

  const tableData: DriverData[] = riders.map((r) => {
    const riderId = r.Id ?? r.id ?? r._id ?? "";
    const firstName = r.firstName ?? "";
    const lastName = r.lastName ?? "";
    const name = `${firstName} ${lastName}`.trim() || riderId;

    // Treat "active" as approved and not suspended.
    const isActive = Boolean(r.approved) && !Boolean(r.suspended);

    return {
      id: riderId,
      name,
      email: r.email ?? "—",
      status: isActive ? "Active" : "Disabled",
    };
  });

  if (isLoading) {
    return (
      <Loader/>
    );
  }

  if (error) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Drivers</h3>
          <p className="text-red-500">Failed to load drivers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Drivers</h3>
        <p>Manage all drivers data and information</p>
      </div>

      <DataTable columns={columns} data={tableData} />
    </div>
  );
}

export default DriversInAdmin;
