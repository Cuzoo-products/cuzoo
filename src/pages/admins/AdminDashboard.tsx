import DashboardCards from "@/components/utilities/Admins/DashboardCards";
import PageHeader from "@/components/admin/PageHeader";
import AdminActionItems from "@/components/admin/AdminActionItems";
import AdminRevenueChart from "@/components/admin/AdminRevenueChart";
import AdminTopPerformersCard from "@/components/admin/AdminTopPerformersCard";
import { useAdminDashboard } from "@/api/admin/dashboard/useDashboard";
import { useAdminActionItems } from "@/hooks/useAdminActionItems";
import Loader from "@/components/utilities/Loader";

type PassportAsset = { url?: string; path?: string; type?: string };

type TopPerformingDriverPoint = {
  firstName?: string;
  lastName?: string;
  trips?: number;
  passport?: PassportAsset;
  id?: number | string;
};

type RevenueSalesPoint = {
  month?: string;
  revenue?: number;
  sales?: number;
};

type AdminDashboardData = {
  vendors?: number;
  drivers?: number;
  fleets?: number;
  topPerformingDrivers?: TopPerformingDriverPoint[];
  revenueSalesGraph?: RevenueSalesPoint[];
};

function AdminDashboard() {
  const { data, isLoading, error } = useAdminDashboard();
  const actionItems = useAdminActionItems();

  if (error) {
    return (
      <p className="text-sm text-[var(--admin-danger)]">Error: {error.message}</p>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  const dashboard = (data?.data ?? {}) as AdminDashboardData;
  const vendors = dashboard.vendors ?? 0;
  const drivers = dashboard.drivers ?? 0;
  const fleets = dashboard.fleets ?? 0;

  const revenueSalesGraph: RevenueSalesPoint[] =
    dashboard.revenueSalesGraph ?? [];
  const chartData = revenueSalesGraph.map((p: RevenueSalesPoint) => ({
    month: String(p.month),
    revenue: Number(p.revenue ?? 0),
    trips: Number(p.sales ?? 0),
  }));

  const financeTotal = revenueSalesGraph.reduce(
    (sum: number, p: RevenueSalesPoint) => sum + Number(p.revenue ?? 0),
    0,
  );

  const topPerformingDrivers = (dashboard.topPerformingDrivers ?? []).map(
    (d: TopPerformingDriverPoint, idx: number) => {
      const firstName = d.firstName ?? "";
      const lastName = d.lastName ?? "";
      const name = `${firstName} ${lastName}`.trim() || "Unknown driver";
      const passportUrl = d.passport?.url ?? undefined;
      const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

      return {
        id: d.id ?? idx + 1,
        name,
        trips: Number(d.trips ?? 0),
        imageUrl: passportUrl,
        initials,
      };
    },
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Admin overview" />
      <DashboardCards
        finance={financeTotal}
        vendors={vendors}
        drivers={drivers}
        fleets={fleets}
      />

      <AdminActionItems items={actionItems} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10">
        <div className="lg:col-span-7">
          <AdminRevenueChart data={chartData} />
        </div>
        <div className="lg:col-span-3">
          <AdminTopPerformersCard performers={topPerformingDrivers} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
