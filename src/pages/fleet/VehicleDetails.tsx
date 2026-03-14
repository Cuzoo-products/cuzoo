import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useGetVehicle } from "@/api/fleet/vehicles/useVehicles";
import VehicleInfo from "@/components/utilities/Fleet/VehicleInfo";
import { Button } from "@/components/ui/button";

function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: vehicleResponse, isLoading, error } = useGetVehicle(id ?? "");

  const vehicle = vehicleResponse?.data;

  if (!id) {
    return (
      <div className="@container/main">
        <div className="my-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/fleet/fleets">
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back to vehicles</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Vehicle details</h1>
            <p className="text-sm text-red-500">No vehicle ID provided.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="@container/main">
        <div className="my-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/fleet/fleets">
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back to vehicles</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Vehicle details</h1>
            <p className="text-sm text-muted-foreground">Loading vehicle…</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Fetching vehicle details…</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="@container/main">
        <div className="my-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/fleet/fleets">
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back to vehicles</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-destructive">Vehicle not found</h1>
            <p className="text-sm text-muted-foreground">
              Unable to load vehicle details. Please try again.
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            You can{" "}
            <Link to="/fleet/fleets" className="text-primary underline">
              go back to vehicles
            </Link>{" "}
            and try another.
          </p>
        </div>
      </div>
    );
  }

  const title = [vehicle.model, vehicle.type, vehicle.plateNumber]
    .filter(Boolean)
    .join(" • ") || "Vehicle";

  return (
    <div className="@container/main">
      <header className="my-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link to="/fleet/fleets">
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back to vehicles</span>
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold truncate">{title}</h1>
            <p className="text-sm text-muted-foreground">
              Manage details, status and driver assignment
            </p>
          </div>
        </div>
      </header>

      <VehicleInfo vehicle={vehicle} />
    </div>
  );
}

export default VehicleDetails;
