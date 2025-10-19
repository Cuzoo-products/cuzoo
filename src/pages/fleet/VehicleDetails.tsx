import { useGetVehicle } from "@/api/fleet/vehicles/useVehicles";
import VehicleInfo from "@/components/utilities/Fleet/VehicleInfo";
import { useParams } from "react-router";

function VehicleDetails() {
  const { id } = useParams();

  const { data: vehicle, isLoading, error } = useGetVehicle(id as string);

  if (isLoading) {
    return (
      <div className="@container/main">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4D37B3]"></div>
        </div>
      </div>
    );
  }

  if (error || !vehicle || !vehicle.data) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl text-red-600">
            Vehicle Not Found
          </h3>
          <p>Unable to load vehicle details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">
          {vehicle.data?.model || "Unknown Model"}{" "}
          {vehicle.data?.type || "Unknown Type"}
        </h3>
        <p>Manage this vehicle's details</p>
      </div>
      <VehicleInfo vehicle={vehicle.data} />
    </div>
  );
}

export default VehicleDetails;
