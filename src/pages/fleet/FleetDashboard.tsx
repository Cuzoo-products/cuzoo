import { useGetFleetDashboard } from "@/api/fleet/dashboard/useDashboard";
import { useGetFleetProfile } from "@/api/fleet/profile/useProfile";
import FleetChart from "@/components/utilities/Fleet/FleetChart";
import FleetSectionCard, {
  type FleetSectionCardProps,
} from "@/components/utilities/Fleet/FleetSectionCard";
import PerformingDrivers from "@/components/utilities/Fleet/PerformingDrivers";

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

function FleetDashboard() {
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
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Dashboard</h3>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="@container/main">
        <div className="my-6">
          <h3 className="!font-bold text-3xl">Dashboard</h3>
          <p className="text-red-500">Unable to load dashboard data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Dashboard</h3>
        <p>Hello, {greetingName}</p>
      </div>

      <FleetSectionCard
        finance={payload.finance}
        vehicles={payload.vehicles}
        drivers={payload.drivers}
        trips={payload.trips}
      />

      <div className="lg:flex my-20 space-y-5 lg:space-y-0 lg:space-x-3">
        <div className="lg:flex-9/12 border border-line-1 bg-secondary rounded-lg p-5">
          <FleetChart chartData={payload.revenueTripsGraph ?? []} />
        </div>
        <div className="lg:flex-3/12 border border-line-1 bg-secondary rounded-lg p-3">
          <h3 className="font-bold text-center">Top Performing Drives</h3>
          <PerformingDrivers data={payload.topPerformingDrivers ?? []} />
        </div>
      </div>
    </div>
  );
}

export default FleetDashboard;
