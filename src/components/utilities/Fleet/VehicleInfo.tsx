import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import Image from "@/components/ui/image";
import { ComboboxForm } from "../ComboboxForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const availableDrivers = [
  { label: "John Doe", value: "1" },
  { label: "Jane Doe", value: "2" },
  { label: "Barry White", value: "3" },
  { label: "David Olushegun", value: "4" },
  { label: "MurFy Doe", value: "5" },
  { label: "Emma John", value: "6" },
  { label: "Victor kenzy", value: "7" },
  { label: "Tolu Jame", value: "8" },
  { label: "Larry Blue", value: "9" },
];

interface VehicleDetailsProps {
  vehicle: {
    id?: string;
    assigned?: boolean;
    color?: string;
    companyId?: string;
    createdAt?: {
      _seconds: number;
      _nanoseconds: number;
    };
    image?: {
      url: string;
      path: string;
      contentType: string;
    };
    model?: string;
    plateNumber?: string;
    riderId?: string;
    status?: "available" | "in use" | "under maintenance" | "disabled";
    type?: "car" | "bike" | "truck" | "bicycle" | "van" | "tricycle";
    updatedAt?: {
      _seconds: number;
      _nanoseconds: number;
    };
    year?: number;
  };
}

export default function VehicleInfo({
  vehicle,
}: {
  vehicle: VehicleDetailsProps["vehicle"];
}) {
  const [currentStatus, setCurrentStatus] = useState<
    "available" | "in use" | "under maintenance" | "disabled"
  >(vehicle.status || "available");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = async (
    newStatus: "available" | "in use" | "under maintenance" | "disabled"
  ) => {
    setIsUpdatingStatus(true);
    try {
      // TODO: Implement API call to update vehicle status
      // await updateVehicleStatus(vehicle.id, newStatus);
      setCurrentStatus(newStatus);
      toast.success("Vehicle status updated successfully!");
    } catch (error) {
      toast.error("Failed to update vehicle status");
      console.error("Error updating status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  // Helper function to format status for display
  const formatStatus = (status: string | undefined) => {
    if (!status) return "Unknown";
    return status
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Helper function to format vehicle type for display
  const formatVehicleType = (type: string | undefined) => {
    if (!type) return "Unknown";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Helper function to get badge variant based on status
  const getBadgeVariant = (status: string | undefined) => {
    if (!status) return "outline";
    switch (status) {
      case "available":
        return "outline";
      case "in use":
        return "secondary";
      case "under maintenance":
        return "destructive";
      case "disabled":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Helper function to format date from Firebase timestamp
  const formatDate = (timestamp: {
    _seconds: number;
    _nanoseconds: number;
  }) => {
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto my-10 space-y-6">
      <Card className="gap-0">
        <CardHeader className="flex items-center py-3 justify-between my-0">
          <CardTitle className="text-xl font-semibold">
            Vehicle Details
          </CardTitle>
          <Badge variant={getBadgeVariant(currentStatus)}>
            {formatStatus(currentStatus)}
          </Badge>
        </CardHeader>

        <Separator className="my-0" />

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700 py-6">
          <DetailItem
            label="Vehicle Type"
            value={formatVehicleType(vehicle.type)}
          />
          <DetailItem label="Model" value={vehicle.model || "Unknown"} />
          <DetailItem
            label="Year"
            value={vehicle.year?.toString() || "Unknown"}
          />
          <DetailItem label="Color" value={vehicle.color || "Unknown"} />
          <DetailItem
            label="Plate Number"
            value={vehicle.plateNumber || "Unknown"}
          />
          <DetailItem
            label="Assigned Driver"
            value={vehicle.assigned ? "Assigned" : "Not assigned"}
          />
          <DetailItem
            label="Created At"
            value={
              vehicle.createdAt ? formatDate(vehicle.createdAt) : "Unknown"
            }
          />
          <DetailItem
            label="Last Updated"
            value={
              vehicle.updatedAt ? formatDate(vehicle.updatedAt) : "Unknown"
            }
          />
        </CardContent>
      </Card>

      {vehicle.image && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex justify-center bg-gray-50">
              <Image
                source={vehicle.image.url}
                alt="Vehicle"
                className="max-h-80 w-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Change Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Change Vehicle Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Current Status
              </label>
              <Select
                value={currentStatus}
                onValueChange={handleStatusChange}
                disabled={isUpdatingStatus}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in use">In Use</SelectItem>
                  <SelectItem value="under maintenance">
                    Under Maintenance
                  </SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isUpdatingStatus && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4D37B3] mr-2"></div>
                Updating...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Driver Assignment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Driver Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Assign Driver
              </label>
              <ComboboxForm info={availableDrivers} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" asChild>
          <Link to="edit">Edit Vehicle</Link>
        </Button>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}
