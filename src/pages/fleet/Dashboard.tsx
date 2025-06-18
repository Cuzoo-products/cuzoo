import FleetChart from "@/components/utilities/Fleet/FleetChart";
import FleetSectionCard from "@/components/utilities/Fleet/FleetSectionCard";
import PerformingDrivers from "@/components/utilities/Fleet/PerformingDrivers";

const chartData = [
  { month: "January", revenue: 180, trips: 74 },
  { month: "February", revenue: 186, trips: 80 },
  { month: "March", revenue: 120, trips: 20 },
  { month: "April", revenue: 110, trips: 90 },
  { month: "May", revenue: 193, trips: 30 },
  { month: "June", revenue: 170, trips: 60 },
];

export type PerformingDriverData = {
  id: number;
  name: string;
  trips: string;
  imageUrl: string;
  initials: string;
};
const performingDriverData: PerformingDriverData[] = [
  {
    id: 1,
    name: "John Doe",
    trips: "129",
    imageUrl: "https://github.com/shadcn.png",
    initials: "JD",
  },
  {
    id: 2,
    name: "Daneil Tosin",
    trips: "128",
    imageUrl: "https://github.com/shadcn.png",
    initials: "DT",
  },
  {
    id: 3,
    name: "Jane Doe",
    trips: "123",
    imageUrl: "https://github.com/shadcn.png",
    initials: "JD",
  },
  {
    id: 4,
    name: "James Doe",
    trips: "121",
    imageUrl: "https://github.com/shadcn.png",
    initials: "JD",
  },
  {
    id: 5,
    name: "Kalu Tinubu",
    trips: "117",
    imageUrl: "https://github.com/shadcn.png",
    initials: "JD",
  },
];

function Dashboard() {
  return (
    <div className="@container/main">
      <div className="my-6">
        <h3 className="!font-bold text-3xl">Dashboard</h3>
        <p>Hello, Tobiloba Ibrahim</p>
      </div>
      <FleetSectionCard />

      <div className="md:flex my-20 space-x-3">
        <div className="flex-9/12 border border-line-1 bg-secondary rounded-lg p-5">
          <FleetChart chartData={chartData} />
        </div>
        <div className="flex-3/12 border border-line-1 bg-secondary rounded-lg p-3">
          <h3 className="font-bold text-center">Top Performing Drives</h3>
          <PerformingDrivers data={performingDriverData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
