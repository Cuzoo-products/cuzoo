import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarClock,
  MapPin,
  Truck,
  User,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router";

export default function AdminTripDetails() {
  const trip = {
    id: "TRIP-239084",
    status: "In Progress",
    origin: "Lekki",
    destination: "Ikeja",
    price: "₦7,000",
    startTime: "2025-06-19T08:30:00Z",
    estimatedDuration: "1h 30m",
    driver: {
      name: "Samuel Adeniyi",
      phone: "+234 801 234 5678",
    },
    vehicle: {
      plate: "KRD-123XY",
      model: "Toyota Hiace",
    },
    cargo: {
      description: "Medical Supplies",
      weight: "500 kg",
    },
    fuelUsed: "35L",
    tollFees: "₦1,000",
    issues: [
      { type: "Minor Delay", description: "Heavy traffic on Benin bypass" },
    ],
  };

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Trip Details</h3>
        <p>Manage and track trips here</p>
      </div>

      <div className="bg-secondary max-w-3xl mx-auto p-6 rounded-lg space-y-4 mb-10">
        {/* Trip Summary */}
        <Card className="border border-line-1 bg-background rounded p-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Trip ID: {trip.id}
              <Badge variant="outline">{trip.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>
                {trip.origin} → {trip.destination}
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <CalendarClock className="w-4 h-4" />
              <span>
                Started at: {new Date(trip.startTime).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>Price: {trip.price}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Estimated Duration: <strong>{trip.estimatedDuration}</strong>
            </div>
          </CardContent>
        </Card>

        {/* Driver & Vehicle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-line-1 bg-background rounded p-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-4 h-4" /> Driver Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div>
                <strong>Name:</strong> {trip.driver.name}
              </div>
              <div>
                <strong>Phone:</strong> {trip.driver.phone}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-line-1 bg-background rounded p-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-4 h-4" /> Vehicle Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div>
                <strong>Plate:</strong> {trip.vehicle.plate}
              </div>
              <div>
                <strong>Model:</strong> {trip.vehicle.model}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cargo & Cost */}
        <Card className="border border-line-1 bg-background rounded p-2">
          <CardHeader>
            <CardTitle>Cargo & Trip Costs</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <strong>Description:</strong>
              <br />
              {trip.cargo.description}
            </div>
            <div>
              <strong>Weight:</strong>
              <br />
              {trip.cargo.weight}
            </div>
            <div>
              <strong>Fuel Used:</strong>
              <br />
              {trip.fuelUsed}
            </div>
            <div>
              <strong>Toll Fees:</strong>
              <br />
              {trip.tollFees}
            </div>
          </CardContent>
        </Card>

        {/* Issues */}
        {trip.issues.length > 0 && (
          <Card className="border border-line-1 bg-background rounded p-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" /> Issues Reported
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {trip.issues.map((issue, i) => (
                <div key={i} className="border p-2 rounded-md">
                  <strong>{issue.type}:</strong> {issue.description}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            className="flex justify-center items-center bg-primary rounded-md p-2 text-white hover:text-zinc-500"
            to="/admins/map"
          >
            Track Trip
          </Link>
        </div>
      </div>
    </div>
  );
}
