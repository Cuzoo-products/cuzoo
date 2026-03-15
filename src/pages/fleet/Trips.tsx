import { useGetFleetTrips } from "@/api/fleet/trips/useTrips";
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
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Trips</h3>
          <p className="text-red-500">Unable to load trips.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Trips</h3>
        <p>View All Trips Here</p>
      </div>

      <DataTable columns={columns} data={tableData} />
    </div>
  );
}

export default Trips;
