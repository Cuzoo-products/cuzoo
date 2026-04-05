import { Link, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader } from "lucide-react";
import {
  useGetRider,
  useReleaseRider,
  useSuspendRider,
} from "@/api/fleet/rider/useRiderQuery";
import { DriverInfo, type Driver } from "@/components/utilities/Fleet/DriverInfo";
import { Button } from "@/components/ui/button";

function vehiclesFromRiderPayload(
  data: Record<string, unknown>,
): Driver["vehicles"] {
  const raw = data.Vehicles ?? data.vehicles;
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw as NonNullable<Driver["vehicles"]>;
  }
  // Some responses wrap a single vehicle as an object instead of a one-element array
  if (typeof raw === "object") {
    return [raw as NonNullable<Driver["vehicles"]>[number]];
  }
  return [];
}

function DriverDetails() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: rider, isLoading, error } = useGetRider(id as string);
  const { mutate: suspendRider, isPending: isSuspendPending } =
    useSuspendRider();
  const { mutate: releaseRider, isPending: isReleasePending } =
    useReleaseRider();
  const handleSuspend = () => {
    if (!id) return;
    suspendRider(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getRider", id] });
      },
    });
  };

  const handleRelease = () => {
    if (!id) return;
    releaseRider(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getRider", id] });
      },
    });
  };

  if (isLoading) {
    return <Loader />;
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
            <h1 className="text-2xl font-bold text-destructive">
              Error loading driver
            </h1>
            <p className="text-sm text-muted-foreground">
              Unable to load driver details. Please try again.
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            You can{" "}
            <Link to="/fleet/drivers" className="text-primary underline">
              go back to drivers
            </Link>{" "}
            and try another.
          </p>
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
            <h1 className="text-2xl font-bold text-destructive">
              Driver data not available
            </h1>
            <p className="text-sm text-muted-foreground">
              Driver information could not be loaded.
            </p>
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

  const driverForUi: Driver = {
    ...(driverData as unknown as Driver),
    vehicles: vehiclesFromRiderPayload(driverData),
  };

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
        driver={driverForUi}
        availableVehicle={[]}
        onSuspend={handleSuspend}
        onRelease={handleRelease}
        isSuspendPending={isSuspendPending}
        isReleasePending={isReleasePending}
      />
    </div>
  );
}

export default DriverDetails;
