import { useState } from "react";
import { Link } from "react-router";
import { Mail, Phone, MapPin, Calendar, User, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const statusConfig: Record<
  DriverStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  assigned: { label: "Assigned", variant: "default" },
  unassigned: { label: "Unassigned", variant: "secondary" },
  disabled: { label: "Disabled", variant: "destructive" },
};

export const DriverInfo = ({
  driver,
  availableVehicle,
}: {
  driver: Driver;
  availableVehicle: ComboData[];
}) => {
  const [status, setStatus] = useState<DriverStatus>(driver.status ?? "unassigned");

  const name =
    `${driver.firstName ?? ""} ${driver.lastName ?? ""}`.trim() || "Unknown driver";

  const [suspended, setSuspended] = useState(false);

  const handleAssign = () => {
    setStatus((s) => (s === "assigned" ? "unassigned" : "assigned"));
  };

  const handleSuspend = () => {
    setSuspended(true);
  };

  const handleRelease = () => {
    setSuspended(false);
  };

  const statusStyle = statusConfig[status] ?? statusConfig.unassigned;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile card */}
      <Card className="overflow-hidden">
        <div className="bg-muted/50 px-6 py-5">
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
                <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
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
            <div className="flex items-start gap-3">
              <User className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-muted-foreground">Vehicle</p>
                <p>{status === "assigned" ? "Assigned" : "Unassigned"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          {status !== "assigned" ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Assign vehicle</p>
              <ComboboxForm info={availableVehicle} />
            </div>
          ) : (
            <Button variant="outline" onClick={handleAssign}>
              Unassign from vehicle
            </Button>
          )}

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="edit">Edit driver</Link>
            </Button>
            {suspended ? (
              <Button variant="default" size="sm" onClick={handleRelease}>
                Release driver
              </Button>
            ) : (
              <Button variant="destructive" size="sm" onClick={handleSuspend}>
                Suspend driver
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
