import { Link, useParams } from "react-router";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
import { useGetVehicle } from "@/api/fleet/vehicles/useVehicles";
import { useGetRider } from "@/api/fleet/rider/useRiderQuery";
import VehicleInfo from "@/components/utilities/Fleet/VehicleInfo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/utilities/Loader";

/** Normalize GET /fleets/riders/:id response (same shape as driver details). */
function parseFleetRiderRecord(
  payload: unknown,
): Record<string, unknown> | null {
  if (payload == null || typeof payload !== "object") return null;
  const r = payload as { data?: unknown };
  if (Array.isArray(r.data)) {
    const first = r.data[0];
    return first && typeof first === "object"
      ? (first as Record<string, unknown>)
      : null;
  }
  if (r.data && typeof r.data === "object") {
    return r.data as Record<string, unknown>;
  }
  return payload as Record<string, unknown>;
}

function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: vehicleResponse, isLoading, error } = useGetVehicle(id ?? "");

  const vehicle = vehicleResponse?.data;
  const rawRiderId = vehicle?.riderId;
  const riderId =
    typeof rawRiderId === "string"
      ? rawRiderId.trim()
      : rawRiderId != null && rawRiderId !== ""
        ? String(rawRiderId).trim()
        : "";

  const {
    data: riderPayload,
    isLoading: riderLoading,
    isError: riderError,
  } = useGetRider(riderId || undefined);

  const riderRecord = riderPayload
    ? parseFleetRiderRecord(riderPayload)
    : null;
  const riderName = riderRecord
    ? `${(riderRecord.firstName as string) || ""} ${(riderRecord.lastName as string) || ""}`.trim() ||
      "—"
    : "";
  const phoneObj = riderRecord?.phoneNumber as
    | { internationalFormat?: string; nationalFormat?: string }
    | undefined;
  const riderPhone =
    phoneObj?.internationalFormat || phoneObj?.nationalFormat || "";
  const riderEmail =
    (riderRecord?.email as string) ||
    (riderRecord?.companyEmail as string) ||
    "";

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
    return <Loader />;
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
            <h1 className="text-2xl font-bold text-destructive">
              Vehicle not found
            </h1>
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

  const title =
    [vehicle.model, vehicle.type, vehicle.plateNumber]
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

      {riderId ? (
        <Card className="max-w-4xl mx-auto mb-6 border-primary/20">
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="size-5" />
              Assigned driver
            </CardTitle>
            <CardDescription>
              This vehicle is linked to a driver profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {riderLoading ? (
              <p className="text-sm text-muted-foreground">Loading driver…</p>
            ) : riderError || !riderRecord ? (
              <p className="text-sm text-muted-foreground">
                Could not load driver details.{" "}
                <span className="font-mono text-xs">ID: {riderId}</span>
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="font-medium">{riderName}</p>
                </div>
                {riderPhone ? (
                  <div className="flex items-start gap-2">
                    <Phone className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Phone
                      </p>
                      <p className="text-sm">{riderPhone}</p>
                    </div>
                  </div>
                ) : null}
                {riderEmail ? (
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <Mail className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Email
                      </p>
                      <p className="text-sm break-all">{riderEmail}</p>
                    </div>
                  </div>
                ) : null}
                <div className="sm:col-span-2 pt-1">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/fleet/drivers/${riderId}`}>
                      View full driver profile
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      <VehicleInfo
        vehicle={vehicle}
        riderPreviewName={riderName && riderName !== "—" ? riderName : undefined}
        riderPreviewLoading={Boolean(riderId) && riderLoading}
      />
    </div>
  );
}

export default VehicleDetails;
