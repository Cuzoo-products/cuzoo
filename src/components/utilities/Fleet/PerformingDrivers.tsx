import type { PerformingDriverData } from "@/pages/fleet/FleetDashboard";

function PerformingDrivers({ data }: { data: PerformingDriverData[] }) {
  if (!data.length) {
    return (
      <p className="fleet-driver-row__trips">No drivers to display yet.</p>
    );
  }

  return (
    <div className="fleet-driver-list">
      {data.map((item) => (
        <div key={item.id} className="fleet-driver-row">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="fleet-driver-row__image"
            />
          ) : (
            <div
              className="fleet-driver-row__image flex items-center justify-center text-sm font-semibold text-[var(--admin-text-muted)]"
              style={{ backgroundColor: "var(--admin-border)" }}
            >
              {item.initials ?? item.name?.charAt(0) ?? "?"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="fleet-driver-row__name">{item.name}</p>
            <p className="fleet-driver-row__trips">{item.trips} trips</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PerformingDrivers;
