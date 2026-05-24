import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { DetailShell, GridItem, Section } from "@/components/admin/DetailShell";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, User, AlertTriangle } from "lucide-react";
import { Link, useParams } from "react-router";

export default function IndividualDriverTipDetails() {
  const { id: driverId } = useParams<{ id: string }>();

  const trip = {
    id: "TRIP-239084",
    status: "In Progress",
    origin: "Lekki",
    destination: "Ikeja",
    price: "₦7,000",
    startTime: "2025-06-19T08:30:00Z",
    estimatedDuration: "1h 30m",
    driver: { name: "Samuel Adeniyi", phone: "+234 801 234 5678" },
    vehicle: { plate: "KRD-123XY", model: "Toyota Hiace" },
    cargo: { description: "Medical Supplies", weight: "500 kg" },
    fuelUsed: "35L",
    tollFees: "₦1,000",
    issues: [
      { type: "Minor Delay", description: "Heavy traffic on Benin bypass" },
    ],
  };

  const backHref = driverId
    ? `/admins/drivers/${driverId}/trips`
    : "/admins/drivers";

  return (
    <DetailShell
      backHref={backHref}
      backLabel="Driver trips"
      crumbs={[
        { label: "Dashboard", href: "/admins/dashboard" },
        { label: "Riders", href: "/admins/drivers" },
        { label: "Trips", href: backHref },
        { label: trip.id },
      ]}
    >
      <PageHeader
        title="Trip Details"
        subtitle="Manage and track trips here"
        actions={<StatusBadge status={trip.status} />}
      />

      <div className="space-y-4">
        <Section title={`Trip ${trip.id}`}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <GridItem
              label="Route"
              value={
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {trip.origin} → {trip.destination}
                </span>
              }
            />
            <GridItem
              label="Started"
              value={new Date(trip.startTime).toLocaleString()}
            />
            <GridItem label="Price" value={trip.price} />
            <GridItem label="Duration" value={trip.estimatedDuration} />
          </div>
        </Section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Section title="Driver Info">
            <p className="text-sm">
              <User className="mr-2 inline h-4 w-4" />
              {trip.driver.name} · {trip.driver.phone}
            </p>
          </Section>
          <Section title="Vehicle Info">
            <p className="text-sm">
              <Truck className="mr-2 inline h-4 w-4" />
              {trip.vehicle.plate} · {trip.vehicle.model}
            </p>
          </Section>
        </div>

        {trip.issues.length > 0 && (
          <Section title="Issues Reported">
            {trip.issues.map((issue, i) => (
              <div
                key={i}
                className="mb-2 flex gap-2 rounded-lg border border-[var(--admin-border)] p-3 text-sm"
              >
                <AlertTriangle className="h-4 w-4 text-[var(--admin-warning)]" />
                <span>
                  <strong>{issue.type}:</strong> {issue.description}
                </span>
              </div>
            ))}
          </Section>
        )}

        <div className="flex justify-end">
          <Button
            asChild
            className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)]"
          >
            <Link to="/admins/map">Track Trip</Link>
          </Button>
        </div>
      </div>
    </DetailShell>
  );
}
