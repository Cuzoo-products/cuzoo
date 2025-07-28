import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type AdminTripData,
} from "@/components/utilities/Admins/AdminTripsDataTable";

const data: AdminTripData[] = [
  {
    id: "1",
    refNo: "cuzoo1",
    to: "ajah",
    fro: "lekki",
    date: "26 jan, 2025",
    startTime: "02:30pm",
    endTime: "03:45pm",
    driver: "John Doe",
    amount: "11000",
  },
  {
    id: "2",
    refNo: "cuzoo2",
    to: "ajah",
    fro: "lekki",
    date: "26 jan, 2025",
    startTime: "02:30pm",
    endTime: "03:45pm",
    driver: "John Doe",
    amount: "11000",
  },
  {
    id: "3",
    refNo: "cuzoo3",
    to: "ajah",
    fro: "lekki",
    date: "26 jan, 2025",
    startTime: "02:30pm",
    endTime: "03:45pm",
    driver: "John Doe",
    amount: "11000",
  },
];

function AdminTrips() {
  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Trips</h3>
        <p>View All Trips Here</p>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default AdminTrips;
