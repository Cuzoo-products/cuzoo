import { useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/utilities/Loader";
import {
  useGetRider,
  useReleaseRider,
  useSuspendRider,
} from "@/api/fleet/rider/useRiderQuery";
import { DriverInfo, type Driver } from "@/components/utilities/Fleet/DriverInfo";
import PageHeader from "@/components/admin/PageHeader";
import { DetailShell } from "@/components/admin/DetailShell";

function vehiclesFromRiderPayload(
  data: Record<string, unknown>,
): Driver["vehicles"] {
  const raw = data.Vehicles ?? data.vehicles;
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw as NonNullable<Driver["vehicles"]>;
  }
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

  const driverBack = `/fleet/drivers`;
  const crumbs = [
    { label: "Dashboard", href: "/fleet/dashboard" },
    { label: "Drivers", href: driverBack },
    { label: "Driver" },
  ];

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
      <DetailShell backHref={driverBack} backLabel="Drivers" crumbs={crumbs}>
        <PageHeader
          title="Driver"
          subtitle="Unable to load driver details. Please try again."
        />
      </DetailShell>
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
      <DetailShell backHref={driverBack} backLabel="Drivers" crumbs={crumbs}>
        <PageHeader
          title="Driver"
          subtitle="Driver information could not be loaded."
        />
      </DetailShell>
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
    <DetailShell backHref={driverBack} backLabel="Drivers" crumbs={crumbs}>
      <PageHeader
        title={driverName}
        subtitle="Manage bio, vehicle assignment and details"
      />
      <DriverInfo
        driver={driverForUi}
        availableVehicle={[]}
        onSuspend={handleSuspend}
        onRelease={handleRelease}
        isSuspendPending={isSuspendPending}
        isReleasePending={isReleasePending}
      />
    </DetailShell>
  );
}

export default DriverDetails;
