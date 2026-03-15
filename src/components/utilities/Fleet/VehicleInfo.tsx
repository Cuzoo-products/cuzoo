import { useState } from "react";
import { Link } from "react-router";
import {
  Car,
  Palette,
  Calendar,
  Hash,
  User,
  Clock,
  Wrench,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComboboxForm } from "../ComboboxForm";
import { toast } from "sonner";

type VehicleStatus = "available" | "in use" | "under maintenance" | "disabled";

interface VehicleDetailsProps {
  vehicle: {
    id?: string;
    assigned?: boolean;
    color?: string;
    companyId?: string;
    createdAt?: { _seconds: number; _nanoseconds: number } | string;
    image?: { url: string; path: string; contentType: string };
    model?: string;
    plateNumber?: string;
    riderId?: string;
    status?: VehicleStatus;
    type?: string;
    updatedAt?: { _seconds: number; _nanoseconds: number } | string;
    year?: number;
  };
}

const availableDrivers = [
  { label: "John Doe", value: "1" },
  { label: "Jane Doe", value: "2" },
  { label: "Barry White", value: "3" },
  { label: "David Olushegun", value: "4" },
  { label: "MurFy Doe", value: "5" },
  { label: "Emma John", value: "6" },
  { label: "Victor Kenzy", value: "7" },
  { label: "Tolu Jame", value: "8" },
  { label: "Larry Blue", value: "9" },
];

const statusConfig: Record<
  VehicleStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  available: { label: "Available", variant: "outline" },
  "in use": { label: "In use", variant: "secondary" },
  "under maintenance": { label: "Under maintenance", variant: "destructive" },
  disabled: { label: "Disabled", variant: "destructive" },
};

const formatDisplay = (value: string | undefined) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "—";

const formatDate = (
  value: { _seconds: number; _nanoseconds: number } | string | undefined,
) => {
  if (!value) return "—";
  if (typeof value === "string") {
    try {
      return new Date(value).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return value;
    }
  }
  const date = new Date(value._seconds * 1000);
  return date.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="font-medium text-muted-foreground">{label}</p>
        <p className="truncate">{value}</p>
      </div>
    </div>
  );
}

export default function VehicleInfo({
  vehicle,
}: {
  vehicle: VehicleDetailsProps["vehicle"];
}) {
  const [currentStatus, setCurrentStatus] = useState<VehicleStatus>(
    (vehicle.status as VehicleStatus) || "available",
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus: VehicleStatus) => {
    setIsUpdatingStatus(true);
    try {
      setCurrentStatus(newStatus);
      toast.success("Vehicle status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const statusStyle = statusConfig[currentStatus] ?? statusConfig.available;
  const typeLabel = formatDisplay(vehicle.type);
  const modelLabel = vehicle.model || "—";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero card with image or placeholder */}
      <Card className="overflow-hidden">
        <div className="bg-muted/50">
          {vehicle.image?.url ? (
            <div className="aspect-video max-h-64 w-full flex items-center justify-center bg-muted/30">
              <img
                src={vehicle.image.url}
                alt={`${modelLabel} ${typeLabel}`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video max-h-48 flex items-center justify-center bg-muted/30">
              <Car className="size-16 text-muted-foreground/50" />
            </div>
          )}
          <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold">
                {modelLabel} {typeLabel}
              </h2>
              <p className="text-sm text-muted-foreground font-mono">
                {vehicle.plateNumber || "—"}
              </p>
            </div>
            <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
          </div>
        </div>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <DetailRow icon={Car} label="Type" value={typeLabel} />
            <DetailRow icon={Hash} label="Model" value={modelLabel} />
            <DetailRow
              icon={Calendar}
              label="Year"
              value={vehicle.year?.toString() ?? "—"}
            />
            <DetailRow
              icon={Palette}
              label="Color"
              value={vehicle.color ?? "—"}
            />
            <DetailRow
              icon={Hash}
              label="Plate number"
              value={vehicle.plateNumber ?? "—"}
            />
            <DetailRow
              icon={User}
              label="Driver"
              value={vehicle.assigned ? "Assigned" : "Not assigned"}
            />
            <DetailRow
              icon={Clock}
              label="Created"
              value={formatDate(vehicle.createdAt)}
            />
            <DetailRow
              icon={Wrench}
              label="Last updated"
              value={formatDate(vehicle.updatedAt)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Change status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={currentStatus}
              onValueChange={handleStatusChange}
              disabled={isUpdatingStatus}
            >
              <SelectTrigger className="w-full sm:max-w-xs">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-secondary">
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in use">In use</SelectItem>
                <SelectItem value="under maintenance">
                  Under maintenance
                </SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            {isUpdatingStatus && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                Updating…
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Driver assignment */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="size-5" />
            Driver assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Assign driver
            </p>
            <ComboboxForm info={availableDrivers} />
          </div>
        </CardContent>
      </Card> */}

      {/* Actions */}
      <div className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link to="edit">Edit vehicle</Link>
        </Button>
      </div>
    </div>
  );
}
