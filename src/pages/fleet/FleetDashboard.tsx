import { useState } from "react";
import { useGetFleetDashboard } from "@/api/fleet/dashboard/useDashboard";
import { useGetFleetProfile } from "@/api/fleet/profile/useProfile";
import FleetChart from "@/components/utilities/Fleet/FleetChart";
import FleetSectionCard, {
  type FleetSectionCardProps,
} from "@/components/utilities/Fleet/FleetSectionCard";
import PerformingDrivers from "@/components/utilities/Fleet/PerformingDrivers";
import Loader from "@/components/utilities/Loader";

export type RevenueTripsPoint = {
  month: string;
  revenue: number;
  trips: number;
};

export type PerformingDriverData = {
  id: number | string;
  name: string;
  trips: number;
  imageUrl?: string | null;
  initials?: string;
};

type FleetDashboardPayload = FleetSectionCardProps & {
  revenueTripsGraph: RevenueTripsPoint[];
  topPerformingDrivers: PerformingDriverData[];
};

type FleetDashboardResponse = {
  success: boolean;
  statusCode: number;
  data: FleetDashboardPayload;
};

type FleetProfileResponse = {
  success: boolean;
  statusCode: number;
  data: {
    firstName?: string;
    lastName?: string;
    businessName?: string;
  };
};

const TIME_FILTERS = ["7D", "30D", "3M", "1Y"] as const;

function FleetDashboard() {
  const [timeFilter, setTimeFilter] =
    useState<(typeof TIME_FILTERS)[number]>("30D");

  const {
    data,
    isLoading,
    error,
  }: { data?: FleetDashboardResponse; isLoading: boolean; error: unknown } =
    useGetFleetDashboard();
  const profile = useGetFleetProfile() as { data?: FleetProfileResponse };

  const payload = data?.data;
  const profileData = profile.data?.data;
  const greetingName =
    `${profileData?.firstName ?? ""} ${profileData?.lastName ?? ""}`.trim() ||
    profileData?.businessName ||
    "there";

  if (isLoading) {
    return <Loader />;
  }

  if (error || !payload) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="fleet-dashboard-header__title">Dashboard</h1>
          <p className="fleet-dashboard-header__subtitle">
            Unable to load dashboard data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fleet-dashboard-header__title">Dashboard</h1>
        <p className="fleet-dashboard-header__subtitle">
          Hello, {greetingName}
        </p>
      </div>

      <FleetSectionCard
        finance={payload.finance}
        vehicles={payload.vehicles}
        drivers={payload.drivers}
        trips={payload.trips}
      />

      <div className="fleet-dashboard-panels">
        <div className="fleet-dashboard-chart-card">
          <div className="fleet-dashboard-chart-card__header">
            <div>
              <h2 className="fleet-dashboard-chart-card__title">
                Monthly Revenue
              </h2>
              <p className="fleet-dashboard-chart-card__subtitle">
                Overview of revenue and trip performance
              </p>
            </div>
            <div className="fleet-finance-filter">
              {TIME_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  data-active={timeFilter === filter}
                  onClick={() => setTimeFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <FleetChart chartData={payload.revenueTripsGraph ?? []} />
        </div>

        <div className="fleet-dashboard-products-card">
          <h2 className="fleet-dashboard-chart-card__title mb-6">
            Top Performing Drivers
          </h2>
          <PerformingDrivers data={payload.topPerformingDrivers ?? []} />
        </div>
      </div>
    </div>
  );
}

export default FleetDashboard;
