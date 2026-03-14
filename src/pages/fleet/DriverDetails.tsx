import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useGetRider } from "@/api/fleet/rider/useRiderQuery";
import { useGetVehicles } from "@/api/fleet/vehicles/useVehicles";
import { DriverInfo } from "@/components/utilities/Fleet/DriverInfo";
import type { ComboData } from "@/components/utilities/ComboboxForm";
import { Button } from "@/components/ui/button";

type VehiclesResponse = {
  data?: {
    data?: { id: string; model?: string; type?: string; plateNumber?: string }[];
  };
};

function DriverDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: rider, isLoading, error } = useGetRider(id as string);
  const { data: vehiclesResponse, isLoading: vehiclesLoading } = useGetVehicles() as {
    data?: VehiclesResponse;
    isLoading: boolean;
  };

  const vehicleList = vehiclesResponse?.data?.data ?? [];
  const availableVehicles: ComboData[] = vehicleList.map((v) => ({
    value: v.id,
    label: `${v.type || v.model || "Vehicle"} (${v.plateNumber || "N/A"})`,
  }));

  if (isLoading) {
    return (
      <div className="@container/main">
        <div className="my-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/fleet/drivers">
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back to drivers</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Driver details</h1>
            <p className="text-sm text-muted-foreground">Loading driver…</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Fetching driver and vehicles…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="@container/main">
        <div className="my-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/fleet/drivers">
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back to drivers</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-destructive">Error loading driver</h1>
            <p className="text-sm text-muted-foreground">
              Unable to load driver details. Please try again.
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            You can <Link to="/fleet/drivers" className="text-primary underline">go back to drivers</Link> and try another.
          </p>
        </div>
      </div>
    );
  }

  if (!rider) {
    return (
      <div className="@container/main">
        <div className="my-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/fleet/drivers">
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back to drivers</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Driver not found</h1>
            <p className="text-sm text-muted-foreground">No driver data was received.</p>
          </div>
        </div>
        <div className="rounded-lg border border-line-1 bg-muted/30 p-6 text-center">
          <Button asChild variant="outline">
            <Link to="/fleet/drivers">Back to drivers</Link>
          </Button>
        </div>
      </div>
    );
  }

  let driverData: Record<string, unknown> | undefined;
  if (Array.isArray(rider.data)) {
    driverData = rider.data[0] as Record<string, unknown>;
  } else if (rider.data && typeof rider.data === "object") {
    driverData = rider.data as Record<string, unknown>;
  } else {
    driverData = rider as unknown as Record<string, unknown>;
  }

  if (!driverData) {
    return (
      <div className="@container/main">
        <div className="my-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/fleet/drivers">
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back to drivers</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-destructive">Driver data not available</h1>
            <p className="text-sm text-muted-foreground">Driver information could not be loaded.</p>
          </div>
        </div>
        <div className="rounded-lg border border-line-1 bg-muted/30 p-6 text-center">
          <Button asChild variant="outline">
            <Link to="/fleet/drivers">Back to drivers</Link>
          </Button>
        </div>
      </div>
    );
  }

  const driverName =
    `${driverData.firstName || ""} ${driverData.lastName || ""}`.trim() ||
    "Unknown driver";

  return (
    <div className="@container/main">
      <header className="my-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link to="/fleet/drivers">
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back to drivers</span>
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold truncate">{driverName}</h1>
            <p className="text-sm text-muted-foreground">
              Manage bio, vehicle assignment and details
            </p>
          </div>
        </div>
      </header>

      <DriverInfo
        driver={driverData as Parameters<typeof DriverInfo>[0]["driver"]}
        availableVehicle={vehiclesLoading ? [] : availableVehicles}
      />
    </div>
  );
}

export default DriverDetails;
