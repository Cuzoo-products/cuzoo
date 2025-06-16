import FleetChart from "@/components/utilities/Fleet/FleetChart";
import FleetSectionCard from "@/components/utilities/Fleet/FleetSectionCard";

const chartData = [
  { month: "January", revenue: 180, trips: 74 },
  { month: "February", revenue: 186, trips: 80 },
  { month: "March", revenue: 120, trips: 20 },
  { month: "April", revenue: 110, trips: 90 },
  { month: "May", revenue: 193, trips: 30 },
  { month: "June", revenue: 170, trips: 60 },
];

function Dashboard() {
  return (
    <div className="@container/main">
      <FleetSectionCard />
      <FleetChart chartData={chartData} />
    </div>
  );
}

export default Dashboard;
