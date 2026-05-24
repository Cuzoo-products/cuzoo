import KpiCard from "@/components/admin/KpiCard";
import { Briefcase, Bike, CreditCard, Users } from "lucide-react";

function DashboardCards({
  finance,
  vendors,
  drivers,
  fleets,
}: {
  finance?: number;
  vendors?: number;
  drivers?: number;
  fleets?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={<CreditCard className="h-5 w-5 text-white" />}
        label="Finance"
        value={finance ?? 0}
        prefix="₦"
        decimals={2}
        variant="accent"
        href="/admins/financials"
      />
      <KpiCard
        icon={<Bike className="h-5 w-5 text-[var(--admin-accent)]" />}
        label="Drivers"
        value={drivers ?? 0}
        href="/admins/drivers"
      />
      <KpiCard
        icon={<Users className="h-5 w-5 text-[var(--admin-accent)]" />}
        label="Fleet"
        value={fleets ?? 0}
        href="/admins/fleet_managers"
      />
      <KpiCard
        icon={<Briefcase className="h-5 w-5 text-[var(--admin-accent)]" />}
        label="Vendors"
        value={vendors ?? 0}
        href="/admins/vendors"
      />
    </div>
  );
}

export default DashboardCards;
