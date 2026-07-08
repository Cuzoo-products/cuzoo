import { CreditCard, DollarSign, TrendingUp, Users, Wallet } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import KpiCard from "@/components/admin/KpiCard";
import Loader from "@/components/utilities/Loader";
import { useAdminEarnings } from "@/api/admin/finance/useEarnings";
import { parseAdminEarnings } from "@/api/admin/finance/earnings";

export default function AdminFinance() {
  const { data, isLoading, error } = useAdminEarnings();
  const earnings = parseAdminEarnings(data);

  if (isLoading) return <Loader />;

  if (error || !earnings) {
    return (
      <div className="space-y-6">
        <PageHeader title="Finance" subtitle="Failed to load earnings." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance"
        subtitle="Overview of platform financials"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          icon={<DollarSign className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="Total Revenue"
          value={earnings.totalRevenue}
          prefix="₦"
          decimals={2}
        />
        <KpiCard
          icon={<Wallet className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="Platform Earnings"
          value={earnings.platformEarnings}
          prefix="₦"
          decimals={2}
        />
        <KpiCard
          icon={<Users className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="Rider Earnings"
          value={earnings.riderEarnings}
          prefix="₦"
          decimals={2}
        />
        <KpiCard
          icon={<CreditCard className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="Vendor Earnings"
          value={earnings.vendorEarnings}
          prefix="₦"
          decimals={2}
        />
        <KpiCard
          icon={<TrendingUp className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="Fleet Earnings"
          value={earnings.fleetEarnings}
          prefix="₦"
          decimals={2}
        />
      </div>
    </div>
  );
}
