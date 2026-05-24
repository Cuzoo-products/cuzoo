import { useGetFleetTrips } from "@/api/fleet/trips/useTrips";
import PageHeader from "@/components/admin/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type TripData,
} from "@/components/utilities/Fleet/TripsTable";
import Loader from "@/components/utilities/Loader";

type FleetTrip = {
  id: string;
  status: string;
  createdAt: string;
  amount: number;
  driver: string;
  from: string;
  date: string;
  destinations: string[];
  startTime: string;
  endTime: string;
};

type FleetTripsResponse = {
  success: boolean;
  statusCode: number;
  data: {
    count: number;
    lastCursor: number;
    limit: number;
    data: FleetTrip[];
  };
};

function Trips() {
  const { data, isLoading, error } = useGetFleetTrips() as {
    data?: FleetTripsResponse;
    isLoading: boolean;
    error: unknown;
  };

  const trips = data?.data?.data ?? [];

  const tableData: TripData[] = trips.map((trip) => {
    const destination =
      trip.destinations && trip.destinations.length > 0
        ? trip.destinations[trip.destinations.length - 1]
        : "";

    const formattedDate =
      trip.date && trip.date !== "string"
        ? trip.date
        : new Date(trip.createdAt).toLocaleDateString("en-NG", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });

    return {
      id: trip.id,
      refNo: trip.id,
      to: destination,
      fro: trip.from,
      date: formattedDate,
      startTime: trip.startTime,
      endTime: trip.endTime,
      driver: trip.driver,
      amount: trip.amount.toString(),
    };
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="space-y-5">
        <PageHeader title="Trips" subtitle="Unable to load trips." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Trips" subtitle="View all trips here" />
      <DataTable
        adminVariant
        searchPlaceholder="Search trips..."
        columns={columns}
        data={tableData}
      />
    </div>
  );
}

export default Trips;
