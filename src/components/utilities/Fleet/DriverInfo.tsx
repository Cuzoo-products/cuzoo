import { Link } from "react-router";
import { Car, Mail, Phone, MapPin, Calendar, User, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ComboboxForm, type ComboData } from "../ComboboxForm";

type DriverStatus = "assigned" | "unassigned" | "disabled";

interface PhoneNumber {
  internationalFormat: string;
  nationalFormat: string;
  number: string;
  countryCode: string;
  countryCallingCode: string;
}

interface Address {
  placeId: string;
  formatted_address: string;
  geometry: { location?: { lat: number; lng: number } };
  country: string;
  state: string;
}

interface ImageFile {
  url: string;
  path: string;
  contentType: string;
}

export interface Driver {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  companyEmail?: string;
  phoneNumber?: PhoneNumber;
  emergencyContact?: PhoneNumber;
  dateOfBirth?: string;
  gender?: string;
  address?: Address;
  passport?: ImageFile;
  driversLicense?: ImageFile;
  approved?: boolean;
  regComplete?: boolean;
  emailVerified?: boolean;
  companyId?: string;
  companyName?: string;
  country?: string;
  state?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: DriverStatus;
  suspended?: boolean;
  vehicles?: Array<{
    id?: string;
    model?: string;
    type?: string;
    plateNumber?: string;
    color?: string;
    year?: number;
    status?: string;
    image?: ImageFile;
  }>;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatPhone = (phone?: PhoneNumber) =>
  phone?.internationalFormat || phone?.nationalFormat || phone?.number || "—";

const getInitials = (driver: Driver) => {
  const first = (driver.firstName ?? "").charAt(0);
  const last = (driver.lastName ?? "").charAt(0);
  return `${first}${last}`.toUpperCase() || "?";
};

const statusLabels: Record<DriverStatus, string> = {
  assigned: "Assigned",
  unassigned: "Unassigned",
  disabled: "Disabled",
};

const statusBadgeClass: Record<DriverStatus, string> = {
  assigned: "fleet-status-badge fleet-status-badge--success",
  unassigned: "fleet-status-badge fleet-status-badge--neutral",
  disabled: "fleet-status-badge fleet-status-badge--danger",
};

export const DriverInfo = ({
  driver,
  availableVehicle,
  onSuspend,
  onRelease,
  isSuspendPending = false,
  isReleasePending = false,
}: {
  driver: Driver;
  availableVehicle: ComboData[];
  onSuspend?: () => void;
  onRelease?: () => void;
  isSuspendPending?: boolean;
  isReleasePending?: boolean;
}) => {
  const hasAssignedVehicle =
    Array.isArray(driver.vehicles) && driver.vehicles.length > 0;
  const status: DriverStatus = hasAssignedVehicle ? "assigned" : "unassigned";
  const assignedPlateNumbers: string[] = hasAssignedVehicle
    ? (driver.vehicles
        ?.map((v) => v.plateNumber?.trim())
        .filter((plate): plate is string => Boolean(plate)) ?? [])
    : [];

  const name =
    `${driver.firstName ?? ""} ${driver.lastName ?? ""}`.trim() || "Unknown driver";

  const suspended = driver.suspended ?? false;

  const handleSuspend = () => {
    if (onSuspend) {
      onSuspend();
    }
  };

  const handleRelease = () => {
    if (onRelease) {
      onRelease();
    }
  };

  const statusStyle = statusBadgeClass[status] ?? statusBadgeClass.unassigned;
  const statusLabel = statusLabels[status] ?? statusLabels.unassigned;

  return (
    <div className="fleet-detail-stack">
      {/* Profile card */}
      <Card className="overflow-hidden">
        <div className="px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Avatar className="size-24 rounded-xl border-4 border-background shadow-md">
              <AvatarImage src={driver.passport?.url} alt={name} className="object-cover" />
              <AvatarFallback className="rounded-xl text-2xl bg-primary/20 text-primary">
                {getInitials(driver)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl truncate">{name}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={statusStyle}>{statusLabel}</span>
                {suspended && (
                  <span className="fleet-status-badge fleet-status-badge--danger">
                    Suspended
                  </span>
                )}
                {driver.gender && (
                  <span className="text-sm text-muted-foreground capitalize">
                    {driver.gender}
                  </span>
                )}
              </div>
              {(driver.email || driver.companyEmail) && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5 truncate">
                  <Mail className="size-3.5 shrink-0" />
                  {driver.email || driver.companyEmail}
                </p>
              )}
              {formatPhone(driver.phoneNumber) !== "—" && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <Phone className="size-3.5 shrink-0" />
                  {formatPhone(driver.phoneNumber)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Bio & contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bio & contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Phone className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-muted-foreground">Phone</p>
                <p>{formatPhone(driver.phoneNumber)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-muted-foreground">Email</p>
                <p className="break-all">{driver.email || driver.companyEmail || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-muted-foreground">Date of birth</p>
                <p>{formatDate(driver.dateOfBirth)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-muted-foreground">Emergency contact</p>
                <p>{formatPhone(driver.emergencyContact)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:col-span-2">
              <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-muted-foreground">Address</p>
                <p>{driver.address?.formatted_address || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:col-span-2">
              <User className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-muted-foreground">
                  Vehicles ({driver.vehicles?.length ?? 0})
                </p>
                {!hasAssignedVehicle ? (
                  <p>Unassigned</p>
                ) : (
                  <ul className="mt-1 space-y-1 list-disc list-inside text-foreground">
                    {assignedPlateNumbers.length > 0
                      ? assignedPlateNumbers.map((plate, i) => (
                          <li key={`${plate}-${i}`}>{plate}</li>
                        ))
                      : (driver.vehicles ?? []).map((v, idx) => (
                          <li key={v.id ?? `v-${idx}`}>
                            {[v.model, v.type].filter(Boolean).join(" • ") ||
                              "Vehicle"}
                          </li>
                        ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All assigned vehicles (detail) */}
      {hasAssignedVehicle && driver.vehicles && driver.vehicles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Car className="size-5" />
              Assigned vehicles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {driver.vehicles.map((v, idx) => {
              const headline = [v.model, v.type].filter(Boolean).join(" · ");
              const label = [headline || "Vehicle", v.plateNumber]
                .filter(Boolean)
                .join(" — ");
              const meta = [v.color, v.year != null ? String(v.year) : null, v.status]
                .filter(Boolean)
                .join(" · ");
              return (
                <div
                  key={v.id ?? `vehicle-${idx}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 pb-4 border-b border-line-1 last:border-0 last:pb-0"
                >
                  <div className="flex gap-3 min-w-0 flex-1">
                    {v.image?.url ? (
                      <img
                        src={v.image.url}
                        alt=""
                        className="size-16 rounded-md object-cover border border-line-1 bg-muted/30 shrink-0"
                      />
                    ) : (
                      <div className="size-16 rounded-md bg-muted/50 flex items-center justify-center shrink-0">
                        <Car className="size-8 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium truncate">{label}</p>
                      {meta ? (
                        <p className="text-sm text-muted-foreground">{meta}</p>
                      ) : null}
                    </div>
                  </div>
                  {v.id ? (
                    <Button asChild variant="outline" size="sm" className="shrink-0 w-fit">
                      <Link to={`/fleet/fleets/${v.id}`}>View vehicle</Link>
                    </Button>
                  ) : null}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Driver's license */}
      {(driver.driversLicense?.url || driver.driversLicense) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="size-5" />
              Driver&apos;s license
            </CardTitle>
          </CardHeader>
          <CardContent>
            {driver.driversLicense?.url ? (
              <img
                src={driver.driversLicense.url}
                alt="Driver's license"
                className="rounded-lg border border-line-1 max-h-48 object-contain bg-muted/30"
              />
            ) : (
              <p className="text-sm text-muted-foreground">No image available</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasAssignedVehicle ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Assign vehicle</p>
              <ComboboxForm info={availableVehicle} menuClassName="fleet-combobox-menu" />
            </div>
          ) : (
            <p className="text-sm text-[var(--admin-text-muted)]">
              Driver is assigned to{" "}
              <span className="font-medium text-[var(--admin-text-primary)]">
                {assignedPlateNumbers.length > 0
                  ? assignedPlateNumbers.join(", ")
                  : `${driver.vehicles?.length ?? 0} vehicle(s)`}
              </span>
              .
            </p>
          )}

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="edit">Edit driver</Link>
            </Button>
            {suspended ? (
              <Button
                variant="default"
                size="sm"
                onClick={handleRelease}
                disabled={isReleasePending}
              >
                {isReleasePending ? "Releasing…" : "Release from suspension"}
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleSuspend}
                disabled={isSuspendPending}
              >
                {isSuspendPending ? "Suspending…" : "Suspend driver"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
