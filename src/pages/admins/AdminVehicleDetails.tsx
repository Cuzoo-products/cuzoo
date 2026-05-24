import { Link, useParams } from "react-router";
import { Building2, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/utilities/Loader";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { DetailShell, GridItem, Section } from "@/components/admin/DetailShell";
import { useGetVehicle } from "@/api/admin/vehicle/useVehicle";
import { useGetOneRider } from "@/api/admin/riders/useRiders";
import { useGetOneFleet } from "@/api/admin/fleet/useFleet";

type VehicleImage = {
  path?: string;
  url?: string;
  type?: string;
};

type VehicleDetail = {
  color?: string;
  model?: string;
  type?: string;
  plateNumber?: string;
  companyId?: string;
  image?: VehicleImage;
  year?: number;
  assigned?: boolean;
  riderId?: string;
  status?: string;
};

type VehicleDetailResponse = {
  success?: boolean;
  data?: VehicleDetail;
};

function riderIdFromVehicle(v: VehicleDetail | undefined): string {
  const raw = v?.riderId;
  if (raw == null) return "";
  if (typeof raw === "string") return raw.trim();
  return String(raw).trim();
}

function companyIdFromVehicle(v: VehicleDetail | undefined): string {
  const raw = v?.companyId;
  if (raw == null) return "";
  if (typeof raw === "string") return raw.trim();
  return String(raw).trim();
}

type FleetBasic = {
  businessName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: {
    internationalFormat?: string;
    nationalFormat?: string;
    number?: string;
  };
  approvalStatus?: string;
  approved?: boolean;
  suspended?: boolean;
};

/** Normalize GET /riders/:id response (envelope or raw rider). */
function parseAdminRiderRecord(
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

function formatRiderPhone(phone: unknown): string {
  if (!phone || typeof phone !== "object") return "";
  const p = phone as {
    internationalFormat?: string;
    nationalFormat?: string;
    number?: string;
  };
  return (p.internationalFormat ?? p.nationalFormat ?? p.number ?? "").trim();
}

export default function AdminVehicleDetails() {
  const { id: routeId } = useParams<{ id: string }>();
  const id =
    routeId && routeId !== "undefined" && routeId !== "null"
      ? decodeURIComponent(routeId)
      : undefined;

  const { data: payload, isLoading, isError } = useGetVehicle(id);

  const vehicle = (payload as VehicleDetailResponse | undefined)?.data;
  const assignedRiderId = riderIdFromVehicle(vehicle);
  const companyId = companyIdFromVehicle(vehicle);

  const {
    data: fleetPayload,
    isLoading: fleetLoading,
    isError: fleetError,
  } = useGetOneFleet(companyId || undefined);

  const fleet = (fleetPayload as { data?: FleetBasic } | undefined)?.data;

  const {
    data: riderPayload,
    isLoading: riderLoading,
    isError: riderError,
  } = useGetOneRider(assignedRiderId || undefined);

  const riderRecord = riderPayload ? parseAdminRiderRecord(riderPayload) : null;
  const riderName = riderRecord
    ? `${(riderRecord.firstName as string) || ""} ${(riderRecord.lastName as string) || ""}`.trim() ||
      "—"
    : "";
  const riderPhone = riderRecord
    ? formatRiderPhone(riderRecord.phoneNumber)
    : "";
  const riderEmail =
    (riderRecord?.email as string) ||
    (riderRecord?.companyEmail as string) ||
    "";

  const fleetContactName = fleet
    ? [fleet.firstName, fleet.lastName].filter(Boolean).join(" ").trim()
    : "";
  const fleetPhone = fleet ? formatRiderPhone(fleet.phoneNumber) : "";

  if (!id) {
    return (
      <DetailShell
        backHref="/admins/vehicles"
        backLabel="Vehicles"
        crumbs={[
          { label: "Dashboard", href: "/admins/dashboard" },
          { label: "Vehicles", href: "/admins/vehicles" },
          { label: "Error" },
        ]}
      >
        <PageHeader
          title="Vehicle details"
          subtitle="No vehicle ID in the URL."
        />
      </DetailShell>
    );
  }

  if (isLoading) return <Loader />;

  if (isError || !vehicle) {
    return (
      <DetailShell
        backHref="/admins/vehicles"
        backLabel="Vehicles"
        crumbs={[
          { label: "Dashboard", href: "/admins/dashboard" },
          { label: "Vehicles", href: "/admins/vehicles" },
          { label: "Error" },
        ]}
      >
        <PageHeader
          title="Vehicle details"
          subtitle="Unable to load this vehicle."
        />
      </DetailShell>
    );
  }

  const imgUrl = vehicle.image?.url?.trim();

  return (
    <DetailShell
      backHref="/admins/vehicles"
      backLabel="Vehicles"
      crumbs={[
        { label: "Dashboard", href: "/admins/dashboard" },
        { label: "Vehicles", href: "/admins/vehicles" },
        { label: vehicle.plateNumber ?? id },
      ]}
    >
      <PageHeader
        title="Vehicle details"
        subtitle={`${vehicle.plateNumber ?? id} · ${vehicle.model ?? "—"}`}
        actions={
          vehicle.status ? <StatusBadge status={vehicle.status} /> : undefined
        }
      />

      <div className="mx-auto max-w-3xl space-y-4">
        <Section title="Vehicle information">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <GridItem label="Plate number" value={vehicle.plateNumber ?? "—"} />
            <GridItem label="Status" value={vehicle.status ?? "—"} />
            <GridItem label="Model" value={vehicle.model ?? "—"} />
            <GridItem label="Type" value={vehicle.type ?? "—"} />
            <GridItem
              label="Year"
              value={vehicle.year != null ? String(vehicle.year) : "—"}
            />
            <GridItem label="Color" value={vehicle.color ?? "—"} />
            <GridItem label="Company ID" value={vehicle.companyId ?? "—"} />
            <GridItem label="Assigned" value={assignedRiderId ? "Yes" : "No"} />
          </div>
        </Section>

        {companyId ? (
          <Card className="border-border bg-background/50">
            <CardHeader className="py-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="size-5" />
                Fleet company
              </CardTitle>
              <CardDescription>Details of vehicle's owner.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {fleetLoading ? (
                <p className="text-muted-foreground">Loading fleet…</p>
              ) : fleetError ? (
                <p className="text-muted-foreground">
                  Could not load vehicle's owner details.
                </p>
              ) : fleet ? (
                <>
                  {fleetContactName ? (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Contact name
                      </p>
                      <p>{fleetContactName}</p>
                    </div>
                  ) : null}
                  {fleet?.email ? (
                    <div className="flex items-start gap-2">
                      <Mail className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Email
                        </p>
                        <p className="break-all">{fleet?.email}</p>
                      </div>
                    </div>
                  ) : null}
                  {fleetPhone ? (
                    <div className="flex items-start gap-2">
                      <Phone className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Phone
                        </p>
                        <p>{fleetPhone}</p>
                      </div>
                    </div>
                  ) : null}
                  {fleet?.approvalStatus != null &&
                  fleet?.approvalStatus !== "" ? (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Approval
                      </p>
                      <p className="capitalize">{fleet?.approvalStatus}</p>
                    </div>
                  ) : null}
                  <Button asChild variant="outline" size="sm">
                    <Link
                      to={`/admins/fleet_managers/${encodeURIComponent(companyId)}`}
                    >
                      View fleet profile
                    </Link>
                  </Button>
                </>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        {assignedRiderId ? (
          <Card className="border-primary/20 bg-background/50">
            <CardHeader className="py-4">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="size-5" />
                Assigned rider
              </CardTitle>
              <CardDescription>
                Details of vehicle's assigned rider.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {riderLoading ? (
                <p className="text-muted-foreground">Loading rider…</p>
              ) : riderError ? (
                <p className="text-muted-foreground">
                  Could not load vehicle's assigned rider details.
                </p>
              ) : riderRecord ? (
                <>
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
                        <p>{riderPhone}</p>
                      </div>
                    </div>
                  ) : null}
                  {riderEmail ? (
                    <div className="flex items-start gap-2">
                      <Mail className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Email
                        </p>
                        <p className="break-all">{riderEmail}</p>
                      </div>
                    </div>
                  ) : null}
                  <Button asChild variant="outline" size="sm">
                    <Link
                      to={`/admins/drivers/${encodeURIComponent(assignedRiderId)}`}
                    >
                      View rider profile
                    </Link>
                  </Button>
                </>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        <Separator />

        <div className="text-sm">
          <h4 className="mb-2 font-semibold">Image</h4>
          {imgUrl ? (
            <a
              href={imgUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block"
            >
              <img
                src={imgUrl}
                alt={vehicle.model ?? "Vehicle"}
                className="max-h-56 max-w-full rounded-md border object-contain"
              />
            </a>
          ) : (
            <p className="text-muted-foreground">No image URL.</p>
          )}
        </div>

      </div>
    </DetailShell>
  );
}
