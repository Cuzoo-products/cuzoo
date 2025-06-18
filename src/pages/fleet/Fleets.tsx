import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  type VehicleData,
} from "@/components/utilities/Fleet/VehicleTableFormat";

const data: VehicleData[] = [
  {
    id: "e4wew5r",
    name: "Toyota Camry",
    vehicleStatus: "Available",
    type: "Car",
    driver: "John Doe",
    number: "EKY 334 XV",
  },
  {
    id: "eUF2S5r",
    name: "Toyota Camry",
    vehicleStatus: "In Use",
    driver: "John Doe",
    type: "Truck",
    number: "EKY 334 XV",
  },
  {
    id: "UIxd42",
    name: "Toyota Camry",
    vehicleStatus: "Available",
    driver: "Unasigned",
    type: "Bike",
    number: "EKY 334 XV",
  },
];

function Fleets() {
  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Vehicles</h3>
        <p>Manage all vehicles data and information</p>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default Fleets;
