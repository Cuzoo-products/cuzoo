export type TopPerformer = {
  id: number | string;
  name: string;
  trips: number;
  initials?: string;
  imageUrl?: string;
};

export default function AdminTopPerformersCard({
  performers,
}: {
  performers: TopPerformer[];
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg-card)] p-5">
      <div>
        <h3 className="text-base font-semibold text-[var(--admin-text-primary)]">
          Top Performing Drives
        </h3>
        <p className="text-xs text-[var(--admin-text-muted)]">
          This month&apos;s leading riders
        </p>
      </div>

      {performers.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-10 text-sm text-[var(--admin-text-muted)]">
          No results.
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {performers.map((p) => (
            <li key={p.id} className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--admin-bg-card-alt)] text-xs font-semibold text-[var(--admin-text-primary)]">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  p.initials ?? p.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-[var(--admin-text-primary)]">
                  {p.name}
                </div>
                <div className="text-xs text-[var(--admin-text-muted)]">
                  {p.trips} trips
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
