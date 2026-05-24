import { Car, RouteIcon, Users, Wallet, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type FleetSectionCardProps = {
  finance?: number;
  vehicles?: number;
  drivers?: number;
  trips?: number;
};

type KpiItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  variant?: "primary" | "default";
};

function FleetKpiCard({
  icon: Icon,
  label,
  value,
  variant = "default",
}: KpiItem) {
  return (
    <div
      className={cn(
        "fleet-kpi-card",
        variant === "primary" && "fleet-kpi-card--primary",
      )}
    >
      <div
        className={cn(
          "fleet-kpi-card__icon",
          variant === "primary" && "fleet-kpi-card__icon--primary",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="fleet-kpi-card__value">{value}</p>
      <p className="fleet-kpi-card__label">{label}</p>
    </div>
  );
}

function FleetSectionCard({
  finance = 0,
  vehicles = 0,
  drivers = 0,
  trips = 0,
}: FleetSectionCardProps) {
  const items: KpiItem[] = [
    {
      icon: Wallet,
      label: "Finance",
      value: `₦${finance.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`,
      variant: "primary",
    },
    {
      icon: Car,
      label: "Vehicles",
      value: vehicles.toLocaleString("en-NG"),
    },
    {
      icon: Users,
      label: "Drivers",
      value: drivers.toLocaleString("en-NG"),
    },
    {
      icon: RouteIcon,
      label: "Total Trips",
      value: trips.toLocaleString("en-NG"),
    },
  ];

  return (
    <div className="fleet-kpi-grid">
      {items.map((item) => (
        <FleetKpiCard key={item.label} {...item} />
      ))}
    </div>
  );
}

export default FleetSectionCard;
