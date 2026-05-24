import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { DetailShell, GridItem, Section } from "@/components/admin/DetailShell";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, User, AlertTriangle } from "lucide-react";
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
    <DetailShell
      backHref="/admins/trips"
      backLabel="trips"
      crumbs={[
        { label: "Dashboard", href: "/admins/dashboard" },
        { label: "trips", href: "/admins/trips" },
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
                  <MapPin className="h-4 w-4 text-[var(--admin-text-muted)]" />
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
            <div className="space-y-2 text-sm text-[var(--admin-text-primary)]">
              <p>
                <User className="mr-2 inline h-4 w-4 text-[var(--admin-text-muted)]" />
                {trip.driver.name}
              </p>
              <p>{trip.driver.phone}</p>
            </div>
          </Section>
          <Section title="Vehicle Info">
            <div className="space-y-2 text-sm text-[var(--admin-text-primary)]">
              <p>
                <Truck className="mr-2 inline h-4 w-4 text-[var(--admin-text-muted)]" />
                {trip.vehicle.plate}
              </p>
              <p>{trip.vehicle.model}</p>
            </div>
          </Section>
        </div>

        <Section title="Cargo & Trip Costs">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <GridItem label="Description" value={trip.cargo.description} />
            <GridItem label="Weight" value={trip.cargo.weight} />
            <GridItem label="Fuel Used" value={trip.fuelUsed} />
            <GridItem label="Toll Fees" value={trip.tollFees} />
          </div>
        </Section>

        {trip.issues.length > 0 && (
          <Section title="Issues Reported" subtitle="Reported during the trip">
            <div className="space-y-2">
              {trip.issues.map((issue, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-card-alt)] p-3 text-sm"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-[var(--admin-warning)]" />
                  <div>
                    <span className="font-medium">{issue.type}:</span>{" "}
                    {issue.description}
                  </div>
                </div>
              ))}
            </div>
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
