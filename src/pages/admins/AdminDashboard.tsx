import DashboardCards from "@/components/utilities/Admins/DashboardCards";
import FleetChart from "@/components/utilities/Fleet/FleetChart";
import PerformingDrivers from "@/components/utilities/Fleet/PerformingDrivers";
import { useAdminDashboard } from "@/api/admin/dashboard/useDashboard";
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

  if (error) {
    return <div>Error: {error.message}</div>;
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
    // FleetChart expects `trips`; backend sends `sales`
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
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Dashboard</h3>
        <p>Admin overview</p>
      </div>
      <DashboardCards
        finance={financeTotal}
        vendors={vendors}
        drivers={drivers}
        fleets={fleets}
      />

      <div className="lg:flex my-20 space-y-5 lg:space-y-0 lg:space-x-3">
        <div className="lg:flex-9/12 border border-line-1 bg-secondary rounded-lg p-5">
          <FleetChart chartData={chartData} />
        </div>
        <div className="lg:flex-3/12 border border-line-1 bg-secondary rounded-lg p-3">
          <h3 className="font-bold text-center">Top Performing Drives</h3>
          <PerformingDrivers data={topPerformingDrivers} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
