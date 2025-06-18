import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import Image from "@/components/ui/image";
import { ComboboxForm } from "../ComboboxForm";

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
    VehicleType: string;
    Make: string;
    Model: string;
    Year: string;
    Color: string;
    LicensePlateNumber: string;
    AssignedDriver?: string;
    VehicleStatus: "Available" | "In Use" | "Under Maintenance" | "Disabled";
    VehicleImage?: string;
  };
}

export default function VehicleInfo({
  vehicle,
}: {
  vehicle: VehicleDetailsProps["vehicle"];
}) {
  return (
    <div className="bg-secondary max-w-3xl mx-auto my-10 p-4 space-y-6">
      <Card className="gap-0">
        <CardHeader className="flex items-center py-3 justify-between my-0">
          <CardTitle className="text-xl font-semibold">
            Vehicle Details
          </CardTitle>
          <Badge
            variant={
              vehicle.VehicleStatus === "Available"
                ? "outline"
                : vehicle.VehicleStatus === "In Use"
                ? "secondary"
                : vehicle.VehicleStatus === "Under Maintenance"
                ? "destructive"
                : undefined
            }
          >
            {vehicle.VehicleStatus}
          </Badge>
        </CardHeader>

        <Separator className="my-0" />

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 py-3">
          <DetailItem label="Vehicle Type" value={vehicle.VehicleType} />
          <DetailItem label="Make" value={vehicle.Make} />
          <DetailItem label="Model" value={vehicle.Model} />
          <DetailItem label="Year" value={vehicle.Year} />
          <DetailItem label="Color" value={vehicle.Color} />
          <DetailItem
            label="License Plate"
            value={vehicle.LicensePlateNumber}
          />
          <DetailItem
            label="Assigned Driver"
            value={vehicle.AssignedDriver || "Not assigned"}
          />
        </CardContent>
      </Card>

      {vehicle.VehicleImage && (
        <div className="flex justify-center">
          <Image
            source={vehicle.VehicleImage}
            alt="Vehicle"
            className="max-h-64 rounded-md"
          />
        </div>
      )}

      <div className="flex justify-end">
        <div>
          <div className="my-2">
            <h3>Assign Driver</h3>
            <ComboboxForm info={availableDrivers} />
          </div>
          <div className="my-2 flex space-x-2">
            <Link
              to="edit"
              className="text-primary flex justify-center items-center border rounded-md px-2 hover:text-accent"
            >
              Edit Vehicle
            </Link>

            <Button asChild>
              <Link to={`/vehicles/edit/${vehicle.LicensePlateNumber}`}>
                Edit Vehicle
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
