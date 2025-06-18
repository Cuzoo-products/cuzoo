import VehicleInfo from "@/components/utilities/Fleet/VehicleInfo";
import car from "@/FolderToDelete/car.jpg";

function VehicleDetails() {
  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Toyota yaris</h3>
        <p>Manage this vehicles details</p>
      </div>
      <VehicleInfo
        vehicle={{
          VehicleType: "Car",
          Make: "Toyota",
          Model: "Camry",
          Year: "2020",
          Color: "White",
          LicensePlateNumber: "ABC-1234",
          AssignedDriver: "John Doe",
          VehicleStatus: "Available",
          VehicleImage: car,
        }}
      />
    </div>
  );
}

export default VehicleDetails;
